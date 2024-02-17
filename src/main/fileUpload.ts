const fs = require('fs');
import { handleFileUpload } from "./drive/gdrive.js";

interface FileDialogResult {
  filePaths: string[],
  canceled: boolean;
}

function getFolderName(filepath) {
  const parts = filepath.split("/");

  return parts[parts.length - 1];
}


export async function run(folderPath: FileDialogResult): Promise<void> {
  fs.readdir(folderPath.filePaths[0], (err, files) => {
    const folderName = getFolderName(folderPath.filePaths[0])
    files.forEach((file) => {
      handleFileUpload(folderPath.filePaths[0], file, folderName);
    })
  });
}
