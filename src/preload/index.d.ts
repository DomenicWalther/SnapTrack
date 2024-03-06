import { ElectronAPI } from '@electron-toolkit/preload'
export interface IElectronAPI {
  onfolderProcessed(callback: (value: string) => void): void
  onMailSent(callback: (value: string) => void): void
  onMailError(callback: (value: string) => void): void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    electronAPI: IElectronAPI
  }
}
