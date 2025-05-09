# Generated by Django 5.1.7 on 2025-05-01 06:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('EasyLang', '0011_review'),
    ]

    operations = [
        migrations.AddField(
            model_name='module',
            name='is_test',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='module',
            name='order',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='module',
            name='paid',
            field=models.BooleanField(default=False),
        ),
    ]
