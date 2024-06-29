import { Button } from "@nextui-org/react";
import { Notification } from "electron";
import React from "react";

export default function notification() {
  return (
    <div>
      <Button
        onClick={() => {
          new Notification({
            title: "Notification Title",
            body: "Notification Body",
          }).show();
        }}
      >
        Show Notification
      </Button>
    </div>
  );
}

export async function action() {
  new Notification({
    title: NOTIFICATION_TITLE,
    body: NOTIFICATION_BODY,
  }).show();

  return {};
}
