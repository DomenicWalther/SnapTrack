import { promises as fs } from 'fs';
import { handleFileUpload } from "./drive/gdrive.js";
import { main } from "./mailer"
interface FileDialogResult {
  filePaths: string[],
  canceled: boolean;
}

function getFolderName(filepath: String) {
  const parts = filepath.split("/");

  return parts[parts.length - 1];
}



export async function run(folderPath: FileDialogResult) {
  try {
    for (const path of folderPath.filePaths) {
      const uploadResults = new Map();
      const files = await fs.readdir(path);
      const folderName = getFolderName(path);
      const result = await handleFileUpload(path, files, folderName);
      uploadResults.set(folderName, result)
      let downloadLink = `https://drive.google.com/drive/folders/${uploadResults.get(folderName)}`;
      console.log("Folder: " + folderName);
      main(downloadLink, folderName);
    }
    console.log("Upload complete")
  } catch (err) {
    console.log(err);
  }
}
