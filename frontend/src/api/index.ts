export const setupLoginRequest = async (userName: string) => {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userName }),
  });

  return res.ok;
};
