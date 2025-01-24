import os
import subprocess
from pathlib import Path
from openai import OpenAI
import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import pyperclip

# Configuration
API_KEY = "<DeepSeek API Key>"

client = OpenAI(api_key=API_KEY, base_url="https://api.deepseek.com")

def get_git_diff(repo_path):
    """Get git diff output for the repository"""
    try:
        result = subprocess.run(
            ["git", "--no-pager", "diff"],
            cwd=repo_path,
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Error getting git diff: {e.stderr}")
        return None

def generate_commit_message(diff_output):
    """Generate commit message using AI API"""
    # Read system prompt from file
    with open("system_prompt.txt", "r") as f:
        system_prompt = f.read()
    
    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": diff_output}
            ],
            stream=False
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error generating commit message: {str(e)}")
        return None

class CommitMessageGeneratorApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Git Commit Message Generator")
        self.root.geometry("750x550")
        self.root.configure(bg="#f0f0f0")
        
        # Configure styles
        style = ttk.Style()
        style.configure("TFrame", background="#f0f0f0")
        style.configure("TLabel", background="#f0f0f0", font=("Helvetica", 16))
        style.configure("TButton", font=("Helvetica", 12), padding=10, width=20)
        style.configure("TEntry", font=("Helvetica", 16), padding=5)
        
        # Main container
        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Repository selection
        repo_frame = ttk.Frame(main_frame)
        repo_frame.pack(fill=tk.X, pady=(0, 15))
        
        ttk.Label(repo_frame, text="Git Repository:").pack(side=tk.LEFT)
        
        self.repo_entry = ttk.Entry(repo_frame, width=50)
        self.repo_entry.pack(side=tk.LEFT, padx=10, expand=True, fill=tk.X)
        
        self.browse_button = ttk.Button(
            repo_frame,
            text="Browse...",
            command=self.select_repository,
            style="Accent.TButton"
        )
        self.browse_button.pack(side=tk.LEFT)
        
        # Generate button
        self.generate_button = ttk.Button(
            main_frame,
            text="Generate Commit Message",
            command=self.generate_message,
            state=tk.DISABLED,
            style="Accent.TButton"
        )
        self.generate_button.pack(pady=10)
        
        # Commit message display
        message_frame = ttk.Frame(main_frame)
        message_frame.pack(fill=tk.BOTH, expand=True)
        
        ttk.Label(message_frame, text="Commit Message:").pack(anchor=tk.W)
        
        self.message_text = tk.Text(
            message_frame,
            wrap=tk.WORD,
            font=("Helvetica", 10),
            padx=10,
            pady=10,
            highlightthickness=1,
            highlightbackground="#ccc"
        )
        self.message_text.pack(fill=tk.BOTH, expand=True)
        
        # Copy button
        self.copy_button = ttk.Button(
            main_frame,
            text="Copy to Clipboard",
            command=self.copy_to_clipboard,
            state=tk.DISABLED,
            style="Accent.TButton"
        )
        self.copy_button.pack(pady=10)
        
        # Configure accent color
        style.configure("Accent.TButton", background="#4caf50", foreground="white")
        
    def select_repository(self):
        """Open directory dialog to select git repository"""
        repo_path = filedialog.askdirectory()
        if repo_path:
            self.repo_entry.delete(0, tk.END)
            self.repo_entry.insert(0, repo_path)
            self.generate_button.config(state=tk.NORMAL)
    
    def generate_message(self):
        """Generate commit message for selected repository"""
        repo_path = self.repo_entry.get()
        
        if not os.path.isdir(repo_path):
            messagebox.showerror("Error", "Invalid directory path")
            return
            
        if not os.path.isdir(os.path.join(repo_path, ".git")):
            messagebox.showerror("Error", "Not a valid git repository")
            return
            
        diff_output = get_git_diff(repo_path)
        if diff_output:
            commit_message = generate_commit_message(diff_output)
            if commit_message:
                self.message_text.delete(1.0, tk.END)
                self.message_text.insert(tk.END, commit_message)
                self.copy_button.config(state=tk.NORMAL)
                return
                
        messagebox.showinfo("Info", "No changes detected or failed to generate commit message")
    
    def copy_to_clipboard(self):
        """Copy commit message to clipboard"""
        message = self.message_text.get(1.0, tk.END).strip()
        if message:
            pyperclip.copy(message)
            messagebox.showinfo("Success", "Commit message copied to clipboard")

if __name__ == "__main__":
    root = tk.Tk()
    app = CommitMessageGeneratorApp(root)
    root.mainloop()
