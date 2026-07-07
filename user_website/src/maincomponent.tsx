import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Polygon, Polyline, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

import {
  Search, Target, Layers, Navigation, AlertTriangle, Shield, Construction,
  MapPin, Info, X, Clock, Home, Briefcase, Dumbbell
} from 'lucide-react';

// --- LEAFLET & CSS SETUP ---

// Fix for default Leaflet icon path issues with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom CSS injected directly for simplicity
const GlobalStyles = () => (
  <style>{`
    @import 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css';
    
    .leaflet-container {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: #f8fafc;
      outline: none;
    }
    
    @keyframes pulse-danger {
      0% { fill-opacity: 0.3; stroke-opacity: 0.8; }
      50% { fill-opacity: 0.5; stroke-opacity: 1; }
      100% { fill-opacity: 0.3; stroke-opacity: 0.8; }
    }
    
    .danger-zone { animation: pulse-danger 2s infinite; }
    .danger-zone-selected { animation: pulse-danger 1s infinite; }
    
    .leaflet-control-zoom { display: none; }

    /* Basic dark mode support */
    @media (prefers-color-scheme: dark) {
      .leaflet-tile-pane { filter: invert(1) hue-rotate(180deg) brightness(95%) contrast(90%); }
    }
  `}</style>
);


// --- TYPE DEFINITIONS (from types/map.ts) BLURPRINTS ---

export interface GeofencedZone {
  id: string;
  type: 'danger' | 'safe' | 'construction' | 'event';
  coordinates: [number, number][];
  title: string;
  description: string;
  duration?: string;
  source: string;
  isActive: boolean;
  severity?: 'low' | 'medium' | 'high';
}

export interface RouteData {
  coordinates: [number, number][];
  instructions: RouteInstruction[];
  totalDistance: number;
  totalTime: number;
  hasAlternative: boolean;
  alternativeRoute?: [number, number][];
}

export interface RouteInstruction {
  distance: number;
  instruction: string;
  street: string;
}

export interface LayerVisibility {
  danger: boolean;
  safe: boolean;
  construction: boolean;
  event: boolean;
}

export interface UserLocation {
  coords: [number, number];
  accuracy: number;
}

export interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}


// --- MOCK DATA (for North East Delhi) ---

export const mockZones: GeofencedZone[] = [
  { id: '1', type: 'danger', coordinates: [[28.6735, 77.2650], [28.6745, 77.2650], [28.6745, 77.2660], [28.6735, 77.2660]], title: 'High Traffic Alert', description: 'Extreme congestion reported due to market rush. Avoid this area.', duration: 'Active Now', source: 'Delhi Traffic Police', isActive: true, severity: 'high' },
  { id: '2', type: 'safe', coordinates: [[28.6980, 77.2850], [28.6990, 77.2850], [28.6990, 77.2860], [28.6980, 77.2860]], title: 'Community Safe Zone', description: 'Well-lit area with active RWA security and police patrolling.', source: 'Community Verified', isActive: true },
  { id: '3', type: 'construction', coordinates: [[28.6750, 77.2900], [28.6850, 77.2905], [28.6850, 77.2915], [28.6750, 77.2910]], title: 'Metro Phase IV Work', description: 'Flyover construction in progress. Expect lane closures and significant delays.', duration: 'Until Jan 2026', source: 'DMRC', isActive: true, severity: 'medium' },
  { id: '4', type: 'event', coordinates: [[28.7250, 77.2800], [28.7260, 77.2800], [28.7260, 77.2810], [28.7250, 77.2810]], title: 'Weekly Market (Budh Bazar)', description: 'Local market is active, leading to road closures and no parking.', duration: '4:00 PM - 10:00 PM', source: 'Local Authority', isActive: true, severity: 'low' }
];

export const mockRoute: RouteData = {
  coordinates: [[28.6985, 77.2855], [28.6950, 77.2865], [28.6850, 77.2910], [28.6830, 77.2980]],
  instructions: [{ distance: 0.5, instruction: 'Head south from Yamuna Vihar C-Block', street: 'Wazirabad Road' }, { distance: 1.2, instruction: 'Turn left onto Grand Trunk Road', street: 'GT Road' }, { distance: 0.8, instruction: 'Continue straight towards Dilshad Garden', street: 'GT Road' }, { distance: 0.2, instruction: 'Arrive at GTB Hospital on your left', street: 'GTB Enclave' }],
  totalDistance: 2.7, totalTime: 15, hasAlternative: true,
  alternativeRoute: [[28.6985, 77.2855], [28.6995, 77.2805], [28.6840, 77.2815], [28.6830, 77.2980]]
};

export const recentLocations = [{ id: '1', name: 'Home', address: 'Yamuna Vihar, Delhi', icon: Home }, { id: '2', name: 'Office', address: 'Connaught Place, Delhi', icon: Briefcase }, { id: '3', name: 'Friend\'s House', address: 'Karawal Nagar, Delhi', icon: Dumbbell }];

// --- UTILITY FUNCTIONS ---

const isPointInPolygon = (point: [number, number], polygon: [number, number][]): boolean => {
  const [x, y] = point; let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) { const [xi, yi] = polygon[i]; const [xj, yj] = polygon[j]; if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) { inside = !inside; } }
  return inside;
};

const getZoneStyle = (type: string, isSelected: boolean = false) => {
  const base = { weight: isSelected ? 3 : 2 };
  switch (type) {
    case 'danger': return { ...base, color: '#FF3B30', fillColor: '#FF3B30', fillOpacity: 0.4, className: isSelected ? 'danger-zone-selected' : 'danger-zone' };
    case 'safe': return { ...base, color: '#34C759', fillColor: '#34C759', fillOpacity: 0.3 };
    case 'construction': return { ...base, color: '#FFCC00', fillColor: '#FFCC00', fillOpacity: 0.4, dashArray: '10, 5' };
    case 'event': return { ...base, color: '#007AFF', fillColor: '#007AFF', fillOpacity: 0.3 };
    default: return base;
  }
};

const formatDuration = (minutes: number) => { if (minutes < 60) return `${Math.round(minutes)} min`; const h = Math.floor(minutes / 60); const m = Math.round(minutes % 60); return `${h}h ${m}m`; };
const formatDistance = (km: number) => { if (km < 1) return `${Math.round(km * 1000)} m`; return `${km.toFixed(1)} km`; };
const checkDangerZoneEntry = (userLocation: [number, number], zones: GeofencedZone[]) => zones.find(zone => zone.type === 'danger' && zone.isActive && isPointInPolygon(userLocation, zone.coordinates)) || null;

// --- CUSTOM HOOK ---

const useGeolocation = () => {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) { setError('Geolocation is not supported'); return; }
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setLocation({ coords: [pos.coords.latitude, pos.coords.longitude], accuracy: pos.coords.accuracy }),
      (err) => { setError(err.message); setLocation({ coords: [28.6985, 77.2855], accuracy: 100 }); },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { location, error };
};


// --- MOCK SHADCN/UI COMPONENTS ---

const Card: React.FC<{ className?: string, children: React.ReactNode, onClick?: () => void }> = ({ className, children, onClick }) => <div onClick={onClick} className={`bg-white rounded-xl shadow-md ${className}`}>{children}</div>;
const CardContent: React.FC<{ className?: string, children: React.ReactNode }> = ({ className, children }) => <div className={`p-4 ${className}`}>{children}</div>;
const Button: React.FC<{ className?: string, size?: string, variant?: string, onClick?: (e: React.MouseEvent) => void, children: React.ReactNode }> = ({ className, onClick, children }) => <button onClick={onClick} className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50 disabled:pointer-events-none ${className}`}>{children}</button>;
const Input: React.FC<{ placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, onFocus?: () => void, className?: string, onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void }> = (props) => <input {...props} className={`flex h-10 w-full rounded-md border-none bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 ${props.className}`} />;
const Switch: React.FC<{ checked: boolean, onCheckedChange: (checked: boolean) => void }> = ({ checked, onCheckedChange }) => (
  <button onClick={() => onCheckedChange(!checked)} className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-slate-900' : 'bg-gray-200'}`}>
    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);


// --- MAP SUB-COMPONENTS ---

const MapController: React.FC<{ userLocation: [number, number] }> = ({ userLocation }) => {
  const map = useMap();
  useEffect(() => { if (userLocation) map.setView(userLocation); }, [userLocation, map]);
  return null;
};
const ZoneClickHandler: React.FC<{ zones: GeofencedZone[], onZoneClick: (zone: GeofencedZone, pos: [number, number]) => void }> = ({ zones, onZoneClick }) => {
  useMapEvents({ click(e) { const clicked: [number, number] = [e.latlng.lat, e.latlng.lng]; const zone = zones.find(z => isPointInPolygon(clicked, z.coordinates)); if (zone) onZoneClick(zone, clicked); } });
  return null;
};
const getZoneIcon = (type: string) => {
  switch (type) {
    case 'danger': return <AlertTriangle className="w-4 h-4 text-red-500" />;
    case 'safe': return <Shield className="w-4 h-4 text-green-500" />;
    case 'construction': return <Construction className="w-4 h-4 text-yellow-500" />;
    case 'event': return <Info className="w-4 h-4 text-blue-500" />;
    default: return <MapPin className="w-4 h-4" />;
  }
};

const ZoneDetailsCard: React.FC<{ zone: GeofencedZone, onClose: () => void, onNavigate: () => void }> = ({ zone, onClose, onNavigate }) => (
  <div className="absolute bottom-20 left-4 right-4 z-[1000]">
    <Card className="shadow-lg border">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {getZoneIcon(zone.type)}
              <h3 className="font-bold text-lg">{zone.title}</h3>
            </div>
            <p className="text-sm text-gray-600">{zone.description}</p>
            {zone.duration && <p className="text-xs text-gray-500 mt-2 flex items-center gap-1"><Clock className="w-3 h-3" />{zone.duration}</p>}
          </div>
          <Button onClick={onClose} size="sm" variant="ghost" className="w-8 h-8 rounded-full p-0 -mt-2 -mr-2"><X className="w-4 h-4" /></Button>
        </div>
        <Button onClick={onNavigate} className="w-full mt-4 bg-slate-900 text-white hover:bg-slate-800"><Navigation className="w-4 h-4 mr-2" />Navigate Safely</Button>
      </CardContent>
    </Card>
  </div>
);
const LayerPanel: React.FC<{ layerVisibility: LayerVisibility, onLayerToggle: (layer: keyof LayerVisibility) => void, onClose: () => void }> = ({ layerVisibility, onLayerToggle, onClose }) => (
  <div className="absolute inset-0 bg-black/30 z-[1001]" onClick={onClose}>
    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Map Layers</h3>
        <Button onClick={onClose} size="sm" variant="ghost" className="w-8 h-8 rounded-full p-0"><X className="w-4 h-4" /></Button>
      </div>
      <div className="space-y-4">
        {Object.entries(layerVisibility).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {getZoneIcon(key)}
              <span className="capitalize text-base">{key} Zones</span>
            </div>
            <Switch checked={value} onCheckedChange={() => onLayerToggle(key as keyof LayerVisibility)} />
          </div>
        ))}
      </div>
    </div>
  </div>
);
const SearchModal: React.FC<{ onSelectResult: (coords: [number, number]) => void, onClose: () => void }> = ({ onSelectResult, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (query.trim() === '') return;
    setIsLoading(true);
    try {
      // The original URL for the Nominatim API
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&countrycodes=in`;
      
      // We wrap the original URL in a new CORS proxy to bypass browser security restrictions
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(nominatimUrl)}`;

      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error('Search request failed');
      }
      
      const data = await response.json();
      setResults(data || []);
    } catch (error) {
      console.error("Failed to fetch search results:", error);
      setResults([]);
    }
    setIsLoading(false);
  };

  // Auto-search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length > 2) {
        handleSearch();
      } else {
        setResults([]);
      }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelectResult = (coords: [number, number]) => {
    onSelectResult(coords);
    setQuery('');
    setResults([]);
  };

  return (
    <div className="absolute inset-0 bg-white z-[1002] p-4 flex flex-col">
      <div className="flex items-center mb-4 flex-shrink-0">
        <div className="flex-grow flex items-center bg-gray-100 rounded-lg">
          <Search className="w-5 h-5 text-gray-400 mx-3" />
          <Input
            placeholder="Search places in India..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="text-base bg-transparent"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={onClose} size="sm" variant="ghost" className="w-auto h-10 p-2 ml-2 text-gray-600">Cancel</Button>
      </div>
      
      <div className="overflow-y-auto">
        {isLoading ? (
          <div className="text-center p-4">
            <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p>Searching...</p>
          </div>
        ) : (
          <>
            {results.length > 0 ? (
              results.map(res => (
                <button 
                  key={res.place_id} 
                  onClick={() => handleSelectResult([parseFloat(res.lat), parseFloat(res.lon)])} 
                  className="w-full text-left flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="bg-gray-100 rounded-full p-2">
                    <MapPin className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{res.display_name.split(',')[0]}</p>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {res.display_name.substring(res.display_name.indexOf(',') + 2)}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              query.trim().length > 2 && !isLoading && (
                <div className="text-center p-4 text-gray-500">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p>No places found for "{query}"</p>
                  <p className="text-xs mt-1">Try searching for landmarks, cities, or addresses</p>
                </div>
              )
            )}
            
            {query.trim().length <= 2 && query.trim().length > 0 && (
              <div className="text-center p-4 text-gray-500">
                <p className="text-sm">Type at least 3 characters to search</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
};
const NavigationPanel: React.FC<{ route: RouteData, onClose: () => void }> = ({ route, onClose }) => (
  <div className="absolute top-0 left-0 right-0 z-[1000]">
    <div className="p-4">
      <Card className="shadow-lg">
        <CardContent className="p-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-lg">{route.instructions[0].instruction}</p>
              <p className="text-sm text-gray-500">Next: {route.instructions[1].street}</p>
            </div>
            <Button onClick={onClose} size="sm" className="bg-red-500 text-white hover:bg-red-600 px-3">End</Button>
          </div>
        </CardContent>
      </Card>
    </div>
    <div className="absolute bottom-20 left-4 right-4">
      <Card className="shadow-lg">
        <CardContent className="p-3 text-center">
          <p className="font-bold text-lg">{formatDuration(route.totalTime)}</p>
          <p className="text-sm text-gray-500">{formatDistance(route.totalDistance)}</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

// --- MAIN MAP COMPONENT ---

const MainComponent: React.FC = () => {
  const { location: geoLocation, error: geoError } = useGeolocation();
  const [userLocation, setUserLocation] = useState<[number, number]>([28.6985, 77.2855]); // Yamuna Vihar
  const [selectedZone, setSelectedZone] = useState<GeofencedZone | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [route, setRoute] = useState<RouteData | null>(null);
  const [searchedLocation, setSearchedLocation] = useState<[number, number] | null>(null);

  const [layerVisibility, setLayerVisibility] = useState<LayerVisibility>({ danger: true, safe: true, construction: true, event: true });
  const mapRef = useRef<L.Map>(null);

  useEffect(() => { if (geoLocation) setUserLocation(geoLocation.coords); }, [geoLocation]);
  useEffect(() => { const dangerZone = checkDangerZoneEntry(userLocation, mockZones); if (dangerZone) { setSelectedZone(dangerZone); if ('vibrate' in navigator) navigator.vibrate(200); } }, [userLocation]);

  const visibleZones = mockZones.filter(zone => layerVisibility[zone.type]);

  const handleRecenter = useCallback(() => { if (mapRef.current) mapRef.current.setView(userLocation, 15, { animate: true }); }, [userLocation]);
  const handleZoneClick = useCallback((zone: GeofencedZone) => setSelectedZone(zone), []);
  const handleStartNavigation = useCallback(() => { setRoute(mockRoute); setSelectedZone(null); }, []);
  const handleStopNavigation = useCallback(() => setRoute(null), []);
  const handleResultSelect = useCallback((coords: [number, number]) => {
    if (mapRef.current) {
      mapRef.current.setView(coords, 16, { animate: true });
      setSearchedLocation(coords);
      setShowSearch(false);
    }
  }, []);

  return (
    <div className="relative w-full h-screen bg-gray-100 overflow-hidden">
      <GlobalStyles />
      <MapContainer center={userLocation} zoom={15} style={{ height: '100%', width: '100%' }} ref={mapRef} zoomControl={false} attributionControl={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
        <MapController userLocation={userLocation} />
        <ZoneClickHandler zones={visibleZones} onZoneClick={handleZoneClick} />

        {visibleZones.map(zone => <Polygon key={zone.id} positions={zone.coordinates} pathOptions={getZoneStyle(zone.type, selectedZone?.id === zone.id)} />)}

        {geoLocation && <Marker position={userLocation} />}
        {searchedLocation && <Marker position={searchedLocation} />}

        {route && (
          <>
            <Polyline positions={route.coordinates} pathOptions={{ color: '#007AFF', weight: 5, opacity: 0.8 }} />
            {route.alternativeRoute && <Polyline positions={route.alternativeRoute} pathOptions={{ color: '#6B7280', weight: 4, opacity: 0.7, dashArray: '10, 5' }} />}
          </>
        )}
      </MapContainer>

      {!route && (
        <>
          <div className="absolute top-4 left-4 right-4 z-[1000]">
            <Card className="shadow-lg border-0 cursor-pointer" onClick={() => setShowSearch(true)}>
              <CardContent className="p-2">
                <div className="flex items-center space-x-2">
                  <Search className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                  <div className="text-gray-500 h-10 flex items-center">Search for places...</div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="absolute bottom-20 right-4 z-[1000] flex flex-col space-y-3">
            <Button onClick={handleRecenter} className="w-14 h-14 rounded-full shadow-lg bg-white text-slate-800 hover:bg-gray-100 p-0"><Target className="w-6 h-6" /></Button>
            <Button onClick={() => setShowLayers(true)} className="w-14 h-14 rounded-full shadow-lg bg-white text-slate-800 hover:bg-gray-100 p-0"><Layers className="w-6 h-6" /></Button>
          </div>
        </>
      )}

      {showSearch && <SearchModal onSelectResult={handleResultSelect} onClose={() => setShowSearch(false)} />}
      {showLayers && <LayerPanel layerVisibility={layerVisibility} onLayerToggle={(key) => setLayerVisibility(p => ({ ...p, [key]: !p[key] }))} onClose={() => setShowLayers(false)} />}
      {selectedZone && <ZoneDetailsCard zone={selectedZone} onClose={() => setSelectedZone(null)} onNavigate={handleStartNavigation} />}
      {route && <NavigationPanel route={route} onClose={handleStopNavigation} />}

      {geoError && (
        <div className="absolute top-20 left-4 right-4 z-[1001]">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-3 flex items-center space-x-2"><AlertTriangle className="w-5 h-5 text-red-500" /><p className="text-red-700 text-sm">Location access denied. Using default location.</p></CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MainComponent;

