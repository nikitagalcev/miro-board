import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import WhiteBoard from './components/WhiteBoard';
import LogoutButton from './components/Logout';
import './App.css';

const App: React.FC = memo(() => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const savedName = localStorage.getItem('userName');

    if (savedName) {
      setUserName(savedName);
    } else {
      navigate("/login");
    }
  }, []);

  const handleLogout = useCallback(() => {
    setUserName(null);
    navigate("/login");
  }, []);

  return (
    <div className='whiteboard-backdrop'>
      <LogoutButton userName={userName!} handleLogoutClick={handleLogout} />
      <WhiteBoard userName={userName!} />
    </div>
  );
})

export default App;
