import { Button } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "../icons/theme";

export default function Header({ pageTitle }: { pageTitle: string }) {
  const { theme, setTheme } = useTheme();
  return (
    <header className="flex items-start justify-between py-2 px-5 bg-[url('assets/images/light-connecting-dots.jpg')] dark:bg-[url('assets/images/dark-connecting-dots.jpg')] bg-cover bg-center h-24">
      <h3 className="font-montserrat font-bold text-white text-2xl">
        {pageTitle}
      </h3>

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
      </div>
    </header>
  );
}
