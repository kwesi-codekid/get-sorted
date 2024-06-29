import { Button } from "@nextui-org/react";
import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { callNotification } from "~/controllers/noti";

export default function Test() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <main>
      <h1 className="font-black text-7xl text-violet-700">Hi, {user}</h1>
      <Link to={"/"}>Home</Link>
      <Button
        onClick={() => {
          const NOTIFICATION_TITLE = "Basic Notification";
          const NOTIFICATION_BODY = "Notification from the Main process";

          new window.Notification(NOTIFICATION_TITLE, {
            body: NOTIFICATION_BODY,
          });
        }}
      >
        Notify
      </Button>
    </main>
  );
}

export const loader: LoaderFunction = async () => {
  return {
    user: "Kwasi",
  };
};
