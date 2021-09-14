'use strict'

import {app, BrowserWindow, ipcMain, Menu} from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let indexWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    id: 1,
    width: 680,
    height: 480,
    useContentSize: true,
    // 无边框
    frame: false,
    // 不允许调整窗口大小
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.hookWindowMessage(278, e => {
    // 窗口禁用
    mainWindow.setEnabled(false)
    setTimeout(() => {
      mainWindow.setEnabled(true)
    }, 50)
    return true
  })

  mainWindow.on('closed', () => {
    mainWindow = null
    console.log('mainWindow has closed')
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('openLogin', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('closeLogin', () => {
  if (mainWindow) {
    mainWindow.close()
  } else {
    console.log('mainWindow close fail')
  }
})

ipcMain.on('toAppIndex', () => {
  indexWindow = new BrowserWindow({
    id: 2,
    width: 680,
    height: 480,
    title: 'PRODUCT NAME',
    webPreferences: {
      nodeIntegration: true
    }
  })
  indexWindow.maximize()
  Menu.setApplicationMenu(Menu.buildFromTemplate(appMenus()))
  // 隐藏electron创建的菜单栏
  Menu.setApplicationMenu(null)
  indexWindow.loadURL(winURL + '#/main')

  indexWindow.on('closed', () => {
    // localStorage.removeItem('userData')
    indexWindow = null
    console.log('indexWindow has closed')
  })

  // indexWindow.on('close', (e) => {
  //   console.log('indexWindow has close')
  //   e.preventDefault()
  //   dialog.showMessageBox({
  //     type: 'warning',
  //     title: '关闭窗口',
  //     message: '你确定关闭该窗口吗？',
  //     buttons: ['取消', '确定']
  //   }, (idx) => {
  //     console.log('进来了')
  //     if (idx === 0) {
  //       indexWindow = null
  //       app.exit()
  //       console.log('indexWindow has closed----')
  //     } else {
  //       e.preventDefault()
  //     }
  //   })
  // })
})

ipcMain.on('reLogin', () => {
  if (indexWindow) {
    indexWindow.close()
    createWindow()
  } else {
    console.log('indexWindow close fail')
  }
})

function appMenus () {
  const template = [
    {
      id: 21,
      label: '开发',
      submenu: [
        {role: 'reload'},
        {role: 'forceReload'}
      ]
    }
  ]
  return template
}
