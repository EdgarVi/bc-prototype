import axios from 'axios';

// Configuration
const API_URL = 'http://localhost:5050/api/ingest';
const SENSOR_ID = 'BEADED-PROTOTYPE-01';
const INTERVAL_MS = 5000; // 5 seconds

let tick = 0;

async function sendSensorData() {
  /**
   * Oscillating Temperature Logic (Sine Wave)
   * Offset: -15 (Average Arctic ground temp)
   * Amplitude: 5 (Varies between -20 and -10)
   * Frequency: 0.1 (Smooth transition)
   */
  const baseTemp = -15;
  const amplitude = 5;
  const frequency = 0.1;
  const currentTemp = baseTemp + (amplitude * Math.sin(tick * frequency));

  const payload = {
    sensorId: SENSOR_ID,
    temperature: parseFloat(currentTemp.toFixed(2)),
    battery: 92, // Highlighting "Digital Twin" metadata
    timestamp: new Date().toISOString(),
  };

  try {
    const response = await axios.post(API_URL, payload);
    console.log(`[${new Date().toLocaleTimeString()}] Telemetry Sent: ${payload.temperature}°C (Status: ${response.status})`);
    tick++;
  } catch (error: any) {
    console.error(`[${new Date().toLocaleTimeString()}] Connection Failed: Is the server running on port 5050?`);
  }
}

// Start the simulation
console.log(`Starting Sensor Simulation for ${SENSOR_ID}...`);
console.log(`Targeting Backend at: ${API_URL}`);

setInterval(sendSensorData, INTERVAL_MS);

// Run immediately on start
sendSensorData();