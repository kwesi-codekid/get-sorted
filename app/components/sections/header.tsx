import ProfileDropdown from "./profile-dropdown";
import NotificationDropdown from "./notification-dropdown";
import ThemeSwitcher from "./theme-switcher";
import { Input } from "@nextui-org/react";
import { useLocation, useNavigate } from "@remix-run/react";

export default function Header({
  navLinks,
  basePath,
}: {
  navLinks: { label: string; path: string }[];
  basePath: string;
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Trim leading slash for comparison
  const trimmedPathname = pathname.startsWith(basePath as string)
    ? pathname.slice(1)
    : pathname;

  // Find the active link
  const activeLink = navLinks.find((link) => {
    const trimmedLinkPath = link.path.startsWith(basePath as string)
      ? link.path.slice(1)
      : link.path;
    return (
      (link.path === (basePath as string) &&
        pathname === (basePath as string)) ||
      (link.path !== (basePath as string) &&
        trimmedPathname.startsWith(trimmedLinkPath))
    );
  });

  return (
    <header className="flex items-start justify-between py-2 px-5 bg-[url('assets/images/light-connecting-dots.jpg')] dark:bg-[url('assets/images/dark-connecting-dots.jpg')] bg-cover bg-center h-24">
      {/* page title */}
      <h3 className="font-montserrat font-bold text-white text-2xl">
        {activeLink?.label}
      </h3>

      {/* search bar */}
      {pathname.substring(6) && (
        <Input
          classNames={{
            base: "max-w-xs font-nunito text-sm h-12",
            inputWrapper:
              "bg-opacity-60 dark:bg-slate-800 dark:border border-white/10",
          }}
          variant="flat"
          size="sm"
          radius="md"
          placeholder="Search here..."
          onValueChange={(text: string) => {
            setTimeout(() => {
              navigate(`?search_term=${text}`);
            }, 1500);
          }}
        />
      )}

      {/* right-side stuff */}
      <div className="flex items-center gap-0">
        {/* themeswitcher */}
        <ThemeSwitcher />

        {/* notification dropdown */}
        <NotificationDropdown />

        {/* profile dropdown */}
        <ProfileDropdown />
      </div>
    </header>
  );
}
