// LOCAL default: http://localhost:5000
// DEPLOYED: set VITE_API_URL to your Vercel backend URL in Netlify environment variables.
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

export async function api(path, options = {}) {
  const token = localStorage.getItem('hostel_token');
  const headers = { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error(`Cannot connect to backend. Check that it is running at ${API_URL}, or set VITE_API_URL correctly.`);
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed. Please try again.');
  return data;
}
