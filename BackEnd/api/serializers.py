from rest_framework import serializers
from api.models import User, MedicalFolder, Scan


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id',
                  'first_name',
                  'last_name',
                  'email',
                  'phone_number',
                  'address',
                  'photo',
                  'password',
                  'role',
                  'activated',
                  'archived')
        extra_kwargs = {
            'email': {'required': False},
            'password': {'required': False},
            'first_name': {'required': False},
            'last_name': {'required': False},
            'phone_number': {'required': False},
            'address': {'required': False},
            'photo': {'required': False},
            'role': {'required': False},
            'activated': {'required': False},
            'archived': {'required': False}
        }


class MedicalFolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalFolder
        fields = ('id',
                  'patient',
                  'folderNumber',
                  'service',
                  'nationality',
                  'gender',
                  'birth_date',
                  'blood_group',
                  'medical_cover',
                  'status_report',
                  'analysis',
                  'practitioner_doctor',
                  'Temperature',
                  'Tension',
                  'Taille',
                  'Poids',
                  'Diabette',
                  'maladie_coronariennes',
                  'maladie_cérébrales',
                  'maladie_Poumon',
                  'maladie_fois',
                  'autre',
                  'maladiechronique',
                  'allergie')
        extra_kwargs = {
            'id': {'required': False},
            'patient': {'required': False},
            'folderNumber': {'required': False},
            'service': {'required': False},
            'nationality': {'required': False},
            'gender': {'required': False},
            'birth_date': {'required': False},
            'blood_group': {'required': False},
            'medical_cover': {'required': False},
            'status_report': {'required': False},
            'analysis': {'required': False},
            'practitioner_doctor': {'required': False},
            'Temperature': {'required': False},
            'Tension': {'required': False},
            'Taille': {'required': False},
            'Poids': {'required': False},
            'Diabette': {'required': False},
        }

class ScanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scan
        fields = ('id', 'patient', 'scan_file', 'scan_result', 'added_at', 'processed', 'seen_by_patient')
        extra_kwargs = {
            'id': {'required': False},
            'patient': {'required': False},
            'scan_file': {'required': False},
            'scan_result': {'required': False},
            'added_at': {'required': False},
            'processed': {'required': False},
            'seen_by_patient': {'required': False}
        }
