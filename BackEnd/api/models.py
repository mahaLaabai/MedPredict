from django.db import models


class User(models.Model):
    first_name = models.CharField(max_length=240, blank=False, default='')
    last_name = models.CharField(max_length=240, blank=False, default='')
    email = models.CharField(max_length=240, blank=False, default='', unique=True)
    phone_number = models.CharField(max_length=240, blank=False, default='', unique=True)
    address = models.CharField(max_length=240, blank=False, default='')
    photo = models.CharField(max_length=240, blank=False, default='')
    password = models.CharField(max_length=240, blank=False, default='')
    role = models.CharField(max_length=240, blank=False, default='')
    activated = models.BooleanField(default=False)
    archived = models.BooleanField(default=False)


class MedicalFolder(models.Model):
    patient = models.IntegerField(blank=True, default=0)
    folderNumber = models.CharField(max_length=240, blank=True, default='')
    service = models.CharField(max_length=240, blank=True, default='')
    nationality = models.CharField(max_length=240, blank=True, default='')
    gender = models.CharField(max_length=240, blank=True, default='')
    birth_date = models.CharField(max_length=240, blank=True, default='')
    blood_group = models.CharField(max_length=240, blank=True, default='')
    medical_cover = models.CharField(max_length=240, blank=True, default='')
    status_report = models.CharField(max_length=500, blank=True, default='')
    analysis = models.CharField(max_length=240, blank=True, default='')
    practitioner_doctor = models.IntegerField(blank=True, default=0)
    Temperature = models.CharField(max_length=240, blank=True, default='')
    Tension = models.CharField(max_length=240, blank=True, default='')
    Taille = models.CharField(max_length=240, blank=True, default='')
    Poids = models.CharField(max_length=240, blank=True, default='')
    Diabette = models.CharField(max_length=240, blank=True, default='')
    maladie_coronariennes=models.CharField(max_length=240, blank=True, default='')
    maladie_cérébrales=models.CharField(max_length=240, blank=True, default='')
    maladie_Poumon=models.CharField(max_length=240, blank=True, default='')
    maladie_fois=models.CharField(max_length=240, blank=True, default='')
    autre=models.CharField(max_length=240, blank=True, default='')
    maladiechronique=models.CharField(max_length=240, blank=True, default='')
    allergie=models.CharField(max_length=240, blank=True, default='')


class Scan(models.Model):
    patient = models.IntegerField(blank=False, default=0)
    scan_file = models.CharField(max_length=240, blank=False, default='')
    scan_result = models.CharField(max_length=240, blank=False, default='')
    added_at = models.CharField(max_length=240, blank=False, default='')
    processed = models.BooleanField(default=False)
    seen_by_patient = models.BooleanField(default=False)
