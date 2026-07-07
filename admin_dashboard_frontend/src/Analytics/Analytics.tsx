import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import {
  MapPin,
  AlertTriangle,
  Clock,
  Shield,
  TrendingUp,
  Users,
  Activity,
  Timer,
  Target,
  Calendar,
  Download,
  RefreshCw,
  Layers,
  Award,
  Map,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

// --- (Mock data remains the same as the previous version) ---
const MOCK_KPI_DATA = {
  avgResponseTime: 4.2,
  incidentResolutionRate: 94.5,
  totalIncidentsToday: 23,
  activeResponseTeams: 12,
  touristsAssisted: 156,
  operatorEfficiency: 87.3,
};

const INCIDENT_TRENDS_DATA = [
  { date: 'Jan 1', medical: 8, theft: 12, security: 5, accident: 3, total: 28 },
  { date: 'Jan 2', medical: 12, theft: 8, security: 7, accident: 5, total: 32 },
  { date: 'Jan 3', medical: 6, theft: 15, security: 3, accident: 2, total: 26 },
  { date: 'Jan 4', medical: 10, theft: 18, security: 8, accident: 6, total: 42 },
  { date: 'Jan 5', medical: 9, theft: 14, security: 4, accident: 4, total: 31 },
  { date: 'Jan 6', medical: 15, theft: 20, security: 9, accident: 7, total: 51 },
  { date: 'Jan 7', medical: 7, theft: 11, security: 6, accident: 3, total: 27 },
];

const INCIDENT_BY_TYPE_DATA = [
  { name: 'Theft', value: 35, color: '#ef4444' },
  { name: 'Medical', value: 28, color: '#f59e0b' },
  { name: 'Security', value: 22, color: '#8b5cf6' },
  { name: 'Accident', value: 15, color: '#06b6d4' },
];

const PEAK_HOURS_DATA = [
  { hour: '6AM', incidents: 2 },
  { hour: '8AM', incidents: 8 },
  { hour: '10AM', incidents: 15 },
  { hour: '12PM', incidents: 23 },
  { hour: '2PM', incidents: 28 },
  { hour: '4PM', incidents: 32 },
  { hour: '6PM', incidents: 25 },
  { hour: '8PM', incidents: 18 },
  { hour: '10PM', incidents: 12 },
  { hour: '12AM', incidents: 5 },
];

const LOCATION_COMPARISON_DATA = [
  { location: 'Red Fort', incidents: 45, avgResponse: 3.2 },
  { location: 'India Gate', incidents: 38, avgResponse: 4.1 },
  { location: 'Connaught Place', incidents: 52, avgResponse: 2.8 },
  { location: 'Qutub Minar', incidents: 29, avgResponse: 5.5 },
  { location: 'Lotus Temple', incidents: 22, avgResponse: 4.7 },
  { location: 'Chandni Chowk', incidents: 41, avgResponse: 3.6 },
];

const TEAM_PERFORMANCE_DATA = [
  {
    team: 'Team Alpha',
    acknowledgeTime: 1.2,
    travelTime: 4.5,
    resolutionTime: 12.3,
    totalIncidents: 47,
    efficiency: 94,
  },
  {
    team: 'Team Bravo',
    acknowledgeTime: 1.8,
    travelTime: 3.9,
    resolutionTime: 15.1,
    totalIncidents: 52,
    efficiency: 89,
  },
  {
    team: 'Team Charlie',
    acknowledgeTime: 0.9,
    travelTime: 5.2,
    resolutionTime: 11.8,
    totalIncidents: 39,
    efficiency: 96,
  },
  {
    team: 'Team Delta',
    acknowledgeTime: 2.1,
    travelTime: 4.1,
    resolutionTime: 14.5,
    totalIncidents: 41,
    efficiency: 87,
  },
];

const INCIDENT_HOTSPOTS_DATA = [
  { name: 'Red Fort', lat: 28.6562, lng: 77.241, intensity: 0.8 },
  { name: 'Connaught Place', lat: 28.6315, lng: 77.2167, intensity: 0.9 },
  { name: 'India Gate', lat: 28.6129, lng: 77.2295, intensity: 0.6 },
  { name: 'Chandni Chowk', lat: 28.6506, lng: 77.2334, intensity: 0.7 },
  { name: 'Qutub Minar', lat: 28.5244, lng: 77.1855, intensity: 0.4 },
  { name: 'Lotus Temple', lat: 28.5535, lng: 77.2588, intensity: 0.3 },
];

const TOURIST_DENSITY_DATA = [
  { name: 'India Gate', lat: 28.6129, lng: 77.2295, intensity: 0.9 },
  { name: 'Hauz Khas Village', lat: 28.5529, lng: 77.1949, intensity: 0.7 },
  { name: 'Khan Market', lat: 28.5997, lng: 77.2269, intensity: 0.8 },
  { name: 'Dilli Haat', lat: 28.5727, lng: 77.2069, intensity: 0.6 },
  { name: 'Cyber Hub (Gurugram)', lat: 28.4965, lng: 77.0885, intensity: 0.8 },
];

const SAFE_ZONES_DATA = [
  { name: 'Diplomatic Enclave', lat: 28.5925, lng: 77.1925, intensity: 0.2 },
  { name: 'Aerocity Hotels', lat: 28.552, lng: 77.1215, intensity: 0.1 },
  { name: "Lutyens' Delhi", lat: 28.6142, lng: 77.2122, intensity: 0.3 },
  { name: 'Sunder Nursery', lat: 28.5924, lng: 77.2452, intensity: 0.2 },
];


const AnalyticsDashboard: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('7days');
  const [selectedHeatmapLayer, setSelectedHeatmapLayer] =
    useState<string>('incidents');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [kpiData, setKpiData] = useState(MOCK_KPI_DATA);

  // ... (handleRefresh and KPICard component remain the same)
  const handleRefresh = async (): Promise<void> => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setKpiData((prev) => ({
      ...prev,
      avgResponseTime: Number(
        (prev.avgResponseTime + (Math.random() - 0.5) * 0.5).toFixed(1)
      ),
      incidentResolutionRate: Number(
        (prev.incidentResolutionRate + (Math.random() - 0.5) * 2).toFixed(1)
      ),
      totalIncidentsToday: prev.totalIncidentsToday + Math.floor(Math.random() * 3),
      operatorEfficiency: Number(
        (prev.operatorEfficiency + (Math.random() - 0.5) * 3).toFixed(1)
      ),
    }));
    setIsRefreshing(false);
  };
  
  const KPICard: React.FC<{
    title: string;
    value: string | number;
    change?: string;
    icon: React.ReactNode;
    trend?: 'up' | 'down' | 'stable';
  }> = ({ title, value, change, icon, trend }) => (
    <Card className="bg-slate-800 border-slate-700 hover:bg-slate-700/50 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 mb-1">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {change && (
              <p
                className={`text-sm flex items-center mt-1 ${
                  trend === 'up'
                    ? 'text-green-400'
                    : trend === 'down'
                    ? 'text-red-400'
                    : 'text-slate-400'
                }`}
              >
                {trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                {change}
              </p>
            )}
          </div>
          <div className="text-blue-400 opacity-80">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );

  // --- UPDATED: Darker colors and increased initial opacity ---
  // New function to generate heatmap point styles
  const getHeatmapStyle = (
    layerType: string,
    intensity: number
  ): React.CSSProperties => {
    let colorRgb = '255, 255, 255'; // Default for safety
    if (layerType === 'incidents') colorRgb = '220, 38, 38'; // Darker Red (approx red-700)
    if (layerType === 'tourists') colorRgb = '37, 99, 235'; // Darker Blue (approx blue-700)
    if (layerType === 'safe') colorRgb = '21, 128, 61';   // Darker Green (approx green-700)

    // Increase initial opacity (e.g., from 0.6 to 0.7 or 0.8) for better visibility
    const initialOpacity = 0.7; 

    return {
      background: `radial-gradient(circle, rgba(${colorRgb}, ${initialOpacity}) 0%, rgba(${colorRgb}, 0) 60%)`,
      filter: `blur(8px)`, // Keep blur for heatmap effect
      width: '80px',
      height: '80px',
      transform: `scale(${0.5 + intensity * 1.5})`, // Vary size with intensity
      pointerEvents: 'none', // Ensure these points don't block map interaction if map was interactive
    };
  };

  // Logic to select the correct data array based on the active tab
  let currentHeatmapData = INCIDENT_HOTSPOTS_DATA;
  if (selectedHeatmapLayer === 'tourists') {
    currentHeatmapData = TOURIST_DENSITY_DATA;
  } else if (selectedHeatmapLayer === 'safe') {
    currentHeatmapData = SAFE_ZONES_DATA;
  }
  // --- END UPDATE ---

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-slate-400">
              Transform incident data into actionable intelligence
            </p>
          </div>

          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-40 bg-slate-700 border-slate-600">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="24hours">Last 24 Hours</SelectItem>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>

            <Button
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* KPI Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          <KPICard
            title="Avg Response Time"
            value={`${kpiData.avgResponseTime}m`}
            change="-0.3m from yesterday"
            icon={<Timer className="h-8 w-8" />}
            trend="up"
          />
          <KPICard
            title="Resolution Rate"
            value={`${kpiData.incidentResolutionRate}%`}
            change="+2.1% from last week"
            icon={<Target className="h-8 w-8" />}
            trend="up"
          />
          <KPICard
            title="Today's Incidents"
            value={kpiData.totalIncidentsToday}
            change="3 new in last hour"
            icon={<AlertTriangle className="h-8 w-8" />}
          />
          <KPICard
            title="Active Teams"
            value={kpiData.activeResponseTeams}
            icon={<Shield className="h-8 w-8" />}
          />
          <KPICard
            title="Tourists Assisted"
            value={kpiData.touristsAssisted}
            change="+12 since morning"
            icon={<Users className="h-8 w-8" />}
            trend="up"
          />
          <KPICard
            title="Operator Efficiency"
            value={`${kpiData.operatorEfficiency}%`}
            change="Above target"
            icon={<Activity className="h-8 w-8" />}
            trend="stable"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">
              <BarChart className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="geospatial"
              className="data-[state=active]:bg-slate-700"
            >
              <Map className="h-4 w-4 mr-2" />
              Geospatial
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-slate-700">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="teams" className="data-[state=active]:bg-slate-700">
              <Award className="h-4 w-4 mr-2" />
              Team Performance
            </TabsTrigger>
          </TabsList>

          {/* ... (Overview, Trends, and Teams Tabs remain the same) ... */}
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Peak Hours Chart */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-400" />
                    Peak Incident Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={PEAK_HOURS_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="hour" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #475569',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar
                        dataKey="incidents"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Incidents by Type */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-orange-400" />
                    Incidents by Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={INCIDENT_BY_TYPE_DATA}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                        }
                      >
                        {INCIDENT_BY_TYPE_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #475569',
                          borderRadius: '8px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Location Comparison */}
              <Card className="bg-slate-800 border-slate-700 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-green-400" />
                    Location-based Incident Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                      data={LOCATION_COMPARISON_DATA}
                      layout="horizontal"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis type="number" stroke="#94a3b8" />
                      <YAxis
                        dataKey="location"
                        type="category"
                        stroke="#94a3b8"
                        width={120}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #475569',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar
                        dataKey="incidents"
                        fill="#06b6d4"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Geospatial Tab */}
          <TabsContent value="geospatial" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Heatmap Controls */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Layers className="h-5 w-5 mr-2 text-purple-400" />
                    Heatmap Layers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {[
                      {
                        id: 'incidents',
                        label: 'Incident Hotspots',
                        color: 'bg-red-500',
                      },
                      {
                        id: 'tourists',
                        label: 'Tourist Density',
                        color: 'bg-blue-500',
                      },
                      { id: 'safe', label: 'Safe Zones', color: 'bg-green-500' },
                    ].map((layer) => (
                      <Button
                        key={layer.id}
                        variant={
                          selectedHeatmapLayer === layer.id
                            ? 'default'
                            : 'outline'
                        }
                        className={`w-full justify-start ${
                          selectedHeatmapLayer === layer.id
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'border-slate-600 text-slate-300 hover:bg-slate-700'
                        }`}
                        onClick={() => setSelectedHeatmapLayer(layer.id)}
                      >
                        <div
                          className={`w-3 h-3 rounded-full ${layer.color} mr-2`}
                        ></div>
                        {layer.label}
                      </Button>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-700">
                    <h4 className="text-sm font-semibold text-slate-200 mb-2">
                      Legend
                    </h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-slate-300">High Risk (Incidents)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-slate-300">High Density (Tourists)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-slate-300">Safe Zone</span>
                      </div>
                      {/* You might want to adjust these legend items to match the new styles more accurately if desired */}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Interactive Heatmap */}
              <Card className="bg-slate-800 border-slate-700 lg:col-span-3">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-blue-400" />
                      Delhi Tourism Safety Heatmap
                    </div>
                    <Badge variant="secondary" className="bg-slate-700">
                      {selectedHeatmapLayer === 'incidents'
                        ? 'Incident Hotspots'
                        : selectedHeatmapLayer === 'tourists'
                        ? 'Tourist Density'
                        : 'Safe Zones'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden">
                    <iframe
                      src="https://www.openstreetmap.org/export/embed.html?bbox=77.0500%2C28.4000%2C77.3500%2C28.7500&amp;layer=mapnik"
                      className="w-full h-full border-0"
                      title="Delhi Tourism Safety Heatmap"
                    />

                    {/* This div sits on top of the iframe and acts as the container for the points */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                      {currentHeatmapData.map((location, index) => (
                        <div
                          key={`${selectedHeatmapLayer}-${index}`}
                          className="absolute rounded-full -translate-x-1/2 -translate-y-1/2"
                          style={{
                            ...getHeatmapStyle(
                              selectedHeatmapLayer,
                              location.intensity
                            ),
                            top: `${45 + (location.lat - 28.6) * 800}%`,
                            left: `${50 + (location.lng - 77.2) * 800}%`,
                          }}
                          title={`${location.name} - Intensity: ${(
                            location.intensity * 100
                          ).toFixed(0)}%`}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                  Incident Trends Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={INCIDENT_TRENDS_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="medical"
                      stackId="1"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="theft"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="security"
                      stackId="1"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="accident"
                      stackId="1"
                      stroke="#06b6d4"
                      fill="#06b6d4"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Performance Tab */}
          <TabsContent value="teams" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Award className="h-5 w-5 mr-2 text-yellow-400" />
                  Response Team Performance Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {TEAM_PERFORMANCE_DATA.sort(
                    (a, b) => b.efficiency - a.efficiency
                  ).map((team, index) => (
                    <div
                      key={team.team}
                      className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:bg-slate-700 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`
                              w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm
                              ${
                                index === 0
                                  ? 'bg-yellow-500'
                                  : index === 1
                                  ? 'bg-gray-400'
                                  : index === 2
                                  ? 'bg-amber-600'
                                  : 'bg-slate-600'
                              }
                            `}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">
                              {team.team}
                            </h3>
                            <p className="text-sm text-slate-400">
                              {team.totalIncidents} incidents handled
                            </p>
                          </div>
                        </div>
                        <Badge
                          className={`
                            ${
                              team.efficiency >= 95
                                ? 'bg-green-600'
                                : team.efficiency >= 90
                                ? 'bg-blue-600'
                                : team.efficiency >= 85
                                ? 'bg-yellow-600'
                                : 'bg-red-600'
                            }
                          `}
                        >
                          {team.efficiency}% Efficiency
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-slate-400">Acknowledge Time</p>
                          <p className="text-white font-semibold">
                            {team.acknowledgeTime}m
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400">Travel Time</p>
                          <p className="text-white font-semibold">
                            {team.travelTime}m
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400">Resolution Time</p>
                          <p className="text-white font-semibold">
                            {team.resolutionTime}m
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Refresh Status Alert */}
        {isRefreshing && (
          <Alert className="mt-4 border-blue-500 bg-blue-950/50 text-blue-200">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <AlertDescription className="font-medium">
              Refreshing analytics data...
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;