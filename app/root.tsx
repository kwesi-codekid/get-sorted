import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import styles from "./styles.css";
import snow from "react-quill/dist/quill.snow.css";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "react-hot-toast";

export const meta: MetaFunction = () => [
  { title: "GetSorted Helpdesk System" },
];

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  {
    rel: "stylesheet",
    href: snow,
  },
];

export default function App() {
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
        <Toaster position="bottom-right" />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
