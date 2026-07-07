import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, MapPin, User, AlertTriangle, RefreshCw } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

// Interface for the SOS Incident data
interface SosIncident {
  id: string;
  timestamp: string;
  location: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  type: 'Medical' | 'Security' | 'Natural' | 'Accident' | 'Theft';
  touristInfo: {
    name: string;
    nationality: string;
    contact: string;
  };
  status: 'NEW' | 'RESPONDING' | 'RESOLVED';
}

const IncidentsDashboard: React.FC = () => {
  const [incidents, setIncidents] = useState<SosIncident[]>([]);

  const fetchIncidents = async () => {
    try {
      const response = await axios.get('http://localhost:8000/incidents');
      setIncidents(response.data);
    } catch (error) {
      console.error("Failed to fetch incidents:", error);
    }
  };

  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    if (severity === 'CRITICAL') return 'bg-red-600 text-white';
    if (severity === 'HIGH') return 'bg-orange-500 text-white';
    if (severity === 'MEDIUM') return 'bg-yellow-500 text-black';
    return 'bg-blue-500 text-white';
  };
  
  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Live Incidents</h1>
          <Button onClick={fetchIncidents} variant="outline" className="border-slate-600 text-slate-300">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="space-y-4">
          {incidents.length > 0 ? (
            incidents.map(incident => (
              <div key={incident.id} className="bg-slate-800 border border-slate-700 rounded-lg p-4 grid grid-cols-6 gap-4 items-center">
                <div className="font-mono text-slate-400">{incident.id}</div>
                <div>
                  <Badge className={getSeverityColor(incident.severity)}>{incident.severity}</Badge>
                  <Badge variant="secondary" className="ml-2 bg-blue-900 text-blue-300">{incident.status}</Badge>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <AlertTriangle size={16} />
                  <span>{incident.type}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <MapPin size={16} />
                  <span>{incident.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <User size={16} />
                  <span>{incident.touristInfo.name} ({incident.touristInfo.nationality})</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Clock size={16} />
                    <span>{new Date(incident.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <Button variant="ghost" className="text-blue-400 hover:bg-slate-700">View Details</Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 text-slate-500">
              <p>No active incidents.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentsDashboard;