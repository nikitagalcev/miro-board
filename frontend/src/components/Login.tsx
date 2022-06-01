import React, { useState, useCallback, memo } from 'react';
import { useNavigate } from "react-router-dom";
import { setupLoginRequest } from '../api';

const Login: React.FC = memo(() => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = useCallback(async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (name) {
      const loginSuccess = await setupLoginRequest(name);
      if (loginSuccess) {
        localStorage.setItem('userName', name);
        setErrorMessage(null);
        return navigate("/");
      }
    }

    setErrorMessage('Something unexpected happend, please try again');
  }, [name, navigate]);

  return (
    <div style={{ width: '100vw', height: '100vh', justifyContent: 'center', alignItems: 'center', display: 'flex' }} >
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter user name..."
          defaultValue={name}
          onInput={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
        />
        <button type="submit">Login</button>
        <span>{errorMessage}</span>
      </form>
    </div>
  )
});


export default Login;