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
      label: 'Option',
      role: 'fileMenu',
    }];
    // 创建托盘实例
    const iconPath = nativeImage.createFromPath(path.join(__dirname, '../src/assets/', 'logo.png'))
    appTray = new Tray(iconPath);
    // 图标的上下文菜单
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);

    // 隐藏主窗口
    mainWindow.hide();
    // 设置托盘悬浮提示
    appTray.setToolTip('notePad');
    // 设置托盘菜单
    appTray.setContextMenu(contextMenu);
    // 单机托盘小图标显示应用
    appTray.on('click', function () {
      // 显示主程序
      mainWindow.show();
      // 关闭托盘显示
      appTray.destroy();
    });
  }

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    mainWindow.show()
    mainWindow.setAlwaysOnTop(!mainWindow.isAlwaysOnTop())
    mainWindow.focus()
    mainWindow.setAlwaysOnTop(!mainWindow.isAlwaysOnTop())
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    mainWindow.loadURL('app://./index.html')
  }
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
    setTray();
  })


  ipcMain.on('sigShowRightClickMenu', (event) => {
    // 生成右键菜单
    const menu = new Menu();
    menu.append(new MenuItem({ label: 'Hello world' }));
    menu.append(new MenuItem({ type: 'separator' }));
    menu.append(new MenuItem({
      label: 'Baidu',
      accelerator: 'B',
      click: () => {
        shell.openExternal('https://www.baidu.com')
        mainWindow.webContents.send('log-message', 'Baidu will open in your default tools');
      }
    }));
    menu.append(new MenuItem({
      label: "刷新",
      role: 'reload',
    }));

    const win = BrowserWindow.fromWebContents(event.sender);
    menu.popup(win);
  });
  //监听意外窗口化事件
  mainWindow.on('maximize', function () {
    mainWindow.webContents.send('main-window-max');
  })
  mainWindow.on('unmaximize', function () {
    mainWindow.webContents.send('main-window-unmax');
  })

  globalShortcut.register('CommandOrControl+Q', () => {
    mainWindow.webContents.openDevTools()
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
  // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
  workerProcess = exec(cmdStr, { cwd: cmdPath, windowsHide: true })
  // 不受child_process默认的缓冲区大小的使用方法，没参数也要写上{}：workerProcess = exec(cmdStr, {})

  // 打印正常的后台可执行程序输出
  workerProcess.stdout.on('data', function (data) {
    console.log(data);
  });

  // 打印错误的后台可执行程序输出
  workerProcess.stderr.on('data', function (data) {
    console.log(data);
  });

  // 退出之后的输出
  workerProcess.on('close', function (code) {
    console.log('[Server Exit] ' + code);
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    //服务清除 taskkill /f /t /im node.exe
    // runExec(`taskkill /f /t /im node.exe`, path.join(__dirname, '../server'))
    runExec(`pm2 stop appServer`, path.join(__dirname, '../server'))
    console.log(`SERVER EXIT`);
    setTimeout(() => {
      console.log("APPLICATION EXIT");
      app.quit()
    }, 1000)
  }
})

// app.on('activate', () => {
//   if (BrowserWindow.getAllWindows().length === 0) createWindow()
// })

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
