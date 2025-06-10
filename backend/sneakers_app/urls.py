from django.urls import path
from . import views

urlpatterns = [
    path("products", views.products, name="products"),
    path("product_detail/<slug:slug>/", views.product_detail, name="product_detail"),
    path("product_search/", views.product_search, name="product_search"),
    path("sale_products/", views.sale_products, name="sale_products"),
    path("new_arrivals/", views.new_arrivals, name="new_arrivals"),
    path("men_products/", views.men_products, name="men_products"),
    path("women_products/", views.women_products, name="women_products"),
    path("kids_products/", views.kids_products, name="kids_products"),
    path("get_brand/<str:brand>/", views.get_brand, name="get_brand"),
    path("add_item/", views.add_item, name="add_item"),
    path("product_in_cart", views.product_in_cart, name="product_in_cart"),
    path("get_cart_stat", views.get_cart_stat, name="get_cart_stat"),
    path("get_cart", views.get_cart, name="get_cart"),
    path("update_quantity/", views.update_quantity, name="update_quantity"),
    path("delete_cartitem/", views.delete_cartitem, name="delete_cartitem"),
    path("get_username", views.get_username, name="get_username"),
    path("user_info", views.user_info, name="user_info"),
    path('password-reset/', views.forgot_password, name='password_reset'),
    path('register/', views.register, name="register"),
    path("submit_review/<slug:slug>/", views.submit_review, name="submit_review"),  
    path("get_reviews/<slug:slug>/", views.get_reviews, name="get_reviews"),
    path("initiate/", views.initiate_payment, name="initiate"),
    path("verify/", views.verify_khalti_payment, name="verify"),
]
