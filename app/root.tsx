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
import styles from "./styles.css";
import { NextUIProvider, Progress } from "@nextui-org/react";

export const meta: MetaFunction = () => [{ title: "New Remix App" }];

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function App() {
  const navigation = useNavigation();
  console.log(navigation.state);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <NextUIProvider>
          <div className="h-1 bg-transparent">
            {navigation.state === "loading" && (
              <Progress isIndeterminate color="primary" size="sm" radius="sm" />
            )}
          </div>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </NextUIProvider>
      </body>
    </html>
  );
}
