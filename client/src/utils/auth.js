const TOKEN_KEY = "iapss_jwt";
const USER_KEY = "iapss_user";


/**
 * Save token and user details on login/register
 */
export function saveAuth(token, user) {
  if (!token || !user) return;
  localStorage.setItem(TOKEN_KEY, token);
  // Store user object as a JSON string
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Retrieve just the token string
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Retrieve the parsed user object
 */
export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw || raw === "undefined" || raw === "null") return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error parsing auth user:", error);
    return null;
  }
}

/**
 * Helper to get both token and user at once (useful for checking auth state)
 */
export function getAuth() {
  const token = localStorage.getItem(TOKEN_KEY);
  const user = getUser(); // Use the robust parsing logic above
  return { token, user };
}

/**
 * Clear data on logout
 */
export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}