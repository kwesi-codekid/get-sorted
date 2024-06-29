// import { Notification } from "electron";

export const callNotification = async () => {
  const NOTIFICATION_TITLE = "Basic Notification";
  const NOTIFICATION_BODY = "Notification from the Main process";

  new window.Notification(NOTIFICATION_TITLE, {
    body: NOTIFICATION_BODY,
  });
};
