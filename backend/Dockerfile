FROM node:22-bullseye

# Install Python + system libraries
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install node dependencies
RUN npm install

# Copy requirements
COPY requirements.txt ./

# Install python dependencies
RUN pip3 install --break-system-packages -r requirements.txt

# Copy everything else
COPY . .

EXPOSE 4000

CMD ["npm", "start"]