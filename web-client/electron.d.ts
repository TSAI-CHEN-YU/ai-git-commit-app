interface ElectronAPI {
  selectRepo: () => Promise<string>;
  getGitDiff: (repoPath: string) => Promise<string>;
  generateCommit: (payload: {
    diff: string;
    apiKey: string;
  }) => Promise<string>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
