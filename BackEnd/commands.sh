conda create -n env python=3.7
conda activate env
pip freeze > requirements.txt
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
