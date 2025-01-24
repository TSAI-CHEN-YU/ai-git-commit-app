const { contextBridge, ipcRenderer } = require("electron");

console.log(window.electronAPI); // 应看到selectRepo方法

contextBridge.exposeInMainWorld("electronAPI", {
  selectRepo: () => ipcRenderer.invoke("select-repo"),
  getGitDiff: (repoPath) => ipcRenderer.invoke("get-git-diff", repoPath),
  generateCommit: (payload) => ipcRenderer.invoke("generate-commit", payload),
});
