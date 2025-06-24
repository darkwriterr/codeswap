const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function login(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function register(email, password, fullName) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, fullName })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function addInformation(email, password, userData) {
  const res = await fetch(`${API_URL}/add_information`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, userData })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getInformation(email, password) {
  const res = await fetch(`${API_URL}/get_information`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
