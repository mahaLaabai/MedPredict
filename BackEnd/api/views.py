import os
import datetime
import bcrypt
import jwt
import base64

from django.http.response import JsonResponse
from keras.saving.legacy.save import load_model
from keras_preprocessing.image import load_img, img_to_array
from numpy import argmax
from rest_framework.parsers import JSONParser
from rest_framework import status
from BackEnd.settings import SECRET_KEY
from api.models import User, MedicalFolder, Scan
from api.serializers import UserSerializer, MedicalFolderSerializer, ScanSerializer
from rest_framework.decorators import api_view
import random


def generateRandomUniqueFolderNumber():
    letters = ''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ', k=2))
    number = random.randint(1111, 9999)
    folder_name = letters + str(number)
    return folder_name


@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        element = JSONParser().parse(request)
        element_serializer = UserSerializer(data=element)
        password = element_serializer.initial_data['password']
        encrypted = bcrypt.hashpw(bytes(str(password), 'utf-8'), bcrypt.gensalt())
        print(str(encrypted).split("\'")[1])
        element_serializer.initial_data['password'] = str(encrypted).split("\'")[1]
        element_serializer.initial_data['photo'] = 'user.png'
        if element_serializer.is_valid():
            element_serializer.save()
            if element_serializer.data['role'] == 'PATIENT':
                medical_folder = MedicalFolder()
                medical_folder.patient = element_serializer.data['id']
                medical_folder.folderNumber = generateRandomUniqueFolderNumber()
                medical_folders = MedicalFolder.objects.all()
                while len(medical_folders.filter(folderNumber__icontains=medical_folder.folderNumber)) > 0:
                    medical_folder.folderNumber = generateRandomUniqueFolderNumber()
                medical_folder.save()
            data = {
                'code': 1,
                'message': 'success'
            }
            return JsonResponse(data, status=status.HTTP_200_OK)
        else:
            print(element_serializer.errors)
            data = {
                'code': 2,
                'message': 'error'
            }
        return JsonResponse(data, status=status.HTTP_200_OK)


@api_view(['POST'])
def login(request):
    try:
        if request.method == 'POST':
            element = JSONParser().parse(request)
            element_serializer = UserSerializer(data=element)
            if True:
                elements = User.objects.all()
                elements = elements.filter(email__icontains=element_serializer.initial_data['email'])
                if len(elements) > 0:
                    given_password = element_serializer.initial_data['password']
                    password = elements[0].password
                    if not elements[0].archived and bcrypt.checkpw(str(given_password).encode('utf-8'),
                                                                   str(password).encode('utf-8')):
                        if elements[0].activated:
                            token = jwt.encode({"email": element_serializer.initial_data['email']}, SECRET_KEY,
                                               algorithm="HS256")
                            data = {
                                'code': 1,
                                'id': elements[0].id,
                                'token': token,
                                'role': elements[0].role,
                                'message': 'success'
                            }
                            return JsonResponse(data, status=status.HTTP_200_OK)
                        else:
                            data = {
                                'code': 2,
                                'message': 'Your account is not activated yet, please try again later !'
                            }
                            return JsonResponse(data, status=status.HTTP_200_OK)

                    else:
                        data = {
                            'code': 3,
                            'message': 'Your account is archived !'
                        }
                        return JsonResponse(data, status=status.HTTP_200_OK)
                else:
                    data = {
                        'code': 4,
                        'message': 'there is no such account !'
                    }
                    return JsonResponse(data, status=status.HTTP_200_OK)
    except Exception as e:
        data = {
            'code': 5,
            'message': str(e)
        }
        return JsonResponse(data, status=status.HTTP_200_OK)


def predict(image_name, model_path):
    img = load_img(image_name, grayscale=True, target_size=(64, 64))
    img = img_to_array(img)
    img = img.reshape(1, 64, 64, 1)
    img = img.astype('float32')
    img = img / 255.0
    model = load_model(model_path)
    predict_value = model.predict(img)
    digit = argmax(predict_value)
    prediction = ''
    if digit == 0:
        prediction = 'glioma'
    if digit == 1:
        prediction = 'meningioma'
    if digit == 2:
        prediction = 'no_tumor'
    if digit == 3:
        prediction = 'pituitary'
    return prediction


@api_view(['GET', 'PUT', 'POST', 'PATCH', 'DELETE'])
def handle_users(request):
    token = request.headers['Authorization']
    decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    if decoded["email"] is None:
        data = {
            'code': 5,
            'message': 'unauthorized access'
        }
        return JsonResponse(data, status=status.HTTP_401_UNAUTHORIZED)
    if request.method == 'GET':
        elements = User.objects.all()
        email = request.GET.get('email', None)
        id = request.GET.get('id', None)
        role = request.GET.get('role', None)
        archived = request.GET.get('archived', None)
        if email is not None:
            elements = elements.filter(email__icontains=email, archived__exact=False)
            elements_serializer = UserSerializer(elements, many=True)
            return JsonResponse(elements_serializer.data, safe=False)
        elif role is not None and archived is not None:
            elements = elements.filter(role__exact=role, archived__exact=archived)
            elements_serializer = UserSerializer(elements, many=True)
            return JsonResponse(elements_serializer.data, safe=False)
        elif id is not None:
            element = User.objects.get(id=id)
            element_serializer = UserSerializer(element)
            return JsonResponse(element_serializer.data, safe=False)
        else:
            elements_serializer = UserSerializer(elements, many=True)
            return JsonResponse(elements_serializer.data, safe=False)
    elif request.method == 'PUT':
        id = request.GET.get('id', None)
        if id is not None:
            model = User.objects.get(id=id)
            element_serializer = UserSerializer(model, request.data)
            photo = element_serializer.initial_data['photo']
            if photo != '':
                path = os.path.dirname(os.path.realpath(__file__)) + "/static/photos/"
                name = "photo" + datetime.datetime.now().strftime("%Y%m%d%H%M%S") + ".png"
                with open(path + name, "wb") as fh:
                    fh.write(base64.decodebytes(str(photo).encode('utf-8')))
                element_serializer.initial_data['photo'] = name
            else:
                element_serializer.initial_data['photo'] = model.photo
            if element_serializer.is_valid():
                element_serializer.save()
                data = {
                    'code': 1,
                    'message': 'success'
                }
                return JsonResponse(data, status=status.HTTP_200_OK)
            else:
                data = {
                    'code': 2,
                    'message': 'error'
                }
            return JsonResponse(data, status=status.HTTP_200_OK)
    elif request.method == 'DELETE':
        user_id = request.GET.get('id', None)
        archived_id = request.GET.get('archived', None)
        if user_id is not None:
            model = User.objects.get(id=user_id)
            model.archived = True
            model.save()
            data = {
                'code': 1,
                'message': 'success'
            }
            return JsonResponse(data, status=status.HTTP_200_OK)
        elif archived_id is not None:
            model = User.objects.get(id=archived_id)
            model.archived = False
            model.save()
            data = {
                'code': 1,
                'message': 'success'
            }
            return JsonResponse(data, status=status.HTTP_200_OK)
        else:
            data = {
                'code': 2,
                'message': 'error'
            }
            return JsonResponse(data, status=status.HTTP_200_OK)
    elif request.method == 'PATCH':
        id = request.GET.get('id', None)
        if id is not None:
            model = User.objects.get(id=id)
            element_serializer = UserSerializer(model, request.data)
            if element_serializer.is_valid():
                element_serializer.save()
                data = {
                    'code': 1,
                    'message': 'success'
                }
                return JsonResponse(data, status=status.HTTP_200_OK)
            else:
                data = {
                    'code': 2,
                    'message': 'error'
                }
            return JsonResponse(data, status=status.HTTP_200_OK)


@api_view(['GET', 'PUT', 'POST', 'PATCH', 'DELETE'])
def handle_scans(request):
    token = request.headers['Authorization']
    decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    if decoded["email"] is None:
        data = {
            'code': 5,
            'message': 'unauthorized access'
        }
        return JsonResponse(data, status=status.HTTP_401_UNAUTHORIZED)
    if request.method == 'GET':
        elements = Scan.objects.all()
        id = request.GET.get('id', None)
        patient = request.GET.get('patient', None)
        ofPatient = request.GET.get('ofPatient', None)
        makeSeen = request.GET.get('makeSeen', None)

        if ofPatient is not None and makeSeen is not None:
            elements = Scan.objects.filter(patient=ofPatient)
            elements_serializer = ScanSerializer(elements, many=True)
            data = elements_serializer.data
            for item in data:
                element = Scan.objects.get(id=item['id'])
                element.seen_by_patient = True
                element.save()
            return JsonResponse(data, safe=False)

        if ofPatient is not None and makeSeen is None:
            elements = Scan.objects.filter(patient=ofPatient)
            elements_serializer = ScanSerializer(elements, many=True)
            data = elements_serializer.data
            return JsonResponse(data, safe=False)
        elif patient is not None:
            element = Scan.objects.filter(patient=patient)
            element_serializer = ScanSerializer(element)
            data = element_serializer.data
            element.seen_by_patient = True
            element.save()
            return JsonResponse(data, safe=False)
        elif id is not None:
            element = Scan.objects.get(id=id)
            element_serializer = ScanSerializer(element)
            return JsonResponse(element_serializer.data, safe=False)
        else:
            elements_serializer = ScanSerializer(elements, many=True)
            return JsonResponse(elements_serializer.data, safe=False)

    elif request.method == 'PUT':
        id = request.GET.get('id', None)
        if id is not None:
            model = Scan.objects.get(id=id)
            model.processed = True
            model.save()
            data = {
                'code': 1,
                'message': 'success'
            }
            return JsonResponse(data, status=status.HTTP_200_OK)
        else:
            data = {
                'code': 2,
                'message': 'error'
            }
            return JsonResponse(data, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        element_serializer = ScanSerializer(data=request.data)
        base64_string = element_serializer.initial_data['scan_file']
        path = os.path.dirname(os.path.realpath(__file__)) + "/static/photos/"
        model_path = os.path.dirname(os.path.realpath(__file__)) + "/models/"
        name = "scan" + datetime.datetime.now().strftime("%Y%m%d%H%M%S") + ".jpg"
        with open(path + name, "wb") as fh:
            fh.write(base64.decodebytes(str(base64_string).encode('utf-8')))
        element_serializer.initial_data['scan_file'] = name
        prediction_result = predict(path + name, model_path + "final.h5")
        element_serializer.initial_data['scan_result'] = prediction_result.upper()
        print(prediction_result)
        if element_serializer.is_valid():
            element_serializer.save()
            data = {
                'code': 1,
                'message': 'success'
            }
            return JsonResponse(data, status=status.HTTP_200_OK)
        else:
            print(element_serializer.errors)
            data = {
                'code': 2,
                'message': 'error'
            }
        return JsonResponse(data, status=status.HTTP_200_OK)
    elif request.method == 'DELETE':
        user_id = request.GET.get('id', None)
        archived_id = request.GET.get('archived', None)
        if user_id is not None:
            model = Scan.objects.get(id=user_id)
            model.archived = True
            model.save()
            data = {
                'code': 1,
                'message': 'success'
            }
            return JsonResponse(data, status=status.HTTP_200_OK)
        elif archived_id is not None:
            model = Scan.objects.get(id=archived_id)
            model.archived = False
            model.save()
            data = {
                'code': 1,
                'message': 'success'
            }
            return JsonResponse(data, status=status.HTTP_200_OK)
        else:
            data = {
                'code': 2,
                'message': 'error'
            }
            return JsonResponse(data, status=status.HTTP_200_OK)
    elif request.method == 'PATCH':
        id = request.GET.get('id', None)
        if id is not None:
            model = Scan.objects.get(id=id)
            element_serializer = ScanSerializer(model, request.data)
            if element_serializer.is_valid():
                element_serializer.save()
                data = {
                    'code': 1,
                    'message': 'success'
                }
                return JsonResponse(data, status=status.HTTP_200_OK)
            else:
                data = {
                    'code': 2,
                    'message': 'error'
                }
            return JsonResponse(data, status=status.HTTP_200_OK)


@api_view(['GET', 'PUT', 'POST', 'PATCH', 'DELETE'])
def handle_medicalfolders(request):
    token = request.headers['Authorization']
    decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    if decoded["email"] is None:
        data = {
            'code': 5,
            'message': 'unauthorized access'
        }
        return JsonResponse(data, status=status.HTTP_401_UNAUTHORIZED)
    if request.method == 'GET':
        elements = MedicalFolder.objects.all()
        patient = request.GET.get('patient', None)
        id = request.GET.get('id', None)
        role = request.GET.get('role', None)
        archived = request.GET.get('archived', None)
        if patient is not None:
            elements = elements.filter(patient=patient)
            elements_serializer = MedicalFolderSerializer(elements, many=True)
            return JsonResponse(elements_serializer.data, safe=False)
        elif role is not None and archived is not None:
            elements = elements.filter(role__exact=role, archived__exact=archived)
            elements_serializer = MedicalFolderSerializer(elements, many=True)
            return JsonResponse(elements_serializer.data, safe=False)
        elif id is not None:
            element = User.objects.get(id=id)
            element_serializer = MedicalFolderSerializer(element)
            return JsonResponse(element_serializer.data, safe=False)
        else:
            elements_serializer = MedicalFolderSerializer(elements, many=True)
            return JsonResponse(elements_serializer.data, safe=False)
    elif request.method == 'PUT':
        patient = request.GET.get('patient', None)
        if patient is not None:
            model = MedicalFolder.objects.get(patient=patient)
            element_serializer = MedicalFolderSerializer(model, request.data)
            if element_serializer.is_valid():
                element_serializer.save()
                data = {
                    'code': 1,
                    'message': 'success'
                }
                return JsonResponse(data, status=status.HTTP_200_OK)
            else:
                print(element_serializer.errors)
                data = {
                    'code': 2,
                    'message': 'error'
                }
                return JsonResponse(data, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        element = JSONParser().parse(request)
        element_serializer = MedicalFolderSerializer(data=element)
        if element_serializer.is_valid():
            element_serializer.save()
            data = {
                'code': 1,
                'message': 'success'
            }
            return JsonResponse(data, status=status.HTTP_200_OK)
        else:
            data = {
                'code': 2,
                'message': 'error'
            }
        return JsonResponse(data, status=status.HTTP_200_OK)
    elif request.method == 'DELETE':
        user_id = request.GET.get('id', None)
        archived_id = request.GET.get('archived', None)
        if user_id is not None:
            model = User.objects.get(id=user_id)
            model.archived = True
            model.save()
            data = {
                'code': 1,
                'message': 'success'
            }
            return JsonResponse(data, status=status.HTTP_200_OK)
        elif archived_id is not None:
            model = User.objects.get(id=archived_id)
            model.archived = False
            model.save()
            data = {
                'code': 1,
                'message': 'success'
            }
            return JsonResponse(data, status=status.HTTP_200_OK)
        else:
            data = {
                'code': 2,
                'message': 'error'
            }
            return JsonResponse(data, status=status.HTTP_200_OK)
    elif request.method == 'PATCH':
        id = request.GET.get('id', None)
        if id is not None:
            model = User.objects.get(id=id)
            element_serializer = MedicalFolderSerializer(model, request.data)
            if element_serializer.is_valid():
                element_serializer.save()
                data = {
                    'code': 1,
                    'message': 'success'
                }
                return JsonResponse(data, status=status.HTTP_200_OK)
            else:
                data = {
                    'code': 2,
                    'message': 'error'
                }
            return JsonResponse(data, status=status.HTTP_200_OK)
