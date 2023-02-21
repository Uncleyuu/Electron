let close = document.getElementById('close');
let logo = document.getElementById('logo');
let section = document.getElementsByClassName('section');
let talk = document.getElementsByClassName('talk');
let name = document.getElementsByClassName('card-bg');
let idImg = document.getElementsByClassName('idImg');
let myAvatar = document.querySelector('.img');
let myName = document.querySelector('.myName');
let myId = document.querySelector('.myId');
let friendIds = document.getElementsByClassName('friendId');


window.onload=function(){
  change();
}

function change(){
  for(let i=0;i<section.length;i++){
    let r = Math.floor(Math.random()*255);
    let g = Math.floor(Math.random()*255);
    let b = Math.floor(Math.random()*255);
    let h = Math.floor(Math.random()*61)+60;
    let w = Math.floor(Math.random()*251)+260;
    section[i].style.opacity=1;
    section[i].style.height=h+"px";
    section[i].style.width=w+"px";
    section[i].style.backgroundColor="rgba("+r+","+g+","+b+",1)";
  }
}


logo.addEventListener('click',change);



let count=0;//检测聊天窗口，只能有一个
//向聊天窗口增加聊天好友
  // 开启聊天界面
clearCount();

for(let i=0;i<talk.length;i++){
  talk[i].addEventListener('click',(e)=>{
    try {
      let person={
        userImgSrc:myAvatar.getAttribute('src'),
        userName:myName.innerHTML,
        userId:myId.getAttribute('data-ID'),
        imgSrc:idImg[i].getAttribute('src'),
        name:name[i].innerHTML,
        id:friendIds[i].getAttribute('data-ID'),
        message:"123"//测试历史消息
      };
      let ipcRender = require('electron').ipcRenderer;
      if(count<1){
        ipcRender.send('createTalk',person);
        //ipcRender.send('createTalkTo',person);//如果在这里发送，会在聊天窗口出来后再加载指定好友的聊天框
      }
      else{
        ipcRender.send('createTalkTo',person);
      }
      count++;
    }
    catch (e) {
      alert("打开聊天失败")
    }
  });
}

function clearCount(){
  try{
    let ipcRender = require('electron').ipcRenderer;
    ipcRender.on('countBeZero',(e,n)=>{
      //alert(person.name);
      //alert(person.imgSrc);
      countBeZero(n);
    });
  }
  catch(e){
    alert('接受失败')
  }
}

function countBeZero(n){
  count=n;
}

//右上角小图标功能
close.addEventListener('click',(e)=>{
  try {
    let ipcRender = require('electron').ipcRenderer;
    ipcRender.send('close-home');
  }
  catch (e) {
    //console.log("不支持ipcRenderer")
    alert("关闭失败")
  }
})

let min = document.getElementById('min');

min.addEventListener('click',(e)=>{
  try{
    let ipcRender = require('electron').ipcRenderer;
    ipcRender.send('min-home');
  }
  catch(e){
    alert('最小化失败')
  }
})

//退出登录
let out = document.getElementsByClassName('out');

for(let i=0;i<out.length;i++){
  out[i].addEventListener('click',function(){
    try{
      let ipcRender = require('electron').ipcRenderer;
      ipcRender.send('out');
    }
    catch(e){
      alert('退出登录失败')
    }
  })
}