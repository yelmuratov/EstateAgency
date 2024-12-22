import { SessionOptions } from "iron-session";

export interface SessionData {
  userId?: string;
  username?: string;
  isLoggedIn: boolean;
  is_superuser?: boolean;
  token?: string;
}

export const defaultSession: SessionData = {
  isLoggedIn: false,
};

export const sessionOptions: SessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: "auth_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  },
};