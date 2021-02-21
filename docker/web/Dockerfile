# Pull a base image
FROM python:3.9-slim-buster

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Create a working directory for the django project
WORKDIR /django

# Install dependencies
COPY requirements.txt /django/
RUN pip install -r requirements.txt

# Copy the project files into the working directory
COPY . /django/
WORKDIR /code

# Open a port on the container
EXPOSE 8000