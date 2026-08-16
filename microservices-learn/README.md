# 🎓 Laboratorium Belajar: Docker, Kubernetes & RabbitMQ

Folder ini adalah **proyek mandiri (*standalone microservice*)** yang dibuat khusus untuk membantu Anda memahami 3 teknologi paling dicari di dunia kerja:
1. 🐳 **Docker (Containerization)**
2. ☸️ **Kubernetes / K8s (Container Orchestration)**
3. 🐇 **RabbitMQ (Event-Driven Message Broker)**

---

## 🏗️ Alur Kerja Microservice Ini

```
[1. Anda / Postman] 
       │ 
       ▼ (POST /publish)
[2. Producer API (Express)] 
       │ 
       ▼ (Kirim Event "OrderCreated" ke Antrean)
[3. RabbitMQ Message Broker] (Port: 5672)
       │ 
       ▼ (Distribusi Pesan)
[4. Consumer Worker (Notification Service)]
       │
       ▼
[5. Cetak Log: Kirim WhatsApp & Email ke Pembeli]
```

---

## 🚀 3 Cara Menjalankan Proyek Ini

### 🟡 CARA 1: Menjalankan Langsung Tanpa Docker (Mode Belajar Cepat)
Jika Anda belum install Docker di komputer, Anda tetap bisa menjalankannya langsung dengan Node.js:

```bash
# 1. Pindah ke folder ini
cd microservices-learn

# 2. Install dependensi
npm install

# 3. Jalankan server
npm start
```
Buka browser di **http://localhost:4000** ➔ Server akan otomatis berjalan dalam mode simulasi interaktif!

---

### 🔵 CARA 2: Menjalankan dengan Docker & Docker Compose *(Rekomendasi)*
Jika Anda memiliki **Docker Desktop** yang terinstal di komputer:

```bash
# Jalankan RabbitMQ + Backend Worker sekaligus dengan 1 perintah:
docker compose up --build
```

Setelah berjalan:
* **API Backend:** `http://localhost:4000`
* **Dashboard Visual RabbitMQ:** `http://localhost:15672` *(Username: `guest`, Password: `guest`)*

Untuk mematikannya:
```bash
docker compose down
```

---

### 🟣 CARA 3: Menjalankan di Kubernetes (K8s)
Jika Anda belajar Kubernetes (menggunakan Minikube, Docker Desktop K8s, atau K3s):

```bash
# 1. Build Docker image lokal
docker build -t notification-backend:latest .

# 2. Terapkan manifes RabbitMQ ke Kubernetes
kubectl apply -f k8s/rabbitmq.yaml

# 3. Terapkan manifes Backend Worker (otomatis jalan 2 pod/server)
kubectl apply -f k8s/backend.yaml

# 4. Cek status pod yang berjalan
kubectl get pods
```

---

## 🧪 Cara Menguji Pengiriman Pesan (Test Endpoint)

Buka terminal baru atau gunakan aplikasi seperti **Postman / Thunder Client / cURL**:

### Kirim Event Pesanan Baru (Simulasi Checkout):
```bash
curl -X POST http://localhost:4000/publish \
  -H "Content-Type: application/json" \
  -d '{
    "event": "OrderCreated",
    "orderId": "ORD-9999",
    "recipient": "Budi Santoso",
    "phone": "081234567890",
    "email": "budi@example.com",
    "totalAmount": 1500000
  }'
```

**Hasil:**
Lihat terminal backend Anda! Worker akan seketika mencetak log:
```
📥 [WORKER MENERIMA EVENT]: OrderCreated untuk Budi Santoso
📨 [SIMULASI]: Mengirim notifikasi WhatsApp ke 081234567890 & Email ke budi@example.com...
✅ [SELESAI]: Notifikasi berhasil terkirim!
```

---

## 📚 Kamus Istilah untuk Interview Kerja:

1. **Producer:** Pengirim pesan (pihak yang memicu event, misal: saat checkout selesai).
2. **Message Broker (RabbitMQ):** Kantor pos digital yang menampung antrean pesan agar server tidak crash saat traffic tinggi.
3. **Consumer / Worker:** Penerima pesan yang memproses tugas berat di latar belakang (*background job*).
4. **Pod (Kubernetes):** Unit terkecil di K8s yang membungkus kontainer aplikasi Anda.
5. **Replicas (Kubernetes):** Jumlah server pod yang diduplikasi untuk membagi beban (*load balancing*).
