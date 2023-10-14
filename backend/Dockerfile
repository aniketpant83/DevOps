# Use an official Python runtime as a parent image
FROM python:3.8


RUN mkdir /usr/src/backend
# Set the working directory in the container
WORKDIR /usr/src/backend

# Copy the current directory contents into the container at /app
COPY . .

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

EXPOSE 5000

# Run app.py when the container launches
CMD ["python", "app.py"]
