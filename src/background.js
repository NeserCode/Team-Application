'use strict'

const path = require('path')
const exec = require('child_process').exec
let ipcMain = require('electron').ipcMain
import { app, protocol, BrowserWindow, Menu, shell, MenuItem, Tray, nativeImage, globalShortcut, ipcRenderer, nativeTheme } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'

//进程实例
let workerProcess = null
//托盘实例
let appTray = null

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

protocol.registerSchemesAsPrivileged([
  { scheme: 'setting', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 850,
    minWidth: 800,
    minHeight: 600,
    // alwaysOnTop: true,
    frame: false,
    center: true,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false,
    }
  })

  function setTray() {
    // 当托盘最小化时，右击有一个菜单显示，这里进设置一个退出的菜单
    let trayMenuTemplate = [{ // 系统托盘图标目录
      label: 'Exit',
      click: () => {
        mainWindow.close()
      },
    }];
    // 创建托盘实例
    const iconPath = nativeImage.createFromPath(path.join(__dirname, '../src/assets/', 'logo.png'))
    appTray = new Tray(iconPath);
    // 图标的上下文菜单
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);

    // 设置托盘悬浮提示
    appTray.setToolTip('Team');
    // 设置托盘菜单
    appTray.setContextMenu(contextMenu);
    // 单机托盘小图标显示应用
    appTray.on('click', function () {
      // 显示主程序
      mainWindow.show();
    });
  }

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    mainWindow.show()
    mainWindow.setAlwaysOnTop(!mainWindow.isAlwaysOnTop())
    mainWindow.focus()
    mainWindow.setAlwaysOnTop(!mainWindow.isAlwaysOnTop())
    setTray();
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    mainWindow.loadURL('app://./index.html')
    setTray();
  }
  ipcMain.on('open-link-extra', () => {
    shell.openExternal(url);
  })
  //接收关闭命令
  ipcMain.on('window-close', function () {
    mainWindow.close()
  })
  //接收最小化命令
  ipcMain.on('window-min', function () {
    mainWindow.minimize();
  })
  //接收最大化命令
  ipcMain.on('window-max', function () {
    if (mainWindow.isMaximized()) {
      mainWindow.restore();
    } else {
      mainWindow.maximize();
    }
  })
  // 主进程监听打开托盘事件
  ipcMain.on('hide-in-bar', () => {
    mainWindow.hide()
  })

  //监听意外窗口化事件
  mainWindow.on('maximize', function () {
    mainWindow.webContents.send('main-window-max');
  })
  mainWindow.on('unmaximize', function () {
    mainWindow.webContents.send('main-window-unmax');
  })
  mainWindow.on('close', () => {
    mainWindow.webContents.send('before-main-window-destory')
  })

  globalShortcut.register('CommandOrControl+Q', () => {
    mainWindow.webContents.openDevTools()
  })
  globalShortcut.register('CommandOrControl+M', () => {
    mainWindow.webContents.reload();
  })

  ipcMain.on('setting-always-on-top', () => {
    mainWindow.setAlwaysOnTop(true)
  })
  ipcMain.on('setting-always-not-top', () => {
    mainWindow.setAlwaysOnTop(false)
  })

  //处理颜色模式的变化
  ipcMain.on('color-schemeMode-light', () => {
    nativeTheme.themeSource = 'light'
  })
  ipcMain.on('color-schemeMode-dark', () => {
    nativeTheme.themeSource = 'dark'
  })
  ipcMain.on('color-schemeMode-system', () => {
    nativeTheme.themeSource = 'system'
  })
}

function runExec(cmdStr, cmdPath) {
  workerProcess = exec(cmdStr, { cwd: cmdPath })

  workerProcess.stdout.on('data', function (data) {
    console.log(data);
  });

  workerProcess.stderr.on('data', function (data) {
    console.log(data);
  });

  workerProcess.on('close', function (code) {
    console.log('[Server Exit] ' + code);
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    runExec(`pm2 stop appServer`, path.join(__dirname, '../server'))
    console.log(`SERVER EXIT`);
    setTimeout(() => {
      console.log("APPLICATION EXIT");
      app.quit()
    }, 1000)
  }
})

app.on('ready', function () {
  runExec('pm2 start teamServer.js --name appServer', path.join(__dirname, '../server'));
  createWindow()
})

// app.whenReady().then(() => {
//   runExec('node index.js', path.join(__dirname, '../server'));
//   console.log(workerProcess);
//   workerProcess.kill();
// }).then(createWindow)

// const isDevelopment = process.env.NODE_ENV !== 'production'
// const isDevelopment = process.env.NODE_ENV !== 'production'
// if (isDevelopment) {
//   if (process.platform === 'win32') {
//     process.on('message', (data) => {
//       if (data === 'graceful-exit') {
//         app.quit()
//       }
//     })
//   } else {
//     process.on('SIGTERM', () => {
//       app.quit()
//     })
//   }
// }