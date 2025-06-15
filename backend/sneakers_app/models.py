from django.db import models
from django.utils.text import slugify
from django.conf import settings
from decimal import Decimal

class Product(models.Model):
    CATEGORY = (
        ("Men", "Men"),
        ("Women", "Women"),
        ("Kids", "Kids"),
    )

    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.PositiveIntegerField()
    image = models.ImageField(upload_to='product_images/')
    slug = models.SlugField(unique=True, blank=True)
    category = models.CharField(max_length=5, choices=CATEGORY, default="Men")
    brand = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_new = models.BooleanField(default=True)  # New arrival checkmark
    is_on_sale = models.BooleanField(default=False)
    discount_percent = models.PositiveIntegerField(default=0)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            self.slug = base_slug
            count = 1
            while Product.objects.filter(slug=self.slug).exists():
                self.slug = f"{base_slug}-{count}"
                count += 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    
    def discounted_price(self):
        """Calculate the discounted price if the product is on sale"""
        if self.is_on_sale and self.discount_percent > 0:
            # Ensure both self.price and self.discount_percent are Decimal
            price = Decimal(self.price)  # Convert price to Decimal if it's not
            discount_percent = Decimal(self.discount_percent)  # Convert discount_percent to Decimal if it's not
            return round(price * (1 - discount_percent / Decimal(100)), 2)  # Use Decimal(100)
        return Decimal(self.price) 

    def average_rating(self):
        reviews = self.reviews.all()  # Get all reviews for this product
        if reviews:
            return sum([review.rating for review in reviews]) / len(reviews)  # Calculate average rating
        return 0  # If no reviews, return 0

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(choices=[(i, i) for i in range(1, 6)])  # Ratings from 1 to 5
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.user.username} for {self.product.name}"


class Cart(models.Model):
    cart_code = models.CharField(max_length=11, unique=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True, null=True)
    paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    modified_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return self.cart_code

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} in cart {self.cart.id}"
    
class Order(models.Model):
    PAYMENT_METHODS = [
        ('KHALTI', 'Khalti Payment')
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]

    ord_id = models.CharField(max_length=255, unique=True, db_index=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True, null=True)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='orders', blank=True, null=True)
    currency = models.CharField(max_length=10, default="NPR")
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHODS)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    products = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Order {self.ord_id} - {self.user} ({self.status} - {self.payment_method})"
