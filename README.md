# AI Commit Message Generator

A Python application that generates professional git commit messages using AI with a graphical user interface.

## Features

- Analyzes git diff output using Deepseek API
- Generates conventional commit messages following best practices
- Intuitive GUI interface with repository selection
- Copy generated message to clipboard with one click
- Customizable system prompt for message generation
- Cross-platform support (Windows, macOS, Linux)

## Requirements

- Python 3.8+
- Git installed
- Deepseek API key
- Tkinter (usually included with Python)

## Installation

1. Clone this repository
2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Set your API key (choose one method):

   **Method 1: Environment Variable (Recommended)**

   ```bash
   export DEEPSEEK_API_KEY='your-api-key-here'
   ```

   **Method 2: Direct in Script (Not Recommended)**
   - Open `commit_message_generator.py`
   - Replace `YOUR_API_KEY_HERE` with your actual Deepseek API key

   To get your API key:
   1. Go to <https://platform.deepseek.com>
   2. Create an account if you don't have one
   3. Navigate to API Keys section
   4. Create a new API key

## Usage

1. Run the application:

   ```bash
   python commit_message_generator.py
   ```

2. The application window will appear:
   ![Application Screenshot](screenshot.png)

3. Use the interface:
   - Click "Browse..." to select your git repository
   - Click "Generate Commit Message" to analyze changes
   - Review the generated message in the text box
   - Click "Copy to Clipboard" to copy the message

## Example Workflow

1. Select a git repository containing changes
2. Click "Generate Commit Message"
3. Example output:

   ```text
   feat(api): add pagination support for user list endpoint
   ```

4. Click "Copy to Clipboard" to use the message in your git commit

## Customization

You can modify the following files to customize the behavior:

- `system_prompt.txt`: Modify the AI prompt for message generation
- `commit_message_generator.py`: Advanced customization of the application

## Notes

- Ensure your repository has uncommitted changes before generating messages
- The generated message follows conventional commit format
- You can modify the system prompt to adjust the output style
- The application validates that the selected directory is a git repository

## Troubleshooting

- **Error: Not a valid git repository**

  - Ensure you selected a directory containing a .git folder
  - Initialize git if necessary: `git init`

- **Error: No changes detected**

  - Make sure you have uncommitted changes in your repository
  - Use `git status` to verify changes

- **Error: API key not found**

  - Verify your API key is set correctly
  - Check environment variables or script configuration
