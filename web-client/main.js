const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const { exec } = require("child_process");
const OpenAI = require("openai").default; // 注意需要 .default
const fs = require("fs");

let mainWindow;

// 創建窗口
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // mainWindow.webContents.openDevTools();
  mainWindow.loadFile("index.html");
}

// 處理選擇 Git 倉庫
ipcMain.handle("select-repo", async () => {
  const result = await dialog.showOpenDialog({ properties: ["openDirectory"] });
  return result.filePaths[0] || null;
});

// 執行 git diff
ipcMain.handle("get-git-diff", async (_, repoPath) => {
  return new Promise((resolve, reject) => {
    exec("git diff --staged", { cwd: repoPath }, (error, stdout) => {
      if (error) reject(`Git錯誤: ${error.message}`);
      else resolve(stdout);
    });
  });
});

// 初始化 OpenAI 客戶端
function createOpenAIClient(apiKey) {
  return new OpenAI({
    baseURL: "https://api.deepseek.com/v1", // DeepSeek 專用端點
    apiKey: apiKey,
  });
}

// 調用 AI API
ipcMain.handle("generate-commit", async (_, { diff, apiKey }) => {
  const openai = createOpenAIClient(apiKey);
  // get system prompt from prompt.txt
  const systemPrompt = fs.readFileSync("prompt.txt", "utf8");

  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: diff,
        },
      ],
      temperature: 0.3,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    throw new Error(`API 錯誤: ${error.message}`);
  }
});

app.whenReady().then(createWindow);
