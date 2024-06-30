import { promises as fs } from "fs";
import { handleFileUpload } from "./drive/gdrive.js";
import { main } from "./mailer";
import log from "electron-log/main";
import { BrowserWindow } from "electron";

interface FileDialogResult {
	filePaths: string[];
	canceled: boolean;
}

function getFolderName(filepath: String) {
	const parts = filepath.split(/[\\/]/);

	return parts[parts.length - 1];
}

export async function run(
	folderPathResult: FileDialogResult,
	mainWindow: BrowserWindow,
) {
	mainWindow.webContents.send("set-uploading", true);
	mainWindow.webContents.send(
		"folder-amount",
		folderPathResult.filePaths.length,
	);

	let anyFileProcessed = false;
	try {
		for (const folderPath of folderPathResult.filePaths) {
			const processed = await processFolderPath(folderPath, mainWindow);
			if (processed) {
				anyFileProcessed = true;
				mainWindow.webContents.send("folder-processed");
			}
		}
		log.info(anyFileProcessed ? "Upload complete" : "No files to upload");
		mainWindow.webContents.send("set-uploading", false);
	} catch (error) {
		log.error("Failed to process folder paths: ", error);
		mainWindow.webContents.send("set-uploading", false);
	}
}

async function processFolderPath(folderPath, mainWindow: BrowserWindow) {
	try {
		const folderName = getFolderName(folderPath);
		log.info(`Folder: ${folderName}`);

		let files = await fs.readdir(folderPath);
		files = files.filter((file) => file !== "Thumbs.db");
		log.info(`Files: ${files}`);
		// break if no Files
		if (files.length === 0) {
			return false;
		}

		mainWindow.webContents.send("file-amount", files.length);
		const uploadResult = await handleFileUpload(
			folderPath,
			files,
			folderName,
			mainWindow,
		);
		log.info(uploadResult);

		const uploadResultsMap = new Map().set(folderName, uploadResult);
		if (uploadResultsMap.get(folderName) === undefined) {
			return false;
		}
		const downloadLink = `https://drive.google.com/drive/folders/${uploadResultsMap.get(folderName)}`;

		main(downloadLink, folderName, mainWindow);
		mainWindow.webContents.send("folder-upload", getFolderName(folderName));
		return true;
	} catch (error) {
		log.error(`Error processing folder '${folderPath}': `, error);
		return false;
	}
}
