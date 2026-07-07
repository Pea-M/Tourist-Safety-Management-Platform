import React, { useState } from 'react';
import { MapPin, FileText, Bell, User } from 'lucide-react';

// You might need to adjust this import path based on your project structure
// For now, we'll create a placeholder Badge component.
// import { Badge } from './components/ui/badge'; 

// --- Placeholder Badge Component ---
// This is a temporary substitute for the actual Badge component from shadcn/ui.
const Badge: React.FC<{ className?: string, children: React.ReactNode, variant?: string }> = ({ className, children }) => (
    <div className={className}>{children}</div>
);

// --- TYPE DEFINITIONS ---
interface NavItem {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  hasNotification?: boolean;
  notificationCount?: number;
}

// --- NAVIGATION DATA ---
const navItems: NavItem[] = [
  { id: 'map', icon: MapPin, label: 'Map' },
  { id: 'posts', icon: FileText, label: 'Posts' },
  { id: 'alerts', icon: Bell, label: 'Alerts', hasNotification: true, notificationCount: 3 },
  { id: 'profile', icon: User, label: 'Profile' }
];


// --- NAVBAR COMPONENT ---
const Navbar: React.FC = () => {
  const [activeTab, setActiveTab] = useState('map');
  
  return (
    // The main container for the navbar, fixed to the bottom of the screen.
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="relative">
        {/* Background Pod */}
        <div
          className="relative bg-slate-900/95 backdrop-blur-md rounded-full px-4 py-3 shadow-2xl border border-slate-700/50"
        >
          {/* Navigation Items */}
          <div className="relative flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <div key={item.id} className="relative">
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-full bg-transparent ease-out duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-0`}
                  >
                    {/* Icon */}
                    <Icon
                      className={`w-6 h-6 transition-colors duration-300 ${
                        isActive ? 'text-white' : 'text-slate-400'
                      }`}
                    />
                  </button>
                  
                  {/* Notification Badge */}
                  {item.hasNotification && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white rounded-full border-2 border-slate-900 pointer-events-none"
                    >
                      {item.notificationCount}
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

