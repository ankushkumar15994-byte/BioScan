# Use the official TensorFlow GPU image which includes CUDA and cuDNN
FROM tensorflow/tensorflow:2.14.0-gpu

# Set the working directory
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install the necessary python packages
# Note: tensorflow is already installed in the base image, but pip will just verify it.
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application using uvicorn
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
