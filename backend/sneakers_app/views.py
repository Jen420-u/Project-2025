from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from rest_framework.permissions import AllowAny
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Product, Cart, CartItem, Review, Order
from django.conf import settings
import requests
from decimal import Decimal
import uuid
from .serializers import (
    ProductSerializer, CartItemSerializer, SimpleCartSerializer, CartSerializer, UserSerializer,
    DetailedProductSerializer, ReviewSerializer, NewArrivalProductSerializer, CustomUserSerializer
)

BASE_URL = "http://localhost:5173"

# Fetch all products
@api_view(["GET"])
def products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

# Get detailed product view
@api_view(["GET"])
def product_detail(request, slug):
    product = get_object_or_404(Product, slug=slug)
    serializer = DetailedProductSerializer(product)
    return Response(serializer.data)

@api_view(['GET'])
def product_search(request):
    query = request.GET.get("q", "")
    brand = request.GET.get("brand", "")
    
    products = Product.objects.all()
    # Filter by name or description (if the query is provided)
    if query:
        products = products.filter(name__icontains=query) | products.filter(description__icontains=query)
    # Filter by brand (if the brand is provided)
    if brand:
        products = products.filter(brand__iexact=brand)
    # Serialize the filtered products
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def sale_products(request):
    products = Product.objects.filter(is_on_sale=True, discount_percent__gt=0)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

# Fetch new arrival products
@api_view(["GET"])
def new_arrivals(request):
    products = Product.objects.filter(is_new=True)
    serializer = NewArrivalProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def men_products(request):
    products = Product.objects.filter(category="Men")  # Fetch only Men's products
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def women_products(request):
    products = Product.objects.filter(category="Women")  # Fetch only Women's products
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def kids_products(request):
    products = Product.objects.filter(category="Kids")  # Fetch only Kids' products
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def get_brand(request, brand):
    products = Product.objects.filter(brand__iexact=brand)  # Fetch brand
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


# Add item to the cart
@api_view(["POST"])
def add_item(request):
    try:
        cart_code = request.data.get("cart_code")
        product_id = request.data.get("product_id")

        cart, created = Cart.objects.get_or_create(cart_code=cart_code)
        product = get_object_or_404(Product, id=product_id)

        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)

        # Check stock before incrementing
        if cart_item.quantity + 1 > product.stock_quantity:
            return Response({"error": "Not enough stock available."}, status=status.HTTP_400_BAD_REQUEST)

        cart_item.quantity
        cart_item.save()

        serializer = CartItemSerializer(cart_item)
        return Response({"data": serializer.data, "message": "CartItem added successfully"}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Check if a product exists in the cart
@api_view(["GET"])
def product_in_cart(request):
    cart_code = request.query_params.get("cart_code")
    product_id = request.query_params.get("product_id")

    cart = get_object_or_404(Cart, cart_code=cart_code)
    product = get_object_or_404(Product, id=product_id)

    product_exists_in_cart = CartItem.objects.filter(cart=cart, product=product).exists()
    return Response({'product_in_cart': product_exists_in_cart})

# Get cart statistics (e.g., total price and item count)
@api_view(["GET"])
def get_cart_stat(request):
    cart_code = request.query_params.get("cart_code")
    cart = get_object_or_404(Cart, cart_code=cart_code, paid=False)
    serializer = SimpleCartSerializer(cart)
    return Response(serializer.data)

# Get full cart details (items, total, etc.)
@api_view(["GET"])
def get_cart(request):
    cart_code = request.query_params.get("cart_code")
    cart = get_object_or_404(Cart, cart_code=cart_code, paid=False)
    serializer = CartSerializer(cart)
    return Response(serializer.data)

# Update cart item quantity
@api_view(["PATCH"])
def update_quantity(request):
    try:
        cartitem_id = request.data.get("item_id")
        quantity = request.data.get("quantity")

        # Check if required data is provided
        if cartitem_id is None or quantity is None:
            return Response(
                {"error": "Missing 'item_id' or 'quantity'."},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY
            )

        try:
            quantity = int(quantity)
        except ValueError:
            return Response(
                {"error": "'quantity' must be an integer."},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY
            )

        # Validate positive quantity
        if quantity <= 0:
            return Response(
                {"error": "Quantity must be greater than 0."},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY
            )

        cart_item = get_object_or_404(CartItem, id=cartitem_id)
        product = cart_item.product

        # Check if requested quantity is available in stock
        if quantity > product.stock_quantity:
            return Response(
                {"error": f"Only {product.stock_quantity} units available in stock."},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY
            )

        # Save the updated quantity
        cart_item.quantity = quantity
        cart_item.save()

        serializer = CartItemSerializer(cart_item)
        return Response({
            "data": serializer.data,
            "message": "Cart item updated successfully!"
        })

    except Exception as e:
        return Response(
            {"error": f"Server error: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Delete cart item
@api_view(["POST"])
def delete_cartitem(request):
    cartitem_id = request.data.get("item_id")
    cart_item = get_object_or_404(CartItem, id=cartitem_id)
    cart_item.delete()
    return Response({"message": "Item deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

# Get logged-in user details (username)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_username(request):
    user = request.user
    return Response({"username": user.username})

# Fetch logged-in user information
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_info(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([AllowAny])
def forgot_password(request):
    email = request.data.get("email")
    if not email:
        return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # Don't reveal whether the email exists
        return Response({"message": "If an account with this email exists, a reset link has been sent."}, status=status.HTTP_200_OK)

    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)

    reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"

    subject = "Reset Your Password"
    message = render_to_string("emails/password_reset_email.html", {
        "user": user,
        "reset_link": reset_link,
    })

    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email], fail_silently=False)

    return Response({"message": "Password reset email sent."}, status=status.HTTP_200_OK)

@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Submit a review for a product
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_review(request, slug):
    """Allows an authenticated user to submit or update a review for a product."""
    product = get_object_or_404(Product, slug=slug)
    user = request.user
    rating_value = request.data.get("rating")
    comment = request.data.get("comment")

    # Validate rating and comment input
    if rating_value is None or not comment.strip():
        return Response({"error": "Rating and comment are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        rating_value = int(rating_value)
        if not (1 <= rating_value <= 5):
            return Response({"error": "Rating must be between 1 and 5."}, status=status.HTTP_400_BAD_REQUEST)
    except ValueError:
        return Response({"error": "Invalid rating value."}, status=status.HTTP_400_BAD_REQUEST)

    # Update or create the review, directly setting the rating in the Review model
    review, created = Review.objects.update_or_create(
        product=product,
        user=user,
        defaults={"rating": rating_value, "comment": comment}  # Directly save the rating in Review
    )

    message = "Review updated successfully." if not created else "Review submitted successfully."

    return Response(
        {"message": message, "data": ReviewSerializer(review).data},
        status=status.HTTP_201_CREATED
    )

# Get all reviews for a product
@api_view(["GET"])
def get_reviews(request, slug):
    """Retrieve all reviews for a given product."""
    product = get_object_or_404(Product, slug=slug)
    reviews = product.reviews.select_related("user").all()  # Optimized query to include user
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def initiate_payment(request):
    user = request.user

    try:
        cart_code = request.data.get("cart_code")
        if not cart_code:
            return Response({'error': 'Cart code is required'}, status=status.HTTP_400_BAD_REQUEST)

        cart = Cart.objects.filter(cart_code=cart_code).first()
        if not cart:
            return Response({'error': 'Cart not found for the provided cart code'}, status=status.HTTP_404_NOT_FOUND)

        if not cart.items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        amount = sum([item.quantity * item.product.price for item in cart.items.all()])
        tax = Decimal("4.00")
        total_amount = (amount + tax) * 100  # Convert to paisa

        o_id = str(uuid.uuid4())

        # Extract product names
        product_names = ", ".join([item.product.name for item in cart.items.all()])

        # Create Order Entry and Save Product Names
        order = Order.objects.create(
            ord_id=o_id,
            cart=cart,
            total_price=total_amount / 100,
            currency="NPR",
            user=user,
            status='pending',
            products=product_names  # Save product names in Order model
        )

        cart_data = {
            "cart_code": cart.cart_code,
            "total_items": cart.items.count(),
            "total_price": total_amount,
            "products": [
                {
                    "name": item.product.name,
                    "quantity": item.quantity,
                    "price": item.product.price,
                    "total_price": item.quantity * item.product.price
                }
                for item in cart.items.all()
            ]
        }

        khalti_payload = {
            "purchase_order_id": o_id,
            "purchase_order_name": cart_code,
            "amount": int(total_amount),
            "return_url": f"{BASE_URL}/payment-status/",
            "website_url": BASE_URL,
            "customer_info": {
                "email": user.email,
                "name": user.username,
                "phone": user.phone
            },
            "customizations": {
                "title": "Sneaks'n Foot Payment"
            }
        }

        headers = {
            "Authorization": f"Key {settings.KHALTI_SECRET_KEY}",
            "Content-type": "application/json",
        }

        # Send request to Khalti API to initiate payment
        response = requests.post(  
            settings.KHALTI_VERIFY_URL, ##settings.KHALTI_VERIFY_URL = "https://khalti.com/api/v2/epayment/initiate/"
            json=khalti_payload,
            headers=headers
        )

        if response.status_code == 200:
            try:
                khalti_data = response.json()
                return Response({
                    "Verified": True,
                    "message": "Khalti payment initiated",
                    "order_id": o_id,
                    "cart": cart_data,
                    "khalti_response": khalti_data
                }, status=status.HTTP_200_OK)
            except ValueError:
                return Response({'error': 'Invalid JSON response from Khalti'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({
                'error': 'Error from Khalti API',
                'details': response.text
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_khalti_payment(request):
    """
    Verifies the Khalti payment using the provided pidx (Payment ID).
    """
    try:
        pidx = request.data.get("pidx")  # Get pidx from frontend
        if not pidx:
            return Response({'error': 'Payment ID (pidx) is required'}, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.filter(ord_id=request.data.get("order_id")).first()
        if not order:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

        # Prepare request for Khalti verification
        verify_payload = {
            "pidx": pidx
        }

        headers = {
            "Authorization": f"Key {settings.KHALTI_SECRET_KEY}",
            "Content-type": "application/json",
        }

        # Send request to Khalti API to verify payment
        response = requests.post(
            settings.KHALTI_LOOKUP_URL,  # Use live URL for production
            json=verify_payload,
            headers=headers
        )

        if response.status_code == 200:
            khalti_data = response.json()
            if khalti_data.get("status") == "Completed":
                # Update order status if payment is successful
                order.status = "completed"
                order.save()

                cart = order.cart  # Assuming order has ForeignKey to Cart as `cart`
                cart_items = cart.items.all()

                # Re-check and reduce stock
                for item in cart_items:
                    product = item.product
                    if item.quantity > product.stock_quantity:
                        return Response({
                            "error": f"Not enough stock for {product.name}. Only {product.stock_quantity} left."
                        }, status=status.HTTP_400_BAD_REQUEST)

                # Deduct stock
                for item in cart_items:
                    product = item.product
                    product.stock_quantity -= item.quantity
                    product.save()

                cart.paid = True
                cart.save()
                
                return Response({
                    "verified": True,
                    "message": "Payment verified successfully",
                    "order_id": order.ord_id,
                    "transaction_info": khalti_data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "error": "Payment verification failed",
                    "details": khalti_data
                }, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "error": "Error from Khalti API",
            "details": response.text
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
