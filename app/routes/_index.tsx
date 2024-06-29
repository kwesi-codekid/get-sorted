// import { Button, Progress } from "@nextui-org/react";
// import { Link, useLoaderData, useNavigate } from "@remix-run/react";
// import { useState } from "react";
// import electron from "~/electron.server";
import { Progress } from "@nextui-org/react";
import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import supportIllustration from "~/assets/illustrations/tech-support.svg";

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/login");
    }, 2800);
  }, []);

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

// export function loader() {
//   return {
//     userDataPath: electron.app.getPath("userData"),
//   };
// }
