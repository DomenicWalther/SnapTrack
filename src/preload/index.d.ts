import { ElectronAPI } from '@electron-toolkit/preload'
export interface IElectronAPI {
  onFolderUpload(callback: (value: string) => void): void
  onMailSent(callback: (value: string) => void): void
  onMailError(callback: (value: string) => void): void
  onSetUploading(callback: (value: boolean) => void): void
  onFolderAmount(callback: (value: number) => void): void
  onFileAmount(callback: (value: number) => void): void
  onFileProcessed(callback: (value: string) => void): void
  onFolderProcessed(callback: (value: string) => void): void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    electronAPI: IElectronAPI
  }
}
