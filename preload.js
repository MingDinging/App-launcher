const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  windowControl: {
    // 暴露给渲染进程的窗口控制方法
    onMaximizeChange: (callback) => ipcRenderer.on('maximize-change', callback)
  }
});