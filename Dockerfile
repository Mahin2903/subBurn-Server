FROM nikolaik/python-nodejs:python3.11-nodejs20

WORKDIR /app

# ffmpeg-static already included in your npm deps, but system ffmpeg needed as fallback
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

# Python deps
COPY requirements.txt .
RUN pip install -r requirements.txt

# Node deps
COPY package*.json .
RUN npm install

# Copy source
COPY . .

# Entry point is src/index.js per your package.json
CMD ["node", "src/index.js"]