let goSignInBtn = document.getElementById("goSignin");
let goSignUpBtn = document.getElementById("goSignup");
let fistForm = document.getElementById("form_signup");
let secondForm = document.getElementById("form_signin");
let container = document.querySelector(".container");
let signIn = document.getElementById("signIn");
let signUp = document.getElementById("signUp");

let inUserId = document.getElementById('inUserId');
let inPassWord = document.getElementById('inPassWord');
let upUserName = document.getElementById('upUserName');
let upEmail = document.getElementById('upEmail');
let upPassWord = document.getElementById('upPassWord');

let inUserIdWarn = document.getElementById('inUserIdWarn');
let inPassWordWarn = document.getElementById('inPassWordWarn');
let upUserNameWarn = document.getElementById('upUserNameWarn');
let upEmailWarn = document.getElementById('upEmailWarn');
let upPassWordWarn = document.getElementById('upPassWordWarn'); 

let overlay = document.querySelector('.overlay');
let logo = document.querySelector('#logo');
let x,y=-1;
let color;

//界面
goSignInBtn.addEventListener("click", () => {
	container.classList.remove("right-panel-active");
});

goSignUpBtn.addEventListener("click", () => {
	container.classList.add("right-panel-active");
});

fistForm.addEventListener("submit", (e) => e.preventDefault());
secondForm.addEventListener("submit", (e) => e.preventDefault());

window.onload=function(){
  changeImg();
}

//logo点击
logo.addEventListener('click',changeImg)

//切换图片
function changeImg(){
  let r = Math.floor(Math.random()*255);
  let g = Math.floor(Math.random()*255);
  let b = Math.floor(Math.random()*255);
  color="rgba("+r+","+g+","+b+",1)";

  // signIn.style.borderColor="rgba("+r+","+g+","+b+",1)";
  // signUp.style.borderColor="rgba("+r+","+g+","+b+",1)";

  x=Math.floor(Math.random()*16)+1;

  if(y!=x){
    switch(x){
      case 1:
        overlay.style.backgroundImage="url(images/sea.png)";
        // signIn.style.background="linear-gradient(90deg, rgba(20,24,65,1) 1%, rgba(65,32,185,1) 33%, rgba(253,29,29,1) 67%, rgba(252,176,69,1) 100%)";
        // signUp.style.background="linear-gradient(90deg, rgba(20,24,65,1) 1%, rgba(65,32,185,1) 33%, rgba(253,29,29,1) 67%, rgba(252,176,69,1) 100%)";
        y=x;
        break;
      case 2:
        overlay.style.backgroundImage="url(images/colorful.png)";
        y=x;
        break;
      case 3:
        overlay.style.backgroundImage="url(images/forest.png)";
        y=x;
        break;
      case 4:
        overlay.style.backgroundImage="url(images/daqizhishang.png)";
        y=x;
        break;
      case 5:
        overlay.style.backgroundImage="url(images/flightPlane.png)";
        y=x;
        break;
      case 6:
        overlay.style.backgroundImage="url(images/green.png)";
        y=x;
        break;
      case 7:
        overlay.style.backgroundImage="url(images/hamburger.png)";
        y=x;
        break;
      case 8:
        overlay.style.backgroundImage="url(images/laosepi.png)";
        y=x;
        break;
      case 9:
        overlay.style.backgroundImage="url(images/laosepiBeach.png)";
        y=x;
        break;
      case 10:
        overlay.style.backgroundImage="url(images/sakura.png)";
        y=x;
        break;
      case 11:
        overlay.style.backgroundImage="url(images/shenkong.png)";
        y=x;
        break;
      case 12:
        overlay.style.backgroundImage="url(images/threeLevel.png)";
        y=x;
        break;
      case 13:
        overlay.style.backgroundImage="url(images/windmill.png)";
        y=x;
        break;
      case 14:
        overlay.style.backgroundImage="url(images/kuailetaocan.png)";
        y=x;
        break;
      case 15:
        overlay.style.backgroundImage="url(images/moon.png)";
        y=x;
        break;
      case 16:
        overlay.style.backgroundImage="url(images/technology.png)";
        y=x;
        break;
    }
  }
}


let boolIn,boolUp;
//判断输入
function signInFormat(id,password){
  boolIn=true;
  let idFormat = /[0-9]{5}/;
  
  if(!idFormat.test(id)||id.length>5){
    boolIn=false;
    inUserIdWarn.innerHTML='账号输入错误';
  }
  if(password!=='10001'){
    inPassWordWarn.innerHTML='密码错误或者与账号不匹配';
    boolIn=false;
  }
  if(password===''){
    inPassWordWarn.innerHTML='密码不能为空';
    boolIn=false;
  }
}

function signUpFormat(name,email,password){
  boolUp=true;

  if(name===''){
    upUserNameWarn.innerHTML='名字不能为空';
    boolUp=false;
  }
  if(password===''){
    upPassWordWarn.innerHTML='密码不能为空';
    boolUp=false;
  }
  let x=email.indexOf("@");
  let y=email.lastIndexOf(".");
  if (x<1 || y<x+2 || y+2>=email.length){
    upEmailWarn.innerHTML='不是一个有效的e-mail地址';
    boolUp=false;
  }
}


inUserId.onfocus=function(){
  inUserIdWarn.innerHTML='';
}
inPassWord.onfocus=function(){
  inPassWordWarn.innerHTML='';
}
upUserName.onfocus=function(){
  upUserNameWarn.innerHTML='';
}
upEmail.onfocus=function(){
  upEmailWarn.innerHTML='';
}
upPassWord.onfocus=function(){
  upPassWordWarn.innerHTML='';
}


//按钮事件
signIn.addEventListener('click',()=>{
  signInFormat(inUserId.value,inPassWord.value);
  inUserId.value='';
  inPassWord.value='';
  if(boolIn){
    try {
      const ipcRender = require('electron').ipcRenderer;
      ipcRender.send('createHome');
    }
    catch (e) {
      //console.log("不支持ipcRenderer")
      alert("登录失败")
    }
  }
})

signUp.addEventListener('click',()=>{
  signUpFormat(upUserName.value,upEmail.value,upPassWord.value);
  upUserName.value='';
  upEmail.value='';
  upPassWord.value='';
  if(boolUp){
    try {
      const ipcRender = require('electron').ipcRenderer;
      ipcRender.send('createHome');
    }
    catch (e) {
      //console.log("不支持ipcRenderer")
      alert("注册失败")
    }
  }
})

//右上角小图标事件
let close = document.getElementById('close');

close.addEventListener('click',(e)=>{
  try {
    const ipcRender = require('electron').ipcRenderer;
    ipcRender.send('close-sign');
  }
  catch (e) {
    //console.log("不支持ipcRenderer")
    alert("关闭失败")
  }
})

let min = document.getElementById('min');

min.addEventListener('click',(e)=>{
  try{
    const ipcRender = require('electron').ipcRenderer;
    ipcRender.send('min-sign');
  }
  catch(e){
    alert('最小化失败')
  }
})