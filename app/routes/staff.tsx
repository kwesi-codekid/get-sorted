import { Button } from "@nextui-org/react";
import {
  Outlet,
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { ArrowLeftAnimated } from "~/components/icons/arrows";
import Header from "~/components/sections/header";
import Sidebar from "~/components/sections/sidebar";
import { staffNavLinks } from "~/data/nav-links";
import { useLocalStorage } from "~/hooks/useLocalStorage";

import errorIllustration from "~/assets/animated/503-error-animate.svg";

export default function AdminLayout() {
  const navigate = useNavigate();

  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const [storedValue, setValue] = useLocalStorage("auth-token", undefined);
  useEffect(() => {
    if (!storedValue) navigate("/login");
  }, []);

  return (
    <div className="h-screen bg-slate-300/30 dark:bg-slate-950 flex relative overflow-y-auto vertical-scrollbar">
      {/* sidebar */}
      <div
        className={`${
          isExpanded ? "w-[17%]" : "w-16"
        } transition-all duration-400`}
      >
        <Sidebar
          navLinks={staffNavLinks}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />
      </div>

      {/* page content */}
      <div className="flex-1">
        <Header navLinks={staffNavLinks} basePath={"/staff"} />
        <div className="-mt-10 px-3 h-[90vh]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="pt-16  h-full">
        <div className="bg-red-500/10 h-full flex flex-col gap-6">
          <img
            src={errorIllustration}
            alt="Error Illustration"
            className="w-1/3"
          />
          <div>
            <h1 className="font-montserrat font-extrabold text-5xl text-red-500 text-center">
              {error.status} {error.statusText}
            </h1>
            <p className="font-nunito text-center text-lg">{error.data}</p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              color="danger"
              className="font-montserrat font-medium"
              onPress={() => navigate(-1)}
              size="sm"
              startContent={<ArrowLeftAnimated className="size-5" />}
            >
              Go Back
            </Button>
            <p className="font-nunito text-sm">
              Please contact the IT Team if the issue persists.
            </p>
          </div>
        </div>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div className="pt-14 h-full">
        <div className="bg-red-500/10 dark:bg-red-500/15 rounded-2xl h-full overflow-y-auto vertical-scrollbar flex flex-col gap-6 items-center justify-center">
          <img
            src={errorIllustration}
            alt="Error Illustration"
            className="w-1/3"
          />
          <div>
            <h1 className="font-montserrat font-extrabold text-5xl text-red-500 text-center">
              Unexpected Error!
            </h1>
            <p className="font-nunito text-center text-lg line-clamp-2">
              {error.message}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              color="danger"
              className="font-montserrat font-medium"
              onPress={() => navigate(-1)}
              size="sm"
              startContent={<ArrowLeftAnimated className="size-5" />}
            >
              Go Back
            </Button>
            <p className="font-nunito text-sm">
              Please contact the IT Team if the issue persists.
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
