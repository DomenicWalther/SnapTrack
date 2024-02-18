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
    const files = await fs.readdir(folderPath.filePaths[0]);
    const folderName = getFolderName(folderPath.filePaths[0]);
    const uploadResults = new Map();
    for (const file of files) {
      const result = await handleFileUpload(folderPath.filePaths[0], file, folderName);
      uploadResults.set(folderName, result)
    }
    console.log(uploadResults)
    let downloadLink = `https://drive.google.com/drive/folders/${uploadResults.get(folderName)}`;
    main(downloadLink);
  } catch (err) {
    console.log(err);
  }
}
