// utils/theme.js
export function applyTheme(isDark) {
  document.documentElement.setAttribute(
    "data-theme",
    isDark ? "dark" : "light"
  );
  localStorage.setItem("iapss_theme", isDark ? "dark" : "light");
}

export function getTheme() {
  return localStorage.getItem("iapss_theme") === "dark";
}
