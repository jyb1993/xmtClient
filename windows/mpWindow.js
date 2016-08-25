const {app, shell, BrowserWindow} = require('electron')
const util = require('../util')


class MpWindow {
  constructor(cookies) {
    this.mpWindow = null
    this.session  = null
    this.isNull   = false
    this.id       = cookies['slave_user']
    this.createWindow()
    this.setCookies(cookies)
  }

  createWindow() {
    this.mpWindow = new BrowserWindow({
      title: "微信公众平台客户端",
      center: true,
      show: true,
      width : 1260,
      height: 660,
      frame: true,
      autoHideMenuBar: true
      // webPreferences: {
      //   javascript: true,
      //   plugins: true,
      //   nodeIntegration: false,
      //   webSecurity: false
      // }
    })
    this.initEvent()
    this.session = this.mpWindow.webContents.session
  }

  initEvent(){
    this.mpWindow.webContents.on('new-window', (event, url) => {
      if((/t=media\/appmsg_edit/).test(url)){
        return 
      }
      event.preventDefault()
      shell.openExternal(util.handleRedirectMessage(url))
    })

    this.mpWindow.on('close', () => {
      this.isNull = true
    })
  }

  loadURL(url) {
    this.mpWindow.loadURL(url)
  }

  setCookies(cookies){
    for(let i in cookies){
      this.session.cookies.set({
        url : "https://mp.weixin.qq.com",
        name : i,
        value: cookies[i]
      },(error) => {
        // 添加cookie的回调
      });
    }
  }

  reload(){
    this.mpWindow.loadURL('https://mp.weixin.qq.com')
    this.show()
  }

  show() {
    this.mpWindow.show()
  }

  hide(){
    this.mpWindow.hide()
  }

}

module.exports = MpWindow
