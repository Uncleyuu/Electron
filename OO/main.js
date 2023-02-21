const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
let mainWindow;
let homeWindow;
let talkWindow;

// 在入口文件对的顶部配置热加载
// 热加载
try {
	require('electron-reloader')(module, {});
} catch (_) { }

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 650,
    height: 500,
    // frame: false,
    titleBarStyle:'hidden',
    resizable:true,
    maximizable: true,
    minimizable: true,
    icon: 'images/OO.ico',
    //transparent: true,
    webPreferences: {
      titleBarOverlay: true,
      webviewTag: true,
      nodeIntegration: true,
      contextIsolation: false,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true,
      webSecurity: false, //允许跨域
      preload: path.join(__dirname, 'script/preload_sign.js')
    }
  })

  mainWindow.loadFile('sign.html')
  // Open the DevTools.
  //mainWindow.webContents.openDevTools()
  


}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('close-sign', ()=> {
  mainWindow.close()
})

ipcMain.on('min-sign', ()=> { 
  mainWindow.minimize();
})

ipcMain.on('createHome',()=>{
  homeWindow = new BrowserWindow({
    width: 700,
    height: 900,
    //frame: false,
    titleBarStyle:'hidden',
    //parent: mainWindow,
    resizable:true,
    maximizable: true,
    minimizable: true,
    //transparent: true,//窗口透明
    webPreferences: {
      titleBarOverlay: true,
      webviewTag: true,
      nodeIntegration: true,
      contextIsolation: false,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true,
      webSecurity: false, //允许跨域
      preload: path.join(__dirname, 'script/preload_home.js')
    }
  })

  homeWindow.loadFile('home.html');
  mainWindow.hide();
  // homeWindow.webContents.openDevTools();
})

ipcMain.on('out', ()=> {
  homeWindow.close();
  mainWindow.show();
 
})

ipcMain.on('close-home', ()=> {
  mainWindow.close();
  homeWindow.close();
  app.quit();/////////////
})

ipcMain.on('min-home', ()=> {  
  homeWindow.minimize();
})

ipcMain.on('createTalk',(e,person)=>{
  talkWindow = new BrowserWindow({
    width: 1100,
    height: 660,
    //frame: false,
    titleBarStyle:'hidden',
    //parent: mainWindow,
    resizable:true,
    maximizable: true,
    minimizable: true,
    //transparent: true,//窗口透明
    webPreferences: {
      titleBarOverlay: true,
      webviewTag: true,
      nodeIntegration: true,
      contextIsolation: false,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true,
      webSecurity: false, //允许跨域
      preload: path.join(__dirname, 'script/preload_talk.js')
    }
  })

  talkWindow.webContents.send('createTalkTo',person);//发给谁就哪个window,但是在js异步加入时这好像没用，这个消息不会发送出去
  talkWindow.loadFile('talk.html');
 
  // talkWindow.webContents.openDevTools()
})

// ipcMain.on('sendSrc', (e,user)=> {
//   talkWindow.webContents.send('sendSrc',user);
// })



ipcMain.on('createTalkTo',(e,person)=>{
  talkWindow.webContents.send('createTalkTo',person);
})

ipcMain.on('close-talk', (e,count)=> {
  homeWindow.webContents.send('countBeZero',count);
  talkWindow.close();
})

ipcMain.on('min-talk', ()=> {  
  talkWindow.minimize();
})

const WebSocket = require('ws');

//const ws = new WebSocket('ws://localhost:12303');
const ws = new WebSocket('ws://81.71.153.82:12303');

ws.on('open', function open() {
  /*ws.send('Hi Server 你好服务器');*/
});//在连接创建完成后发送一条信息

ws.on('message', function incoming(data) {
  let s=data.toString();
  let message=JSON.parse(data);//json转对象
  //console.log(s);
  //talkWindow.webContents.send('receiveMessage',s);
  console.log(message);
  talkWindow.webContents.send('receiveMessage',message);
});//当收到消息时，在控制台打印出来

ipcMain.on('sendMessage',(e,ftMessage)=>{
  let s=new Array(5);
  s[0]="sendMessage";
  s[1]=ftMessage.fromImg;
  s[2]=ftMessage.fromName;
  s[3]=ftMessage.fromId;
  s[4]=ftMessage.toImg;
  s[5]=ftMessage.toName;
  s[6]=ftMessage.toId;
  s[7]=ftMessage.message;
  
  let string;
  string=s[0];
  for(let i=1;i<s.length;i++){
    string=string+","+s[i];
  }
  /*for(let i=0;i<6;i++){
    ws.send(s[i]);
  }*/
  let message={
    req:"sendMessage",
    fromImg:ftMessage.fromImg,
    fromName:ftMessage.fromName,
    fromId:ftMessage.fromId,
    toImg:ftMessage.toImg,
    toName:ftMessage.toName,
    toId:ftMessage.toId,
    message:ftMessage.message
  }
  ws.send(JSON.stringify(message));//对象转json
  //ws.send(string);
});
