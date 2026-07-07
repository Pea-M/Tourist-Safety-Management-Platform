import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header/Header';
import CenterMap from './CenterMap/CenterMap';
import IncidentsDashboard from './Incidents/Incidents';
import AnalyticsDashboard from './Analytics/Analytics';
import BroadcastDashboard from './Broadcast/Broadcast';
import TrespassingLog from './TrespassingLog/TrespassingLog';

// Define the shape of a trespassing alert
export interface TrespassingAlert {
  tourist_id: string;
  area_name: string;
  location: {
    coordinates: [number, number]; // [lon, lat]
  };
  timestamp: string;
}

// Define the allowed names for our tabs
export type TabName = 'Live Map' | 'Incidents' | 'Analytics' | 'Broadcast' | 'Trespassing Alerts';

function App() {
  const [activeTab, setActiveTab] = useState<TabName>('Live Map');
  const [trespassingAlerts, setTrespassingAlerts] = useState<TrespassingAlert[]>([]);

  // Function to fetch trespassing alerts from the backend
  const fetchTrespassingAlerts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/trespassing-alerts');
      setTrespassingAlerts(response.data);
    } catch (error) {
      console.error("Failed to fetch trespassing alerts:", error);
    }
  };

  // Fetch alerts when the app loads and then every 10 seconds
  useEffect(() => {
    fetchTrespassingAlerts();
    const interval = setInterval(fetchTrespassingAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  // This function returns the correct page component based on the active tab
  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'Live Map':
        return <CenterMap trespassingAlerts={trespassingAlerts} />;
      case 'Incidents':
        return <IncidentsDashboard />;
      case 'Analytics':
        return <AnalyticsDashboard />;
      case 'Broadcast':
        return <BroadcastDashboard />;
      case 'Trespassing Alerts':
        return <TrespassingLog alerts={trespassingAlerts} />;
      default:
        return <CenterMap trespassingAlerts={trespassingAlerts} />;
    }
  };

  return (
    <div>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main>
        {renderActiveComponent()}
      </main>
    </div>
  );
}

export default App;