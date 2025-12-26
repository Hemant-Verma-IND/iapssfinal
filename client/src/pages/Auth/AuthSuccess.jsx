import { useEffect } from "react";
// Import the SAME utility you used in LoginPage
import { saveAuth } from "../../utils/auth"; 

export default function AuthSuccess() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userStr = params.get("user");

    if (token && userStr) {
      // 1. Save data
      const user = JSON.parse(decodeURIComponent(userStr));
      saveAuth(token, user);

      // 2. CLEAN THE URL (Security Fix)
      // This removes the token from the browser history immediately
      window.history.replaceState({}, document.title, window.location.pathname);

      // 3. Redirect
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/login";
    }
  }, []);

  return <p>Finalizing login...</p>;
}