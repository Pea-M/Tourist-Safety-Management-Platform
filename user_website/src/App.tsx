import { useState, useEffect } from 'react';
import MainApp from './MainApp';
import LoginPage from './pages/LoginPage';

function App() {
  const [touristId, setTouristId] = useState<string | null>(null);

  // Check if the user is already "logged in" when the app first loads
  useEffect(() => {
    const storedId = localStorage.getItem('touristId');
    if (storedId) {
      setTouristId(storedId);
    }
  }, []);

  const handleLogin = (id: string) => {
    setTouristId(id);
    localStorage.setItem('touristId', id);
  };
  
  // For the prototype, logout just clears the stored ID
  const handleLogout = () => {
    setTouristId(null);
    localStorage.removeItem('touristId');
  };
  
  // If we have a touristId, show the main app. Otherwise, show the login page.
  return touristId ? (
    <MainApp touristId={touristId} onLogout={handleLogout} />
  ) : (
    <LoginPage onLogin={handleLogin} />
  );
}

export default App;