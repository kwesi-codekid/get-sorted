import electron from "electron";
import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno

type SessionData = {
  token: string;
};

const secret = "some-super-secret@~##key";
if (!secret) {
  throw new Error("No session secret provided");
}

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData>({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: "auth-session",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
      secrets: [secret],
      // secure: true,
    },
  });
export default electron;
