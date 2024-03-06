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
      onfolderProcessed: (callback) => ipcRenderer.on('folder-processed', (_event, value) => callback(value)),
      onMailError: (callback) => ipcRenderer.on('mail-error', (_event, value) => callback(value)),
      onMailSent: (callback) => ipcRenderer.on('mail-sent', (_event, value) => callback(value))
    })
    contextBridge.exposeInMainWorld('electronAPI', {
    })
    contextBridge.exposeInMainWorld('electronAPI', {
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
