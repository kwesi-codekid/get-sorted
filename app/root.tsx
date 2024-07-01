import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from "@remix-run/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import styles from "./styles.css";
import { NextUIProvider } from "@nextui-org/react";

export const meta: MetaFunction = () => [
  { title: "GetSorted Helpdesk System" },
];

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function App() {
  // const navigation = useNavigation();
  // console.log(navigation.state);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="">
        <NextUIProvider>
          <NextThemesProvider attribute="class" defaultTheme="light">
            <Outlet />
          </NextThemesProvider>
        </NextUIProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
