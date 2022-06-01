// const loginEndpoint;

export const setupLoginRequest = async (userName: string) => {
  const res = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userName }),
  });

  return res.ok; // или не ок блядь
};