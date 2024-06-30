import { createCookieSessionStorage } from "@remix-run/node";

export type FlashSessionInterface = {
  alert: {
    status: "error" | "success";
    title: string;
    message: string;
  };
};

const sessionSecret = "vhbnjkmvghbjnkmhbhjkl6789";
if (!sessionSecret) {
  throw new Error("No session secret provided!");
}

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<FlashSessionInterface>({
    cookie: {
      name: "__flash_session",
      maxAge: 1,
      secrets: [sessionSecret],
      path: "/",
      sameSite: "lax",
      httpOnly: true,
    },
  });

const getFlashSession = getSession;
const commitFlashSession = commitSession;
const destroyFlashSession = destroySession;

export { getFlashSession, commitFlashSession, destroyFlashSession };
