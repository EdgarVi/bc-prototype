import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors()); // Crucial for the React frontend to talk to this API
app.use(express.json());

const PORT = 5050;

// 1. Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/bc-prototype')
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// 2. Data Schema (The "Source of Truth")
const ReadingSchema = new mongoose.Schema({
  sensorId: { type: String, required: true },
  temperature: { type: Number, required: true },
  battery: Number,
  timestamp: { type: Date, default: Date.now, index: true } // Indexing for fast graphing
});

const Reading = mongoose.model('Reading', ReadingSchema);

// 3. Ingestion Endpoint (POST)
app.post('/api/ingest', async (req, res) => {
  try {
    const newReading = await Reading.create(req.body);
    console.log(`[${new Date().toLocaleTimeString()}] Data Ingested: ${newReading.temperature}°C`);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: "Data Ingestion Failed" });
  }
});

// 4. Data Retrieval Endpoint (GET)
// This is what your Dashboard will call to draw the graph
app.get('/api/history', async (req, res) => {
  try {
    const history = await Reading.find()
      .sort({ timestamp: -1 }) // Get newest first
      .limit(50); // Only grab the last 50 for the real-time graph
    
    res.json(history.reverse()); // Return in chronological order
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

app.listen(PORT, () => {
  console.log(`BeadedCloud Server running on http://localhost:${PORT}`);
});