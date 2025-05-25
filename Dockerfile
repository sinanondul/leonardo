FROM python:3.12-slim

# Set environment variables to optimize Python
# Prevents Python from writing .pyc files
ENV PYTHONDONTWRITEBYTECODE=1  
ENV PYTHONUNBUFFERED=1         
# Ensures Python output is sent straight to terminal

# Set the working directory in the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy project code
COPY . /app/

# Expose port
EXPOSE 8000

# Set up entrypoint script
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Run entrypoint script
ENTRYPOINT ["/app/docker-entrypoint.sh"]