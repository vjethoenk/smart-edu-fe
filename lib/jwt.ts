/**
 * Decode JWT token and check if it's expired
 * Note: This does NOT verify the signature, only decodes the payload
 */
export function decodeJWT(token: string): {
  payload: any;
  isExpired: boolean;
} {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return { payload: null, isExpired: true };
    }

    // Decode the payload (second part) safely on both client, server and Edge runtime
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);

    // Check if token is expired
    if (payload.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp < currentTime;
      return { payload, isExpired };
    }

    return { payload, isExpired: false };
  } catch (error) {
    return { payload: null, isExpired: true };
  }
}

/**
 * Check if JWT token is valid and not expired
 */
export function isTokenValid(token?: string): boolean {
  if (!token) return false;
  const { isExpired } = decodeJWT(token);
  return !isExpired;
}
