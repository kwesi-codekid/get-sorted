const { initRemix } = require("remix-electron");
const { app, BrowserWindow, dialog, Notification } = require("electron");
const path = require("node:path");

/** @type {BrowserWindow | undefined} */
let win;

/** @param {string} url */
async function createWindow(url) {
  win = new BrowserWindow({ show: false });
  await win.loadURL(url);
  win.show();

  // if (process.env.NODE_ENV === "development") {
  // 	win.webContents.openDevTools()
  // }
}

app.on("ready", () => {
  void (async () => {
    try {
      if (process.env.NODE_ENV === "development") {
        const {
          default: installExtension,
          REACT_DEVELOPER_TOOLS,
        } = require("electron-devtools-installer");

        await installExtension(REACT_DEVELOPER_TOOLS);
      }

      const url = await initRemix({
        serverBuild: path.join(__dirname, "../build/index.js"),
      });
      // showNotification();
      await createWindow(url);
    } catch (error) {
      dialog.showErrorBox("Error", getErrorStack(error));
      console.error(error);
    }
  })();
});

const NOTIFICATION_TITLE = "Basic Notification";
const NOTIFICATION_BODY = "Notification from the Main process";

// function showNotification() {
//   new Notification({
//     title: NOTIFICATION_TITLE,
//     body: NOTIFICATION_BODY,
//   }).show();
// }

// app.whenReady().then(createWindow).then(showNotification);

/** @param {unknown} error */
function getErrorStack(error) {
  return error instanceof Error ? error.stack || error.message : String(error);
}
