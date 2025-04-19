// 通过预加载脚本暴露的API获取窗口控制方法
const { ipcRenderer } = require('electron');

// 按钮事件绑定
document.getElementById('minimize-btn').addEventListener('click', () => {
  ipcRenderer.send('window-control', 'minimize');
});

document.getElementById('maximize-btn').addEventListener('click', () => {
  ipcRenderer.send('window-control', 'toggle-maximize');
});

document.getElementById('close-btn').addEventListener('click', () => {
  ipcRenderer.send('window-control', 'close');
});

// 窗口最大化状态更新
ipcRenderer.on('maximize-change', (_, isMaximized) => {
  const btn = document.getElementById('maximize-btn');
  if (isMaximized) {
    btn.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
  } else {
    btn.style.removeProperty('background-color');
  }
});