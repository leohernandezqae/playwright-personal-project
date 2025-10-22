// auth.js
// Decode JWT payload
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1]; // payload part
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

// Returns remaining time in seconds
export function getTokenRemainingTime() {
  const token = localStorage.getItem("token");
  if (!token) return 0;

  const payload = parseJwt(token);
  if (!payload || !payload.exp) return 0;

  const remaining = Math.floor(payload.exp * 1000 - Date.now()) / 1000;
  return remaining > 0 ? remaining : 0;
}

// Check authentication and token expiry
export function checkAuth() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login.html"; // redirect if no token
    return false;
  }

  const payload = parseJwt(token);
  const remaining = getTokenRemainingTime();

  // Check if token is expired
  if (!payload || (payload.exp && Date.now() >= payload.exp * 1000) || remaining <= 0) {
    localStorage.removeItem("token"); // remove expired token
    alert("Session expired. Please log in again.");
    window.location.href = "/login.html"; // redirect to login
    return false;
  }

  return true; // token is valid
}