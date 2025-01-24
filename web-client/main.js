const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { exec } = require("child_process");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"), // 預加載腳本
    },
  });

  mainWindow.loadFile("index.html");
}

// 監聽渲染進程的請求
ipcMain.handle("execute-git-diff", async (event, repoPath) => {
  return new Promise((resolve, reject) => {
    exec("git diff", { cwd: repoPath }, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
      } else {
        resolve(stdout);
      }
    });
  });
});

app.whenReady().then(createWindow);
