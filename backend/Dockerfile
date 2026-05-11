# Use lightweight Python image
FROM python:3.11-slim

# Install Node.js
RUN apt-get update && apt-get install -y \
    curl \
    ffmpeg \
    libsndfile1 \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install Node.js dependencies
RUN npm install --omit=dev

# Copy Python requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir \
    numpy==2.3.3 \
    opencv-python-headless==4.13.0.92 \
    scipy==1.17.1 \
    librosa==0.11.0

# Copy project files
COPY . .

# Railway uses PORT env variable
ENV PORT=4000

# Expose port
EXPOSE 4000

# Start server
CMD ["npm", "start"]