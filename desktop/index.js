const { initRemix } = require("remix-electron");
const {
  app,
  BrowserWindow,
  dialog,
  session,
  Notification,
} = require("electron");
const path = require("node:path");

const os = require("os");
const si = require("systeminformation");
const axios = require("axios");

// const disk = require('diskusage');

async function getMacAddress() {
  try {
    const networkInterfaces = await si.networkInterfaces();
    for (const iface of networkInterfaces) {
      if (
        iface.type == "wired" &&
        iface.mac != "00:00:00:00:00:00" &&
        iface.mac != "ff:ff:ff:ff:ff:ff"
      ) {
        return iface.mac;
      }
    }
  } catch (error) {
    console.error("Error getting MAC address:", error);
  }
}
// TODO: Move code to electron.server.tsx file and
// call it within the loader of all dashboard,
// pass userId to this functtion and save it in the database
// after that, userId will be used to get the system details
async function getSystemDetails() {
  try {
    // OS Information
    const osInfo = {
      platform: os.platform(),
      release: os.release(),
      type: os.type(),
      arch: os.arch(),
      hostname: os.hostname(),
      // uptime: os.uptime(),
    };

    // CPU Information
    const cpuInfo = await si.cpu();

    // Memory (RAM) Information
    const memInfo = {
      total: os.totalmem(),
      free: os.freemem(),
    };

    // Disk Information
    // const rootDisk = os.platform() === 'win32' ? 'c:' : '/';
    // const diskInfo = await disk.check(rootDisk);

    // System Information (Processes, etc.)
    const systemInfo = await si.processes();

    // Software Information
    const softwareInfo = await si.versions(); // Includes Node.js, npm, etc.

    // Installed Applications (Package Managers)
    // const installedApps = await si.programs();

    // Combine All Information
    const allDetails = {
      osInfo,
      cpuInfo,
      memInfo,
      userInfo: os.userInfo(),
      // diskInfo,
      systemInfo,
      softwareInfo,
      // installedApps
    };

    await axios
      .post(
        "https://get-sorted.printmoney.money/api/sys-info/add-system-info",
        {
          cpuInfo: JSON.stringify(cpuInfo),
          softwareInfo: JSON.stringify(softwareInfo),
          memInfo: JSON.stringify(memInfo),
          userInfo: JSON.stringify(os.userInfo()),
          macAddress: await getMacAddress(),
          ...osInfo,
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    console.error("Error getting system details:", error);
  }
}

/** @type {BrowserWindow | undefined} */
let win;

/** @param {string} url */
async function createWindow(url) {
  win = new BrowserWindow({
    show: false,
    center: true,
    width: 1280,
    height: 768,
    autoHideMenuBar: true,
    webPreferences: {
      webSecurity: false,
    },
  });
  await win.loadURL(url);
  win.show();

  if (process.env.NODE_ENV === "development") {
    win.webContents.openDevTools();
  }
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

      session.defaultSession.webRequest.onHeadersReceived(
        (details, callback) => {
          details.responseHeaders["Access-Control-Allow-Origin"] = "*";
          callback({ responseHeaders: details.responseHeaders });
        }
      );
      await getSystemDetails();
      // await getMacAddress();

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

/** @param {unknown} error */
function getErrorStack(error) {
  return error instanceof Error ? error.stack || error.message : String(error);
}
