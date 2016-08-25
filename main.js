const { BrowserWindow, app, ipcMain,Tray,shell} = require('electron')
const path = require('path')
const request = require('request')
const util =  require('./util')
const MpWindow = require('./windows/mpWindow')
const system = require('./system')
const imgDirectory = path.join(__dirname, 'img')

class MpClient{
  constructor(){
    this.mpMain = null
    this.mpWindow = null
    this.session = null
    this.appIcon = null
  }
  init(){
    this.initApp()
    this.initIPC()
    system.msg()
  }

  toggleWindow(){
  if(this.mpMain.isVisible())
    this.mpMain.hide()
  else
    this.showWindow()
  }

  showWindow(){
    this.mpMain.show()
    this.mpMain.focus()
  }

  initApp(){
    app.on('ready', () => {
      this.createMpWindow()
      this.mpMain.show()
    })

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    app.on('activate', () => {
      if (this.mpMain === null) {
        this.createMpWindow()
      }else{
        this.mpMain.show()
      }
    })
  }
  //主进程与渲染进程的通信
  initIPC(){
    ipcMain.on('check-mp-login', (event,cookies) => {
      let cookieStr = '';
      for(var i in cookies){
        cookieStr += (i+'='+cookies[i]+"; ")
      }
      let _this = this

      //请求微信首页判断是否登录
      request({
          url:'https://mp.weixin.qq.com',
          headers:{
            Cookie:cookieStr
          }
        }, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            let isLogin = util.checkMpLogin(body)

            //传给渲染进程是否登录
            event.sender.send('check-mp-login',isLogin);

            //如果公众号已经登录
            if(isLogin){
              if(_this.mpWindow&&(!_this.mpWindow.isNull)){
                _this.mpWindow.setCookies(cookies)
                _this.mpWindow.reload()
              }else{
                _this.mpWindow = new MpWindow(cookies)
                _this.mpWindow.loadURL('https://mp.weixin.qq.com');
              }
            }
          }
      })
    })
  }
  createMpWindow(){
    this.mpMain = new BrowserWindow({
      width : 360,
      height: 480,
      resizable: false,
      autoHideMenuBar: true,
      titleBarStyle: 'hidden',
      useContentSize:true,
      fullscreen:false,
      fullscreenable:false,
      webPreferences: {
        webSecurity: false
      }
    })
    this.appIcon = new Tray(path.join(imgDirectory, 'logo.png'))
    this.appIcon.on('click',() => {
      this.toggleWindow();
    });
    this.session = this.mpMain.webContents.session
    this.mpMain.loadURL(`http://nange.azber.com:9005/#!/`)
    // this.mpMain.webContents.openDevTools()
    // this.mpMain.loadURL(`file://${__dirname}/index.html`)
    this.mpMain.on('close', (e) => {
      if(this.mpMain.isVisible()){
        this.mpMain.hide()
        e.preventDefault()
      }
    })

  }
}

new MpClient().init();
