import React, { useState, useEffect } from 'react';
import { TrespassingAlert } from '../App';
import { 
  MapPin, 
  AlertTriangle, 
  Clock, 
  User, 
  Phone, 
  Navigation, 
  Shield, 
  Zap, 
  Users, 
  Timer, 
  CheckCircle, 
  Play, 
  Pause, 
  RotateCcw 
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';

// --- ORIGINAL TYPE DEFINITIONS ---
interface SosAlert {
  id: string;
  timestamp: Date;
  location: string;
  coordinates: { top: string; left: string; };
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'medical' | 'security' | 'natural' | 'accident' | 'theft';
  touristInfo: { name: string; nationality: string; groupSize: number; contact: string; };
  status: 'pending' | 'responding' | 'resolved';
  responseTime?: number;
  assignedTeam?: string;
  description: string;
}
interface MapStats {
  activeTourists: number;
  activeIncidents: number;
  responseTeams: number;
  avgResponseTime: string;
}

// --- ORIGINAL MOCK DATA ---
const ALERT_TEMPLATES = [
  { location: "Red Fort Area", coordinates: { top: "45%", left: "52%" }, type: "medical" as const, severity: "high" as const, touristInfo: { name: "Sarah Johnson", nationality: "USA", groupSize: 4, contact: "+1-555-0123" }, description: "Tourist collapsed near main entrance, breathing difficulties reported" },
  { location: "India Gate", coordinates: { top: "60%", left: "58%" }, type: "security" as const, severity: "medium" as const, touristInfo: { name: "Marco Silva", nationality: "Brazil", groupSize: 2, contact: "+55-11-98765-4321" }, description: "Security concern reported, suspicious activity near monument" },
  { location: "Connaught Place", coordinates: { top: "55%", left: "60%" }, type: "theft" as const, severity: "critical" as const, touristInfo: { name: "Chen Wei", nationality: "China", groupSize: 1, contact: "+86-138-0013-8000" }, description: "Wallet and phone stolen by pickpockets near Central Park" },
  { location: "Lotus Temple", coordinates: { top: "70%", left: "65%" }, type: "accident" as const, severity: "low" as const, touristInfo: { name: "Emma Thompson", nationality: "UK", groupSize: 3, contact: "+44-20-7946-0958" }, description: "Minor bicycle accident, tourist has scraped knee" },
  { location: "Qutub Minar", coordinates: { top: "75%", left: "48%" }, type: "natural" as const, severity: "medium" as const, touristInfo: { name: "Alex Mueller", nationality: "Germany", groupSize: 2, contact: "+49-30-12345678" }, description: "Tourist got lost due to heavy fog, needed directions" }
];

// --- ORIGINAL SUB-COMPONENTS ---
const LiveIncidentFeed: React.FC<{ alerts: SosAlert[]; onAlertClick: (alert: SosAlert) => void }> = ({ alerts, onAlertClick }) => {
  const recentAlerts = alerts.slice(-5).reverse();
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-slate-200 flex items-center"><Zap className="h-5 w-5 mr-2 text-yellow-400" />Live Incident Feed</h3>
      {recentAlerts.length === 0 ? (
        <div className="text-center py-8 text-slate-400"><Clock className="h-8 w-8 mx-auto mb-2 opacity-50" /><p>Awaiting new incidents...</p></div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {recentAlerts.map((alert) => (
            <Card key={alert.id} className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-all duration-200 cursor-pointer" onClick={() => onAlertClick(alert)}>
              <CardContent className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'} className="text-xs">{alert.type.toUpperCase()}</Badge>
                      <Badge variant="outline" className={`text-xs ${alert.severity === 'critical' ? 'border-red-500 text-red-400' : alert.severity === 'high' ? 'border-orange-500 text-orange-400' : alert.severity === 'medium' ? 'border-yellow-500 text-yellow-400' : 'border-green-500 text-green-400'}`}>{alert.severity}</Badge>
                    </div>
                    <p className="text-sm text-slate-300 font-medium">{alert.location}</p>
                    <p className="text-xs text-slate-400">{alert.timestamp.toLocaleTimeString()}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${alert.status === 'pending' ? 'bg-red-500 animate-pulse' : alert.status === 'responding' ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const IncidentDetailsPanel: React.FC<{ alert: SosAlert; onBack: () => void; onUpdateStatus: (id: string, status: SosAlert['status']) => void }> = ({ alert, onBack, onUpdateStatus }) => {
    // This is your full original component code for the details panel
    const getSeverityColor = (severity: string) => {
        switch (severity) {
          case 'critical': return 'text-red-400 border-red-500';
          case 'high': return 'text-orange-400 border-orange-500';
          case 'medium': return 'text-yellow-400 border-yellow-500';
          default: return 'text-green-400 border-green-500';
        }
    };
    const getTypeIcon = (type: string) => {
        switch (type) {
          case 'medical': return <Shield className="h-4 w-4" />;
          case 'security': return <AlertTriangle className="h-4 w-4" />;
          case 'accident': return <Zap className="h-4 w-4" />;
          case 'theft': return <User className="h-4 w-4" />;
          default: return <MapPin className="h-4 w-4" />;
        }
    };
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-200">Incident Details</h3>
                <Button variant="ghost" size="sm" onClick={onBack} className="text-slate-400 hover:text-white">← Back to Feed</Button>
            </div>
            <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3"><div className="flex items-center justify-between"><CardTitle className="text-white flex items-center space-x-2">{getTypeIcon(alert.type)}<span className="capitalize">{alert.type} Emergency</span></CardTitle><Badge variant="outline" className={`${getSeverityColor(alert.severity)} font-semibold`}>{alert.severity.toUpperCase()}</Badge></div></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-3"><div className="flex items-center space-x-2 text-slate-300"><MapPin className="h-4 w-4 text-blue-400" /><span className="font-medium">{alert.location}</span></div><div className="flex items-center space-x-2 text-slate-300"><Clock className="h-4 w-4 text-gray-400" /><span className="text-sm">{alert.timestamp.toLocaleString()}</span></div></div>
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700"><h4 className="text-sm font-semibold text-slate-200 mb-2 flex items-center"><User className="h-4 w-4 mr-2 text-cyan-400" />Tourist Information</h4><div className="space-y-1 text-sm text-slate-300"><p><span className="text-slate-400">Name:</span> {alert.touristInfo.name}</p><p><span className="text-slate-400">Nationality:</span> {alert.touristInfo.nationality}</p><p><span className="text-slate-400">Group Size:</span> {alert.touristInfo.groupSize} people</p><p><span className="text-slate-400">Contact:</span> {alert.touristInfo.contact}</p></div></div>
                    <div><h4 className="text-sm font-semibold text-slate-200 mb-2">Description</h4><p className="text-sm text-slate-300 bg-slate-900/50 p-3 rounded border border-slate-700">{alert.description}</p></div>
                    <div className="space-y-3"><div className="flex items-center justify-between"><span className="text-sm text-slate-400">Status:</span><Badge variant={alert.status === 'resolved' ? 'default' : 'secondary'} className={`${alert.status === 'pending' ? 'bg-red-600 hover:bg-red-700' : alert.status === 'responding' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}`}>{alert.status === 'pending' && <Timer className="h-3 w-3 mr-1" />}{alert.status === 'responding' && <Navigation className="h-3 w-3 mr-1" />}{alert.status === 'resolved' && <CheckCircle className="h-3 w-3 mr-1" />}{alert.status.toUpperCase()}</Badge></div>
                        <div className="grid grid-cols-2 gap-2">
                            {alert.status === 'pending' && (<Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => onUpdateStatus(alert.id, 'responding')}><Navigation className="h-4 w-4 mr-2" />Dispatch Team</Button>)}
                            {alert.status === 'responding' && (<Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => onUpdateStatus(alert.id, 'resolved')}><CheckCircle className="h-4 w-4 mr-2" />Mark Resolved</Button>)}
                            <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700"><Phone className="h-4 w-4 mr-2" />Contact Tourist</Button>
                        </div>
                    </div>
                    {alert.responseTime && (<div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3"><p className="text-sm text-green-400"><CheckCircle className="h-4 w-4 inline mr-2" />Resolved in {alert.responseTime} minutes</p></div>)}
                </CardContent>
            </Card>
        </div>
    );
};

const MapStatsComponent: React.FC<{ stats: MapStats }> = ({ stats }) => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Card className="bg-slate-800 border-slate-700"><CardContent className="p-3"><div className="flex items-center space-x-2"><Users className="h-4 w-4 text-blue-400" /><div><p className="text-xs text-slate-400">Active Tourists</p><p className="text-lg font-bold text-white">{stats.activeTourists}</p></div></div></CardContent></Card>
        <Card className="bg-slate-800 border-slate-700"><CardContent className="p-3"><div className="flex items-center space-x-2"><AlertTriangle className="h-4 w-4 text-orange-400" /><div><p className="text-xs text-slate-400">Active Incidents</p><p className="text-lg font-bold text-white">{stats.activeIncidents}</p></div></div></CardContent></Card>
        <Card className="bg-slate-800 border-slate-700"><CardContent className="p-3"><div className="flex items-center space-x-2"><Shield className="h-4 w-4 text-green-400" /><div><p className="text-xs text-slate-400">Response Teams</p><p className="text-lg font-bold text-white">{stats.responseTeams}</p></div></div></CardContent></Card>
        <Card className="bg-slate-800 border-slate-700"><CardContent className="p-3"><div className="flex items-center space-x-2"><Timer className="h-4 w-4 text-purple-400" /><div><p className="text-xs text-slate-400">Avg Response</p><p className="text-lg font-bold text-white">{stats.avgResponseTime}</p></div></div></CardContent></Card>
    </div>
);

// This component was renamed from MainComponent to MapSystem in your original code
interface MapSystemProps {
  trespassingAlerts: TrespassingAlert[];
}
const MapSystem: React.FC<MapSystemProps> = ({ trespassingAlerts }) => {
  const [sosAlerts, setSosAlerts] = useState<SosAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<SosAlert | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [mapStats, setMapStats] = useState<MapStats>({ activeTourists: 1247, activeIncidents: 0, responseTeams: 12, avgResponseTime: "4.2m" });

  useEffect(() => {
    setMapStats(prev => ({ ...prev, activeIncidents: sosAlerts.length + trespassingAlerts.length }));
  }, [sosAlerts, trespassingAlerts]);

  useEffect(() => { if (isSimulating) { const interval = setInterval(() => { handleSimulateSos(); }, 8000); return () => clearInterval(interval); } }, [isSimulating]);

  const generateRandomAlert = (): SosAlert => { const template = ALERT_TEMPLATES[Math.floor(Math.random() * ALERT_TEMPLATES.length)]; const id = `T-${Date.now().toString().slice(-3)}`; return { id, timestamp: new Date(), location: template.location, coordinates: template.coordinates, severity: template.severity, type: template.type, touristInfo: template.touristInfo, status: 'pending', description: template.description }; };
  const handleSimulateSos = (): void => { const newAlert = generateRandomAlert(); setSosAlerts(prev => [...prev, newAlert]); };
  const handleUpdateAlertStatus = (alertId: string, newStatus: SosAlert['status']): void => { setSosAlerts(prev => prev.map(alert => { if (alert.id === alertId) { const updatedAlert = { ...alert, status: newStatus }; if (newStatus === 'resolved') { updatedAlert.responseTime = Math.floor(Math.random() * 10) + 2; } if (newStatus === 'responding' && !alert.assignedTeam) { const teams = ['Team Alpha', 'Team Bravo', 'Team Charlie', 'Team Delta']; updatedAlert.assignedTeam = teams[Math.floor(Math.random() * teams.length)]; } return updatedAlert; } return alert; })); if (newStatus === 'resolved') { setMapStats(prev => ({ ...prev, activeIncidents: Math.max(0, prev.activeIncidents - 1) })); } };
  const clearAllAlerts = (): void => { setSosAlerts([]); setSelectedAlert(null); };
  const getSeverityStyle = (severity: string): string => { switch (severity) { case 'critical': return 'bg-red-500 shadow-red-500/50 animate-pulse'; case 'high': return 'bg-orange-500 shadow-orange-500/50'; case 'medium': return 'bg-yellow-500 shadow-yellow-500/50'; default: return 'bg-green-500 shadow-green-500/50'; } };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
          <div><h1 className="text-3xl font-bold text-white mb-2">Live Safety Map</h1><p className="text-slate-400">Real-time monitoring of tourist safety incidents</p></div>
          <div className="flex items-center space-x-3">
            <Button onClick={handleSimulateSos} className="bg-red-600 hover:bg-red-700 text-white"><AlertTriangle className="h-4 w-4 mr-2" />Simulate New SOS Alert</Button>
            <Button onClick={() => setIsSimulating(!isSimulating)} variant={isSimulating ? "destructive" : "outline"} className="border-slate-600">{isSimulating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}{isSimulating ? 'Stop Auto-Sim' : 'Auto Simulate'}</Button>
            <Button onClick={clearAllAlerts} variant="outline" className="border-slate-600 text-slate-300"><RotateCcw className="h-4 w-4 mr-2" />Clear All</Button>
          </div>
        </div>
        <MapStatsComponent stats={mapStats} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700 overflow-hidden">
              <CardHeader className="pb-3"><CardTitle className="text-white flex items-center"><MapPin className="h-5 w-5 mr-2 text-blue-400" />Delhi Tourism Safety Map</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="relative h-96 lg:h-[600px]">
                  <iframe src="https://www.openstreetmap.org/export/embed.html?bbox=77.1025%2C28.5355%2C77.3464%2C28.7041&amp;layer=mapnik&amp;marker=28.6139%2C77.2090" className="w-full h-full border-0 rounded-lg" title="Delhi Tourism Safety Map" />
                  {sosAlerts.map((alert) => (
                    <div key={alert.id} className={`absolute w-6 h-6 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-10 ${getSeverityStyle(alert.severity)} hover:scale-125 transition-all duration-300 shadow-lg ${alert.status === 'pending' ? 'animate-pulse' : ''}`} style={{ top: alert.coordinates.top, left: alert.coordinates.left }} onClick={() => setSelectedAlert(alert)} title={`${alert.type} incident at ${alert.location}`}>
                      <div className="w-full h-full rounded-full bg-white bg-opacity-90 flex items-center justify-center">
                        {alert.status === 'pending' && <AlertTriangle className="h-3 w-3 text-red-700" />}
                        {alert.status === 'responding' && <Navigation className="h-3 w-3 text-yellow-700" />}
                        {alert.status === 'resolved' && <CheckCircle className="h-3 w-3 text-green-700" />}
                      </div>
                      {alert.status === 'pending' && (<><div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20"></div><div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-10 animation-delay-1000"></div></>)}
                    </div>
                  ))}
                  {trespassingAlerts.map((alert, index) => (
                    <div
                      key={`trespass-${index}`}
                      className="absolute w-4 h-4 rounded-full bg-red-500 border-2 border-white animate-pulse transform -translate-x-1/2 -translate-y-1/2 z-20"
                      style={{
                        top: `${90 - ((alert.location.coordinates[1] - 28.5355) / (28.7041 - 28.5355)) * 100}%`,
                        left: `${((alert.location.coordinates[0] - 77.1025) / (77.3464 - 77.1025)) * 100}%`,
                      }}
                      title={`Trespassing Alert for ${alert.tourist_id} in ${alert.area_name}`}
                    ></div>
                  ))}
                  <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border border-slate-700">
                    <h4 className="text-xs font-semibold text-slate-200 mb-2">Alert Types</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div><span className="text-slate-300">Critical/Pending</span></div>
                      <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-yellow-500 rounded-full"></div><span className="text-slate-300">Responding</span></div>
                      <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div><span className="text-slate-300">Resolved</span></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700 h-fit">
              <CardContent className="p-4">
                {selectedAlert ? (
                  <IncidentDetailsPanel alert={selectedAlert} onBack={() => setSelectedAlert(null)} onUpdateStatus={handleUpdateAlertStatus}/>
                ) : (
                  <LiveIncidentFeed alerts={sosAlerts} onAlertClick={setSelectedAlert} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        {isSimulating && (<Alert className="mt-4 border-blue-500 bg-blue-950/50 text-blue-200"><Zap className="h-4 w-4 animate-pulse" /><AlertDescription className="font-medium">Auto-simulation active - New incidents will appear every 8 seconds</AlertDescription></Alert>)}
      </div>
    </div>
  );
};
export default MapSystem;