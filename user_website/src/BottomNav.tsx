import React from 'react';
import { Map, Bell, User } from 'lucide-react'; // Added User icon

// --- CHANGE: Added 'Profile' to the page names ---
export type PageName = 'Map' | 'Alerts' | 'Profile';

// --- CHANGE: Added 'onProfileClick' to the props ---
interface BottomNavProps {
  activePage: PageName;
  setActivePage: (page: PageName) => void;
  hasNewAlerts: boolean;
  onProfileClick: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activePage, setActivePage, hasNewAlerts, onProfileClick }) => {
  // --- CHANGE: Added the 'Profile' item to the navigation list ---
  const navItems = [
    { name: 'Map' as PageName, icon: Map },
    { name: 'Alerts' as PageName, icon: Bell },
    { name: 'Profile' as PageName, icon: User },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '10px 0',
      zIndex: 1000,
    }}>
      {navItems.map((item) => {
        const isActive = activePage === item.name;
        const Icon = item.icon;
        return (
          <button
            key={item.name}
            // --- CHANGE: The click handler now checks if it's the profile button ---
            onClick={() => {
              if (item.name === 'Profile') {
                onProfileClick();
              } else {
                setActivePage(item.name);
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              // Profile is never "active" in the same way, so it stays a default color
              color: isActive ? '#007AFF' : '#8E8E93',
              transition: 'color 0.2s',
              position: 'relative',
            }}
          >
            <Icon size={24} />
            <span style={{ fontSize: '10px', marginTop: '2px' }}>{item.name}</span>
            
            {item.name === 'Alerts' && hasNewAlerts && (
              <div style={{
                position: 'absolute',
                top: '-2px',
                right: '12px',
                width: '8px',
                height: '8px',
                backgroundColor: 'red',
                borderRadius: '50%',
                border: '1px solid white'
              }}></div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;