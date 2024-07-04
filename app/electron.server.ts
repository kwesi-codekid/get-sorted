import electron from "electron";
import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno
import si from "systeminformation";

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

export const getMacAddress = async () => {
  try {
    const networkInterfaces = await si.networkInterfaces();
    for (const iface of networkInterfaces) {
      if (
        iface.type == "wired" &&
        iface.mac != "00:00:00:00:00:00" &&
        iface.mac != "ff:ff:ff:ff:ff:ff"
      ) {
        return iface.mac;
      }
    }
  } catch (error) {
    console.error("Error getting MAC address:", error);
  }
};

export default electron;
