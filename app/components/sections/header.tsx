import { Button } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "../icons/theme";

export default function Header({ pageTitle }: { pageTitle: string }) {
  const { theme, setTheme } = useTheme();
  return (
    <header className="flex items-center justify-between py-2 px-5">
      <h3 className="font-montserrat font-bold">{pageTitle}</h3>

      {/* right-side stuff */}
      <div className="flex items-center gap-4">
        {/* themeswitcher */}
        {theme === "dark" ? (
          <Button
            isIconOnly
            variant="light"
            radius="full"
            size="sm"
            onClick={() => setTheme("light")}
          >
            <SunIcon />
          </Button>
        ) : (
          <Button
            isIconOnly
            variant="light"
            radius="full"
            size="sm"
            onClick={() => setTheme("dark")}
          >
            <MoonIcon />
          </Button>
        )}
      </div>
    </header>
  );
}
