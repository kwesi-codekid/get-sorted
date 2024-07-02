import { Button } from "@nextui-org/react";
import { NavLink } from "@remix-run/react";
import { MoonIcon } from "../icons/theme";
import { ReactNode } from "react";
import { MenuCloseIcon, MenuOpenIcon } from "../icons/menu";

export default function Sidebar({
  navLinks,
  isExpanded,
  setIsExpanded,
}: {
  navLinks: { label: string; path: string; icon: ReactNode }[];
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
}) {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen ${
        isExpanded ? "w-[17%]" : "w-16"
      } bg-blue-700 flex flex-col px-3 justify-between py-2 pb-4 transition-all duration-400`}
    >
      {/* toggle */}
      <Button
        isIconOnly
        radius="full"
        variant="flat"
        size="sm"
        className="absolute -right-3.5"
        onPress={() => {
          isExpanded ? setIsExpanded(false) : setIsExpanded(true);
        }}
      >
        {isExpanded ? (
          <MenuOpenIcon className="size-4" />
        ) : (
          <MenuCloseIcon className="size-4" />
        )}
      </Button>
      {/* logo */}
      <div className="border-b-2 border-white/30 h-20"></div>

      {/* nav links */}
      <div className="flex flex-col gap-1">
        {navLinks.map((link, index) => (
          <NavLink
            to={link.path}
            end={true}
            key={index}
            className={({ isActive }) =>
              `font-nunito rounded-xl ${
                isExpanded && "px-3"
              } py-2 text-sm text-white hover:text-white/60 transition-all duration-300 ${
                isActive
                  ? "bg-blue-800/70 border-l-3 border-white/60 hover:text-white"
                  : ""
              } flex items-center ${!isExpanded && "justify-center"} gap-2`
            }
          >
            <p
              className={`${
                !isExpanded ? "text-lg" : "text-base"
              } transition-all duration-400`}
            >
              {link.icon}
            </p>
            {isExpanded && link.label}
          </NavLink>
        ))}
      </div>

      {/* sidebar footer */}
      <div className="flex flex-col gap-1"></div>
    </aside>
  );
}
