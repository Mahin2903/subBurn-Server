FROM node:20

# Install Python and FFmpeg
RUN apt-get update && \
    apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg

# App folder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node packages
RUN npm install

# Copy Python requirements
COPY requirements.txt ./

# Install Python packages
RUN pip3 install --break-system-packages -r requirements.txt

# Copy all project files
COPY . .

# Expose Render port
EXPOSE 10000

# Start backend
CMD ["npm", "start"]