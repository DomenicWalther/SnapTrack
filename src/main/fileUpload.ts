import { promises as fs } from 'fs';
import { handleFileUpload } from "./drive/gdrive.js";

interface FileDialogResult {
  filePaths: string[],
  canceled: boolean;
}

function getFolderName(filepath) {
  const parts = filepath.split("/");

  return parts[parts.length - 1];
}




export async function run(folderPath) {
  try {
    const files = await fs.readdir(folderPath.filePaths[0]);
    const folderName = getFolderName(folderPath.filePaths[0]);
    const uploadResults = new Map();
    console.log("Files: ", files);
    for (const file of files) {
      const result = await handleFileUpload(folderPath.filePaths[0], file, folderName);
      uploadResults.set(folderName, result)
    }

    console.log("Upload completed successfully");
    console.log("Result:", uploadResults);
  } catch (err) {
    console.log(err);
  }
}
