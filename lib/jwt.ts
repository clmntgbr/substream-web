import jwt from "jsonwebtoken";

// For now, we just decode the token without verification
// The token is received from an external API and stored in session
export interface JWTPayload {
  username?: string;
  email?: string;
  roles?: string[];
  userId?: string;
  sub?: string;
  [key: string]: unknown; // Allow additional fields from external tokens
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    // Decode without verification since token comes from external API
    return jwt.decode(token) as JWTPayload;
  } catch (error) {
    return null;
  }
}

// Optional: verify token if you have the secret/public key
export function verifyToken(token: string, secret?: string): JWTPayload | null {
  if (!secret) {
    return decodeToken(token);
  }

  try {
    return jwt.verify(token, secret) as JWTPayload;
  } catch (error) {
    return null;
  }
}
