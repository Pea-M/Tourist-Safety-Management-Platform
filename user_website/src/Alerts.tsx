import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, MapPin, Bell, UserX, Radio } from 'lucide-react';

interface Alert {
  type: 'BROADCAST' | 'TRESPASSING' | 'DEVIATION';
  title: string;
  body: string;
  priority: string;
  timestamp: string;
  area_name?: string;
}

const getAlertTypeStyle = (type: Alert['type']) => {
  switch (type) {
    case 'BROADCAST':
      return { icon: <Radio className="h-5 w-5 text-blue-500" />, label: "Authority Broadcast" };
    case 'TRESPASSING':
      return { icon: <UserX className="h-5 w-5 text-red-500" />, label: "Trespassing Alert" };
    case 'DEVIATION':
      return { icon: <MapPin className="h-5 w-5 text-orange-500" />, label: "Route Deviation Alert" };
    default:
      return { icon: <Bell className="h-5 w-5 text-gray-500" />, label: "General Alert" };
  }
};

const AlertCard: React.FC<{ alert: Alert }> = ({ alert }) => {
  const { icon, label } = getAlertTypeStyle(alert.type);
  
  return (
    <div className="bg-white rounded-lg border-l-4 border-gray-300 shadow-sm p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            {icon}
            <span className="text-sm font-semibold text-gray-600">{label}</span>
          </div>
          <h3 className="font-semibold text-gray-900">{alert.title || alert.area_name}</h3>
          <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
            <Clock className="w-3 h-3" />
            <span>{new Date(alert.timestamp).toLocaleString()}</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">{alert.body || `You entered the restricted area: ${alert.area_name}`}</p>
    </div>
  );
};

const AlertsScreen: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const touristId = "tourist-123"; // Using a hardcoded ID for the prototype

  const fetchAlerts = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/user-alerts/${touristId}`);
      setAlerts(response.data);
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 15000); // Check for new alerts every 15 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="max-w-md mx-auto p-4 space-y-4 pb-24">
        <div className="text-center py-4">
          <h1 className="text-2xl font-bold text-gray-900">All Alerts</h1>
          <p className="text-gray-600 text-sm">Broadcasts and personal safety notifications</p>
        </div>
        
        <div className="space-y-3">
          {alerts.length > 0 ? (
            alerts.map((alert, index) => (
              <AlertCard key={index} alert={alert} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No alerts at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return <AlertsScreen />;
};

export default App;