import { useEffect, useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface Reading {
  _id: string;
  temperature: number;
  battery: number;
  timestamp: string;
}

function App() {
  const [data, setData] = useState<Reading[]>([]);
  const latest = data[data.length - 1];

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://localhost:5050/api/history');
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        
        {/* Header Section */}
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>beadedcloud</h1>
            <p style={styles.subtitle}>Arctic Monitoring Platform // Station BEADED-01</p>
          </div>
          <div style={styles.statusBadge}>
            <div style={styles.liveDot} />
            <span style={styles.statusText}>SYSTEM LIVE</span>
          </div>
        </header>

        {/* Top Row: Status Cards */}
        <div style={styles.cardGrid}>
          <div style={styles.card}>
            <span style={styles.label}>INTERNAL TEMPERATURE</span>
            <div style={styles.value}>
              {latest ? `${latest.temperature.toFixed(2)}°C` : '--'}
            </div>
          </div>
          
          <div style={styles.card}>
            <span style={styles.label}>REMOTE BATTERY</span>
            <div style={{ 
              ...styles.value, 
              color: (latest?.battery ?? 0) < 20 ? '#ef4444' : '#10b981' 
            }}>
              {latest ? `${latest.battery}%` : '--'}
            </div>
          </div>
        </div>

        {/* Main Section: Full-Width Chart */}
        <div style={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(str) => new Date(str).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} 
                fontSize={12} 
                tickMargin={15}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                domain={[-25, -5]} 
                unit="°C" 
                fontSize={12} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={styles.tooltip} />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#2563eb" 
                strokeWidth={4} 
                dot={false} 
                isAnimationActive={false} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    width: '100vw',
    height: '100vh',
    backgroundColor: '#f8fafc',
    boxSizing: 'border-box' as const,
    overflow: 'hidden', // Prevents unnecessary scrollbars
  },
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '2vh 2vw', // Responsive padding based on viewport
    boxSizing: 'border-box' as const,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2vh',
    flexShrink: 0,
  },
  title: {
    margin: 0,
    fontSize: '2.5rem',
    fontWeight: 800,
    color: '#0f172a',
    letterSpacing: '-0.025em',
  },
  subtitle: {
    margin: 0,
    color: '#64748b',
    fontSize: '1.1rem',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#fff',
    padding: '10px 20px',
    borderRadius: '99px',
    border: '1px solid #e2e8f0',
  },
  liveDot: {
    width: '12px',
    height: '12px',
    backgroundColor: '#22c55e',
    borderRadius: '50%',
    boxShadow: '0 0 12px #22c55e',
  },
  statusText: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#475569',
    letterSpacing: '0.1em',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2vw',
    marginBottom: '2vh',
    flexShrink: 0,
  },
  card: {
    background: '#ffffff',
    padding: '2.5vh 2vw',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  },
  label: {
    color: '#94a3b8',
    fontWeight: 700,
    fontSize: '0.85rem',
    letterSpacing: '0.1em',
  },
  value: {
    fontSize: '3.5rem',
    fontWeight: 800,
    marginTop: '8px',
    color: '#1e293b',
  },
  chartContainer: {
    background: '#ffffff',
    padding: '20px',
    borderRadius: '24px',
    border: '1px solid #e2e8f0',
    flexGrow: 1, // This makes the chart take up all remaining vertical space
    minHeight: 0, // Critical for flexbox children to shrink properly
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
  },
  tooltip: {
    borderRadius: '12px',
    border: 'none',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  }
};

export default App;