FROM nikolaik/python-nodejs:python3.11-nodejs20

WORKDIR /app

# Install system FFmpeg with libass + Bengali font
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libass9 \
    fonts-noto \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY package*.json .
RUN npm install

COPY . .

CMD ["node", "src/index.js"]