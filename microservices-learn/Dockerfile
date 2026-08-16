# 1. Base image Node.js yang ringan (Alpine Linux)
FROM node:20-alpine

# 2. Tentukan direktori kerja di dalam kontainer
WORKDIR /app

# 3. Salin file package.json terlebih dahulu untuk caching dependensi
COPY package*.json ./

# 4. Install dependensi
RUN npm install --production

# 5. Salin seluruh kode aplikasi ke dalam kontainer
COPY src/ ./src/

# 6. Buka port 4000
EXPOSE 4000

# 7. Perintah menjalankan aplikasi saat kontainer dinyalakan
CMD ["node", "src/index.js"]
