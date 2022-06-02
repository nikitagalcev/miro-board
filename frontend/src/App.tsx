import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import WhiteBoard from './components/WhiteBoard/WhiteBoard';
import LogoutButton from './components/Logout/Logout';

const App: React.FC = memo(() => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);

  const savedName = useMemo(() => localStorage.getItem('userName'), []);

  useEffect(() => {
    if (savedName) {
      setUserName(savedName);
    } else {
      navigate("/login");
    }
  }, [navigate, savedName]);

  const handleLogout = useCallback(() => {
    setUserName(null);
    navigate("/login");
  }, [navigate]);

  return (
    <div className='whiteboard-backdrop'>
      <LogoutButton userName={userName!} handleLogoutClick={handleLogout} />
      <WhiteBoard userName={userName!} />
    </div>
  );
});

export default App;
