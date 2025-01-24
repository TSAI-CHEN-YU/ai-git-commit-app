document.addEventListener("DOMContentLoaded", () => {
  let selectedRepoPath = null;

  // 元素引用
  const elements = {
    selectRepoBtn: document.getElementById("selectRepoBtn"),
    repoPathDisplay: document.getElementById("repoPathDisplay"),
    apiKeyInput: document.getElementById("apiKeyInput"),
    generateBtn: document.getElementById("generateBtn"),
    commitMessage: document.getElementById("commitMessage"),
    copyBtn: document.getElementById("copyBtn"),
  };

  // 更新按鈕狀態
  function updateButtonStates() {
    const hasApiKey = elements.apiKeyInput.value.trim().length > 0;
    elements.generateBtn.disabled = !hasApiKey || !selectedRepoPath;
    elements.copyBtn.disabled = !elements.commitMessage.value;
  }

  // 選擇倉庫
  elements.selectRepoBtn.addEventListener("click", async () => {
    try {
      console.log("按鈕點擊觸發"); // 測試事件是否觸發
      selectedRepoPath = await window.electronAPI.selectRepo();
      console.log("選擇結果:", selectedRepoPath); // 查看返回值
      if (selectedRepoPath) {
        elements.repoPathDisplay.textContent = selectedRepoPath;
        updateButtonStates();
      }
    } catch (error) {
      console.error("選擇倉庫錯誤:", error); // 捕獲異常
    }
  });

  // 生成提交訊息
  elements.generateBtn.addEventListener("click", async () => {
    try {
      const diff = await window.electronAPI.getGitDiff(selectedRepoPath);
      const commitMessage = await window.electronAPI.generateCommit({
        diff: diff,
        apiKey: elements.apiKeyInput.value.trim(),
      });
      elements.commitMessage.value = commitMessage;
      updateButtonStates();
    } catch (error) {
      elements.commitMessage.value = `錯誤: ${error}`;
    }
  });

  // 複製功能
  elements.copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(elements.commitMessage.value);
  });

  // 即時監聽 API 金鑰輸入
  elements.apiKeyInput.addEventListener("input", updateButtonStates);

  // 錯誤提示
  elements.generateBtn.addEventListener("click", async () => {
    try {
      const diff = await window.electronAPI.getGitDiff(selectedRepoPath);
      const commitMessage = await window.electronAPI.generateCommit({
        diff: diff,
        apiKey: elements.apiKeyInput.value.trim(),
      });
      elements.commitMessage.value = commitMessage;
    } catch (error) {
      elements.commitMessage.value = `錯誤: ${
        error.message.includes("401") ? "API 金鑰無效" : error.message
      }`;
    }
    updateButtonStates();
  });
});
