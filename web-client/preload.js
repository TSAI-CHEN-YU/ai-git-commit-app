const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  executeGitDiff: (repoPath) =>
    ipcRenderer.invoke("execute-git-diff", repoPath),
});
