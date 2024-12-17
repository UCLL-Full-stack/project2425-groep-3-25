import {jwtDecode} from "jwt-decode";

export const isTokenValid = () => {
  if (typeof window === "undefined") {
    // Not running in the browser, so sessionStorage is not available
    return false;
  }

  const token = sessionStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded: { exp: number } = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      sessionStorage.removeItem("token");
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error decoding token:", err);
    return false;
  }
};