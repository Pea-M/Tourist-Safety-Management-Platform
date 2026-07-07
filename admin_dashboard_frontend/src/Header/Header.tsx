import React from 'react';
import { TabName } from '../App';
import { 
  MapPin, AlertTriangle, BarChart3, Radio, Phone, LogOut, Shield, ChevronDown, UserX 
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';

interface NavItem {
  name: TabName;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge?: number;
}
interface HeaderProps {
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [sosActive, setSosActive] = React.useState<boolean>(false);

  const navItems: NavItem[] = [
    { name: 'Live Map', icon: MapPin, color: 'text-blue-500', badge: 156 },
    { name: 'Incidents', icon: AlertTriangle, color: 'text-orange-500', badge: 3 },
    { name: 'Analytics', icon: BarChart3, color: 'text-green-500' },
    { name: 'Broadcast', icon: Radio, color: 'text-purple-500', badge: 2 },
    { name: 'Trespassing Alerts', icon: UserX, color: 'text-red-500' },
  ];

  const handleSOS = (): void => { setSosActive(true); setTimeout(() => setSosActive(false), 4000); };
  const handleLogout = (): void => { console.log('Logging out...'); };

  return (
    <>
      <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 shadow-xl border-b border-blue-700/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="bg-gradient-to-br from-blue-400 to-cyan-500 p-2 rounded-xl shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-105">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">Tourism Safety</h1>
                <p className="text-xs text-slate-400">Department Dashboard</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-2 bg-slate-800/50 backdrop-blur-sm rounded-xl p-1 border border-slate-700/50">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.name;
                return (
                  <Button
                    key={item.name}
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab(item.name)}
                    className={`relative flex items-center space-x-2 transition-all duration-300 group ${isActive ? 'bg-slate-700 text-white shadow-lg hover:bg-slate-600' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'}`}>
                    <Icon className={`h-4 w-4 ${isActive ? item.color : 'text-slate-400 group-hover:text-slate-300'} transition-colors duration-300`} />
                    <span className="font-medium">{item.name}</span>
                    {item.badge && (<Badge variant={isActive ? "default" : "secondary"} className={`ml-1 h-5 min-w-5 text-xs px-1.5 transition-all duration-300 ${isActive ? 'bg-blue-500 hover:bg-blue-600' : 'bg-slate-600 hover:bg-slate-500'}`}>{item.badge}</Badge>)}
                    {isActive && (<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>)}
                  </Button>
                );
              })}
            </nav>
            <div className="flex items-center space-x-4">
              <Button onClick={handleSOS} size="sm" className={`relative flex items-center space-x-2 font-bold transition-all duration-300 shadow-lg ${sosActive ? 'bg-red-600 hover:bg-red-600 animate-pulse shadow-red-500/50' : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 hover:shadow-red-500/30 hover:scale-105'}`}>
                <Phone className={`h-4 w-4 ${sosActive ? 'animate-bounce' : ''}`} />
                <span className="hidden sm:inline">SOS</span>
                {sosActive && (<div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>)}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300">
                    <Avatar className="w-8 h-8"><AvatarFallback className="bg-gradient-to-br from-blue-400 to-cyan-500 text-white text-sm font-semibold">AD</AvatarFallback></Avatar>
                    <span className="hidden sm:inline text-sm font-medium">Admin</span>
                    <ChevronDown className="h-4 w-4 transition-transform duration-300 data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700 mt-2" align="end">
                  <DropdownMenuLabel className="text-white"><div><p className="font-medium">Admin User</p><p className="text-xs text-slate-400 font-normal">admin@tourism.gov.in</p></div></DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem onClick={handleLogout} className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer transition-colors duration-200">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      {sosActive && (
        <Alert className="m-4 border-red-500 bg-red-950/50 text-red-200">
          <Phone className="h-4 w-4 animate-bounce" />
          <AlertDescription className="font-medium">🚨 Emergency SOS Activated - Dispatching Help to Nearest Response Team</AlertDescription>
        </Alert>
      )}
    </>
  );
};
export default Header;