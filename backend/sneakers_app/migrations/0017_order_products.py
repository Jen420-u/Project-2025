# Generated by Django 5.1.5 on 2025-03-30 09:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sneakers_app', '0016_remove_order_product_names_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='products',
            field=models.TextField(blank=True, null=True),
        ),
    ]
