# Generated by Django 3.2.18 on 2023-05-05 15:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_auto_20230501_1136'),
    ]

    operations = [
        migrations.AddField(
            model_name='medicalfolder',
            name='Diabette',
            field=models.CharField(blank=True, default='', max_length=240),
        ),
        migrations.AddField(
            model_name='medicalfolder',
            name='Poids',
            field=models.CharField(blank=True, default='', max_length=240),
        ),
        migrations.AddField(
            model_name='medicalfolder',
            name='Taille',
            field=models.CharField(blank=True, default='', max_length=240),
        ),
        migrations.AddField(
            model_name='medicalfolder',
            name='Temperature',
            field=models.CharField(blank=True, default='', max_length=240),
        ),
        migrations.AddField(
            model_name='medicalfolder',
            name='Tension',
            field=models.CharField(blank=True, default='', max_length=240),
        ),
    ]
