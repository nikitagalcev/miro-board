import React, { memo } from 'react';

interface ILogoutProps {
  userName: string;
  handleLogoutClick: () => void;
}

const LogoutButton: React.FC<ILogoutProps> = memo(({
  userName,
  handleLogoutClick
}) => {
  return (
    <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 99999 }}>
      <button onClick={handleLogoutClick}>Logout from {userName}</button>
    </div>
  )
});

export default LogoutButton;
