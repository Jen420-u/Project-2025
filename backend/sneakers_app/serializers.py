from rest_framework import serializers
from .models import Product, Cart, CartItem, Review, Order
from django.contrib.auth import get_user_model
from decimal import Decimal

class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)  
    stars = serializers.SerializerMethodField() 

    class Meta:
        model = Review
        fields = ["id", "product", "username", "rating", "stars", "comment", "created_at"]

    def get_stars(self, obj):
        """Convert the rating field to stars (★ for the rating and ☆ for the empty ones)."""
        return "★" * obj.rating + "☆" * (5 - obj.rating) 

class ProductSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    discounted_price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_average_rating(self, product):
        """Calculate average rating for the product based on the reviews."""
        reviews = product.reviews.all()  # Get all reviews for the product
        valid_ratings = [review.rating for review in reviews if review.rating is not None]  # Avoid None values
        return round(sum(valid_ratings) / len(valid_ratings), 1) if valid_ratings else 0.0  # Ensure float return

    def get_discounted_price(self, product):
        """Calculate and return the discounted price if the product is on sale."""
        return product.discounted_price() if product.is_on_sale else None  # Return None if not on sale

# Detailed Product Serializer (Includes similar products and reviews)
class DetailedProductSerializer(serializers.ModelSerializer):
    similar_products = serializers.SerializerMethodField()
    reviews = ReviewSerializer(many=True, read_only=True)
    discounted_price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id", "name", "description", "price", "stock_quantity", "image", "slug",
            "category", "brand", "created_at", "updated_at", "is_active",
            "similar_products", "reviews", "discounted_price"
        ]

    def get_similar_products(self, product):
        products = Product.objects.filter(category=product.category).exclude(id=product.id)
        serializer = ProductSerializer(products, many=True)
        return serializer.data
    
    def get_average_rating(self, product):
        """Calculate average rating for the product based on the reviews."""
        reviews = product.reviews.all()  # Get all reviews for the product
        valid_ratings = [review.rating for review in reviews if review.rating is not None]  # Avoid None values
        return round(sum(valid_ratings) / len(valid_ratings), 1) if valid_ratings else 0.0  # Ensure float return

    def get_discounted_price(self, product):
        """Calculate and return the discounted price if the product is on sale."""
        return product.discounted_price() if product.is_on_sale else None  # Return None if not on sale

# New Arrival Serializer (Ensuring `is_new` field exists in Product model)
class NewArrivalProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "name", "image", "price", "is_new", "discounted_price", "slug"]

# Cart Item Serializer (No change, just includes total price)
class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ["id", "quantity", "product", "total"]

    def get_total(self, cartitem):
        product = cartitem.product
        price = product.price  # price is already a Decimal

    # Apply discount if the product is on sale
        if product.is_on_sale and product.discount_percent > 0:
            discount_amount = (Decimal(product.discount_percent) / Decimal(100)) * price
            price -= discount_amount  # Apply discount

        total_price = price * cartitem.quantity
        return round(total_price, 2)  # Ensure 2 decimal places

# Cart Serializer (Modified to include total price and number of items)
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(read_only=True, many=True)
    sum_total = serializers.SerializerMethodField()
    num_of_items = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ["id", "cart_code", "items", "sum_total", "num_of_items", "created_at", "modified_at"]

    def get_sum_total(self, cart):
        items = cart.items.all()
        total = sum([item.product.price * item.quantity for item in items])
        return total

    def get_num_of_items(self, cart):
        items = cart.items.all()
        total = sum([item.quantity for item in items])
        return total


# Simple Cart Serializer (For quick access to cart summary)
class SimpleCartSerializer(serializers.ModelSerializer):
    num_of_items = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ["id", "cart_code", "num_of_items"]

    def get_num_of_items(self, cart):
        num_of_items = sum([item.quantity for item in cart.items.all()])
        return num_of_items

class NewCartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    order_id = serializers.SerializerMethodField()
    order_date = serializers.SerializerMethodField()
    class Meta:
        model = CartItem
        fields = ["id", "product", "quantity", "order_id", "order_date"]

    def get_order_id(self, cartitem):
        order_id = cartitem.cart.cart_code
        return order_id
    
    def get_order_date(self, cartitem):
        order_date = cartitem.cart.modified_at
        return order_date

# User Serializer (Including user-related details)
class UserSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()
    class Meta:
        model = get_user_model()
        fields = [
            "id", "username", "first_name", "last_name", "email", "address", "country",
            "phone", "city", "member_since", "state", "items"
        ]

    def get_items(self, user):
        cartitems = CartItem.objects.filter(cart__orders__user=user, cart__orders__status='completed')[:10]
        serializer = NewCartItemSerializer(cartitems, many=True)
        return serializer.data

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['username', 'email', 'password', 'city', 'state', 'address', 'phone', 'country']

    def create(self, validated_data):
        user = get_user_model().objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            city=validated_data.get('city'),
            state=validated_data.get('state'),
            address=validated_data.get('address'),
            phone=validated_data.get('phone'),
            country=validated_data.get('country'),
        )
        return user
    
class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'