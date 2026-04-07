import Cookies from "js-cookie";

export function clearAuthData() {
  // Clear localStorage
  localStorage.removeItem("access_token");

  // Clear cookies
  Cookies.remove("access_token");
  Cookies.remove("role");
}

export function performLogout() {
  clearAuthData();
  // Optionally redirect to home page
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
}
