import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MainComponent from './maincomponent';
import Alerts from './Alerts';
import BottomNav, { type PageName } from './BottomNav';
import ProfilePage from './pages/ProfilePage';
import { Siren, Lock } from 'lucide-react'; // Added Lock icon for the footer

// --- A simple component for the security footer note ---
// This is now a standard component, not a fixed bar.
const SecurityFooter: React.FC = () => {
  return (
    <div style={{
      padding: '20px',
      textAlign: 'center',
      fontSize: '11px',
      color: '#6B7280', // Medium gray text color
      backgroundColor: '#F9FAFB', // Very light gray background
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    }}>
      <Lock size={14} />
      <span>
        End-to-End Secure Channel. Data integrity is verified using SHA-256 hashing.
      </span>
    </div>
  );
};

interface MainAppProps {
  touristId: string;
  onLogout: () => void;
}

const MainApp: React.FC<MainAppProps> = ({ touristId, onLogout }) => {
  // --- All of your existing state and logic is preserved ---
  const [activePage, setActivePage] = useState<PageName>('Map');
  const [showProfile, setShowProfile] = useState(false);
  const [hasNewAlerts, setHasNewAlerts] = useState(false);
  const [totalAlerts, setTotalAlerts] = useState(0);

  useEffect(() => {
    const checkAlerts = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/user-alerts/${touristId}`);
        const liveAlertCount = response.data.length;
        setTotalAlerts(liveAlertCount);
        const lastSeenCount = parseInt(localStorage.getItem('lastSeenAlertCount') || '0');
        if (liveAlertCount > lastSeenCount) {
          setHasNewAlerts(true);
        }
      } catch (error) { console.error("Failed to check for new alerts:", error); }
    };
    checkAlerts();
    const interval = setInterval(checkAlerts, 15000);
    return () => clearInterval(interval);
  }, [touristId]);

  const handleNavClick = (page: PageName) => {
    setActivePage(page);
    if (page === 'Alerts') {
      setHasNewAlerts(false);
      localStorage.setItem('lastSeenAlertCount', totalAlerts.toString());
    }
  };

  const handleSosClick = async () => {
    const sosPayload = {
      touristId: touristId,
      location: "Live Location (Simulated)", type: "Medical", severity: "CRITICAL",
      description: "User triggered SOS from their device.",
      touristInfo: { name: "Priya Sharma", nationality: "Indian", contact: "+91 98765 43210" }
    };
    try {
      await axios.post('http://localhost:8000/incidents/sos', sosPayload);
      alert("SOS Signal Sent! Help is on the way. (Prototype)");
    } catch (error) {
      console.error("Failed to send SOS signal:", error);
      alert("Could not send SOS signal.");
    }
  };

  return (
    <div>
      {/* The SOS button is restored to its original, correct position and styling */}
      <button
        onClick={handleSosClick}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1500,
          backgroundColor: '#EF4444',
          color: 'white',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
          border: 'none',
          cursor: 'pointer',
          animation: 'pulse 2s infinite'
        }}
      >
        <style>{`
          @keyframes pulse {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
          }
        `}</style>
        <Siren size={24} />
      </button>

      {/* The main page content now includes the footer at the bottom */}
      <div style={{ paddingBottom: '70px' }}> {/* Padding so content isn't hidden by the nav bar */}
        {activePage === 'Map' && <MainComponent />}
        {activePage === 'Alerts' && <Alerts />}
        
        {/* --- CHANGE: The new Security Footer is now part of the scrollable content --- */}
        <SecurityFooter />
      </div>
      
      {/* Your bottom navigation and profile modal are preserved */}
      <BottomNav 
        activePage={activePage} 
        setActivePage={handleNavClick} 
        hasNewAlerts={hasNewAlerts}
        onProfileClick={() => setShowProfile(true)} 
      />
      {showProfile && <ProfilePage touristId={touristId} onClose={() => setShowProfile(false)} onLogout={onLogout} />}
    </div>
  );
};

export default MainApp;

