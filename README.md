# ChatGPT Conversations Backup Chrome Extension

This Chrome extension allows you to download all your ChatGPT conversations in a JSON format.

## Installation

1. Clone this repository.
2. Navigate to the extracted folder using your terminal/command prompt.
3. Run `npm install` to install the required dependencies.
4. Run `npm run build` to build the extension files. The built files will be located in the `dist` folder.
5. Open Google Chrome and navigate to `chrome://extensions`.
6. Enable "Developer mode" using the toggle in the top-right corner.
7. Click the "Load unpacked" button and select the `dist` folder inside the folder where you extracted the extension files.
8. The extension should now be installed and visible in the extensions list.

## Usage

1. Click the extension icon in the browser toolbar.
2. Click the "Download Conversations" button to start the download process.
3. The download will start, and the conversations will be saved in a JSON file.

## Checking Progress

You can monitor the progress of the backup process by opening the browser's developer console. To do this:

1. Right-click anywhere on the page and select "Inspect" or press `Ctrl + Shift + I` (Windows/Linux) or `Cmd + Opt + I` (Mac).
2. Click on the "Console" tab in the developer tools panel.
3. You should see the progress messages like the following:

```plaintext
GPT-BACKUP::STARTING::TOTAL-OFFSETS::60
GPT-BACKUP::STARTING::REQUESTED-MESSAGES::60
GPT-BACKUP::STARTING::TOTAL-MESSAGES::120
GPT-BACKUP::PROGRESS::20%::OFFSET::20
GPT-BACKUP::PROGRESS::40%::OFFSET::40
GPT-BACKUP::PROGRESS::60%::OFFSET::60
GPT-BACKUP::DONE
```

4. The progress messages will update periodically, and you can track the download's progress in real-time.
