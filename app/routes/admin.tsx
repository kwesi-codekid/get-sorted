import { Outlet, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import Header from "~/components/sections/header";
import Sidebar from "~/components/sections/sidebar";
import { adminNavLinks } from "~/data/nav-links";
import { useLocalStorage } from "~/hooks/useLocalStorage";

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
          navLinks={adminNavLinks}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />
      </div>

      {/* page content */}
      <div className="flex-1">
        <Header navLinks={adminNavLinks} basePath={"/admin"} />
        <div className="-mt-10 px-3 h-[90vh]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
