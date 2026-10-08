import "dotenv/config";

export const PORT = Number(process.env.PORT) || 5000;
export const DATABASE_URL = process.env.DATABASE_URL;
export const JWT_SECRET = process.env.JWT_SECRET;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is missing from .env");
}

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from .env");
}
