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

    // Decode the payload (second part)
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64").toString("utf-8"),
    );

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
