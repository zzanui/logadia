# Use the official Python image from the Docker Hub
FROM python:3.12

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt /app/

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . /app/

# Run the application

CMD sh -c "python manage.py runserver 0.0.0.0:8000"

#처음 프로젝트 설치시에만 사용
# CMD sh -c "django-admin startproject config . && python manage.py runserver 0.0.0.0:8000"