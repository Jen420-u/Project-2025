# Generated by Django 5.1.5 on 2025-02-21 11:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sneakers_app', '0004_size_product_is_new_review_productsize'),
    ]

    operations = [
        migrations.AddField(
            model_name='size',
            name='eu_size',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
    ]
