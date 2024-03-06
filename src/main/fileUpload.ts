import { promises as fs } from 'fs';
import { handleFileUpload } from "./drive/gdrive.js";
import { main } from "./mailer"
import log from 'electron-log/main';
import { BrowserWindow } from 'electron';

interface FileDialogResult {
  filePaths: string[],
  canceled: boolean;
}

function getFolderName(filepath: String) {
  const parts = filepath.split(/[\\/]/);

  return parts[parts.length - 1];
}




export async function run(folderPathResult: FileDialogResult, mainWindow: BrowserWindow) {
  try {
    for (const folderPath of folderPathResult.filePaths) {
      console.log("Path: ", folderPath);
      await processFolderPath(folderPath, mainWindow);
    }
    log.info("Upload complete");
  } catch (error) {
    log.error("Failed to process folder paths: ", error);
  }
}

async function processFolderPath(folderPath, mainWindow: BrowserWindow) {
  try {
    const folderName = getFolderName(folderPath);
    log.info(`Folder: ${folderName}`);

    const files = await fs.readdir(folderPath);
    log.info(`Files: ${files}`);

    const uploadResult = await handleFileUpload(folderPath, files, folderName);
    log.info(uploadResult);

    const uploadResultsMap = new Map().set(folderName, uploadResult);
    const downloadLink = `https://drive.google.com/drive/folders/${uploadResultsMap.get(folderName)}`;

    main(downloadLink, folderName);
    mainWindow.webContents.send('folder-processed', getFolderName(folderName));
  } catch (error) {
    log.error(`Error processing folder '${folderPath}': `, error);
  }
}

