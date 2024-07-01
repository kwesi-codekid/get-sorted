import { Button } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "../icons/theme";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      {theme === "dark" ? (
        <Button
          isIconOnly
          variant="light"
          radius="full"
          size="sm"
          onClick={() => setTheme("light")}
        >
          <SunIcon className="text-white size-5" />
        </Button>
      ) : (
        <Button
          isIconOnly
          variant="light"
          radius="full"
          size="sm"
          onClick={() => setTheme("dark")}
        >
          <MoonIcon className="text-white size-5" />
        </Button>
      )}
    </>
  );
}
