const fs = require('fs');
import { handleFileUpload } from "./drive/gdrive.js";

interface FileDialogResult {
  filePaths: string[],
  canceled: boolean;
}
export async function run(folderPath: FileDialogResult) {
  fs.readdir(folderPath.filePaths[0], (err, files) => {
    files.forEach(file => {
      handleFileUpload(folderPath.filePaths[0], file);
    })
  });
}
