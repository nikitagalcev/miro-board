import React, { memo } from 'react';
import './Logout.css'

interface ILogoutProps {
  userName: string;
  handleLogoutClick: () => void;
}

const LogoutButton: React.FC<ILogoutProps> = memo(({
  userName,
  handleLogoutClick
}) => {
  return (
    <div className='logout'>
      <button onClick={handleLogoutClick}>Logout from {userName}</button>
    </div>
  )
});

export default LogoutButton;
