import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('electronAPI', {
      onFolderUpload: (callback) => ipcRenderer.on('folder-upload', (_event, value) => callback(value)),
      onMailError: (callback) => ipcRenderer.on('mail-error', (_event, value) => callback(value)),
      onMailSent: (callback) => ipcRenderer.on('mail-sent', (_event, value) => callback(value)),
      onSetUploading: (callback) => ipcRenderer.on('set-uploading', (_event, value) => callback(value)),
      onFolderAmount: (callback) => ipcRenderer.on('folder-amount', (_event, value) => callback(value)),
      onFileAmount: (callback) => ipcRenderer.on('file-amount', (_event, value) => callback(value)),
      onFileProcessed: (callback) => ipcRenderer.on('file-processed', (_event, value) => callback(value)),
      onFolderProcessed: (callback) => ipcRenderer.on('folder-processed', (_event, value) => callback(value)),
      onSettingsLoad: (callback) => ipcRenderer.on('settings-load', (_event, value) => callback(value)),
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
