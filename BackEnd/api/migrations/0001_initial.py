# Generated by Django 3.0.5 on 2023-04-21 17:19

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='MedicalFolder',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('patient', models.IntegerField(default=0)),
                ('folderNumber', models.CharField(default='', max_length=240)),
                ('service', models.CharField(default='', max_length=240, unique=True)),
                ('nationality', models.CharField(default='', max_length=240, unique=True)),
                ('gender', models.CharField(default='', max_length=240)),
                ('birth_date', models.CharField(default='', max_length=240)),
                ('blood_group', models.CharField(default='', max_length=240)),
                ('medical_cover', models.CharField(default='', max_length=240)),
                ('status_report', models.CharField(default='', max_length=500)),
                ('analysis', models.CharField(default='', max_length=240)),
                ('practitioner_doctor', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Scan',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('patient', models.IntegerField(default=0)),
                ('scan_file', models.CharField(default='', max_length=240)),
                ('scan_result', models.CharField(default='', max_length=240)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(default='', max_length=240)),
                ('last_name', models.CharField(default='', max_length=240)),
                ('email', models.CharField(default='', max_length=240, unique=True)),
                ('phone_number', models.CharField(default='', max_length=240, unique=True)),
                ('address', models.CharField(default='', max_length=240)),
                ('photo', models.CharField(default='', max_length=240)),
                ('password', models.CharField(default='', max_length=240)),
                ('role', models.CharField(default='', max_length=240)),
                ('activated', models.BooleanField(default=False)),
                ('archived', models.BooleanField(default=False)),
            ],
        ),
    ]
