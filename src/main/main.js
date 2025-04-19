const { app, BrowserWindow } = require('electron')
const path = require('path')

// 创建主窗口函数
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: true, // 隐藏默认窗口边框
    transparent: true, // 窗口透明
    titleBarStyle: 'hidden', // 隐藏标题栏
    webPreferences: {
      preload: path.join(__dirname, '../../src/preload.js'), // 预加载脚本路径
      nodeIntegration: false, // 安全设置
      contextIsolation: true,  // 启用上下文隔离
      enablePreferredSizeMode: true, // 启用首选大小模式
    },
    minWidth: 400, //最小宽度
    minHeight: 300, //最小高度
    resizable: true, // 允许调整窗口大小
    aspectRatio: 4/3 // 窗口宽高比
  })

  // 加载本地开发服务器或本地文件
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools() // 打开开发者工具
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

// 在app.whenReady()之前添加：
const { ipcMain } = require('electron');

ipcMain.on('window-control', (event, action) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return;

  switch (action) {
    case 'minimize':
      win.minimize();
      break;
    case 'toggle-maximize':
      win.isMaximized() ? win.unmaximize() : win.maximize();
      break;
    case 'close':
      win.close();
      break;
  }
});

// 添加窗口最大化状态监听
ipcMain.on('maximize-change', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  event.sender.send('maximize-change', win.isMaximized());
});

// Electron准备就绪后创建窗口
app.whenReady().then(() => {
  createWindow()
  
  // macOS应用特性：当没有窗口时重新创建
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 关闭所有窗口时退出应用（Windows & Linux）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})