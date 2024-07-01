// import { Button, Progress } from "@nextui-org/react";
// import { Link, useLoaderData, useNavigate } from "@remix-run/react";
// import { useState } from "react";
// import electron from "~/electron.server";
import { Progress } from "@nextui-org/react";
import { LoaderFunction, json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import supportIllustration from "~/assets/illustrations/tech-support.svg";
import { fetchCurrentUser } from "~/data/api/user";
import { commitSession, getSession } from "~/electron.server";
import { UserInterface } from "~/utils/types";

export default function SplashScreen() {
  const navigate = useNavigate();
  const token = useLoaderData<typeof loader>();

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        navigate("/login");
      } else {
        try {
          const currentUser: UserInterface | undefined = await fetchCurrentUser(
            token
          );
          if (currentUser) {
            navigate(`/${currentUser.role}`);
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }
    };

    const timeoutId = setTimeout(fetchUser, 800);

    return () => clearTimeout(timeoutId);
  }, [token, navigate]);

  return (
    <main className="h-screen w-full flex items-center justify-center flex-col gap-5 overflow-hidden">
      <img
        src={supportIllustration}
        alt="support illustration"
        className="w-80"
      />

      <h1 className="font-montserrat font-extrabold text-7xl text-blue-600">
        GetSorted
      </h1>
      <h3 className="font-nunito text-lg text-slate-500">
        Premium Support Helpdesk Software
      </h3>

      <div className="w-72">
        <Progress
          aria-labelledby="splash screen loader"
          isIndeterminate
          color="primary"
          size="sm"
        />
      </div>
    </main>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  // fetch bearer token from session
  const authSession = await getSession(request.headers.get("Cookie"));
  const token = authSession.get("token");

  return json(token, {
    headers: {
      "Set-Cookie": await commitSession(authSession),
    },
  });
};
