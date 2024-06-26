import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // 向主进程发送消息退出应用
  quit: () => {
    ipcRenderer.send('quit')
  },
  // 向主进程发送消息坐标拖动窗口
  drag: (opt: { x: number; y: number }) => {
    ipcRenderer.invoke('drag', opt)
  },
  // 向主进程发送设置窗口大小消息
  setWindowSize: (opt: any) => {
    ipcRenderer.send('setWindowSize', opt)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
