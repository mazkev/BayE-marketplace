const express = require("express");
const amqp = require("amqplib");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";
const QUEUE_NAME = "notification_queue";

app.use(cors());
app.use(express.json());

let channel = null;
let connection = null;
let logs = [];

function addLog(msg) {
  const logItem = `[${new Date().toLocaleTimeString()}] ${msg}`;
  console.log(logItem);
  logs.unshift(logItem);
  if (logs.length > 50) logs.pop();
}

// 1. KONEKSI KE RABBITMQ & SETUP CONSUMER (WORKER)
async function connectRabbitMQ() {
  try {
    addLog(`🔌 Menghubungkan ke RabbitMQ di: ${RABBITMQ_URL}...`);
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    addLog(`✅ Terhubung ke RabbitMQ! Mendengarkan antrean: "${QUEUE_NAME}"`);

    // CONSUMER: Mendengarkan pesan yang masuk ke antrean
    channel.consume(QUEUE_NAME, (msg) => {
      if (msg !== null) {
        const content = msg.content.toString();
        try {
          const data = JSON.parse(content);
          addLog(`📥 [WORKER MENERIMA EVENT]: ${data.event} untuk ${data.recipient || "User"}`);
          addLog(`📨 [SIMULASI]: Mengirim notifikasi WhatsApp ke ${data.phone || "0812xxxx"} & Email ke ${data.email || "user@mail.com"}...`);
          addLog(`✅ [SELESAI]: Notifikasi berhasil terkirim!`);
        } catch {
          addLog(`📥 [PESAN TEXT]: ${content}`);
        }
        channel.ack(msg); // Konfirmasi ke RabbitMQ bahwa pesan sudah selesai diproses
      }
    });

    connection.on("error", (err) => {
      addLog(`⚠️ Koneksi RabbitMQ error: ${err.message}`);
    });

    connection.on("close", () => {
      addLog("⚠️ Koneksi RabbitMQ terputus. Mencoba reconnect dalam 5 detik...");
      setTimeout(connectRabbitMQ, 5000);
    });
  } catch (error) {
    addLog(`❌ Gagal terhubung ke RabbitMQ: ${error.message}`);
    addLog("💡 (Tips: Jalankan 'docker compose up' untuk menyalakan RabbitMQ di Docker)");
    setTimeout(connectRabbitMQ, 5000);
  }
}

// 2. ENDPOINT API UNTUK MEMERIKSA STATUS SERVER
app.get("/", (req, res) => {
  res.json({
    status: "Online",
    service: "Microservices Learning Backend",
    rabbitMqConnected: channel !== null,
    rabbitMqUrl: RABBITMQ_URL,
    queueName: QUEUE_NAME,
    recentLogs: logs.slice(0, 10),
    endpoints: {
      health: "GET /",
      publishMessage: "POST /publish",
    },
  });
});

// 3. ENDPOINT PRODUCER: MENGIRIM PESAN KE ANTREAN RABBITMQ
app.post("/publish", async (req, res) => {
  const messageData = req.body || {
    event: "OrderCreated",
    orderId: "ORD-" + Math.floor(1000 + Math.random() * 9000),
    recipient: "Budi Santoso",
    phone: "081234567890",
    email: "budi@example.com",
    totalAmount: 1250000,
    timestamp: new Date().toISOString(),
  };

  if (!channel) {
    // Mode Simulasi jika RabbitMQ belum dinyalakan di Docker
    addLog(`⚠️ [SIMULASI LOKAL - RabbitMQ Offline]: Menerima pesan ${JSON.stringify(messageData)}`);
    addLog(`📨 [SIMULASI]: Mengirim notifikasi WhatsApp ke ${messageData.phone || "0812xxxx"}`);
    return res.json({
      success: true,
      mode: "SIMULATION (RabbitMQ belum aktif)",
      message: "Pesan diproses via simulator lokal. Jalankan 'docker compose up' untuk menghubungkan RabbitMQ asli!",
      data: messageData,
    });
  }

  try {
    const payload = Buffer.from(JSON.stringify(messageData));
    channel.sendToQueue(QUEUE_NAME, payload, { persistent: true });
    addLog(`📤 [PRODUCER MENGIRIM PESAN KE RABBITMQ]: Event "${messageData.event || "CustomEvent"}"`);

    res.json({
      success: true,
      message: `Pesan berhasil dikirim ke antrean RabbitMQ [${QUEUE_NAME}]!`,
      data: messageData,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  addLog(`🚀 Server Microservice Backend berjalan di http://localhost:${PORT}`);
  connectRabbitMQ();
});
