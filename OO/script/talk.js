let say = document.querySelectorAll('.say');
let look = document.querySelectorAll('.look');
let write = document.querySelectorAll('.write');
let go = document.getElementsByClassName('go');
let avatar_r = document.querySelectorAll('.avatar-r');
let bubble_r = document.getElementsByClassName('bubble-r');
let logo = document.getElementById('logo');
let friends = document.getElementsByClassName('friend');
let message_r = document.getElementsByClassName('message-r');
let winTalks = document.getElementsByClassName('winTalk');
let icons = document.getElementsByClassName('icon');
let right = document.querySelector('.right');
let friendsList = document.querySelector('.friendsList');
let peopleInformation;
let color,color1,r,g,b;
let friendImg;
let count=0;

window.onload=function(){
  change();
  //createNewTalk(person);//如果在这里直接用，无法回应事件，虽然能和页面同步加载,但初次获取不到指定好友信息;
}



addTalk();

function addTalk(){
  try{
    let ipcRender = require('electron').ipcRenderer;
    ipcRender.on('createTalkTo',(e,person)=>{
      createNewTalk(person,color);
      peopleInformation=person;
    });
  }
  catch(e){
    alert('打开聊天失败')
  }
}

function createNewTalk(person,color){//在测试时方便调用
  for(let j=0;j<winTalks.length;j++){
    winTalks[j].style.display='none';
  }
  for(let k=0;k<friends.length;k++){
    friends[k].setAttribute('data-active','0');
    friends[k].style.transform='scale(1)';
    friends[k].style.backgroundColor='white';
  }

  let winTalk = document.createElement('div');
  let look_1 = document.createElement('div');
  let write_1 = document.createElement('div');
  let say_1 = document.createElement('textarea');
  let go_1 = document.createElement('div');
  let icon = document.createElement('div');
  let expression = document.createElement('i');
  let file = document.createElement('i');
  let send = document.createElement('i');
  let friend = document.createElement('div');
  let img1 = document.createElement('div');
  let name1 = document.createElement('div');
  let avatar = document.createElement('img');


  winTalk.className = 'winTalk';
  look_1.className = 'look';
  write_1.className = 'write';
  say_1.className = 'say';
  go_1.className = 'go';
  icon.className = 'icon';
  expression.className = 'iconfont icon-xiaolian expression';
  file.className = 'iconfont icon-sucai file';
  send.className = 'iconfont icon-yongyan send';
  img1.className = 'img1';
  name1.className = 'name1';
  avatar.className = 'avatar';
  friend.className = 'friend';
  //friend.style.backgroundColor='yellow';


  say_1.style.placeholder="  请输入";
  say_1.setAttribute('accept','image/*');
  say_1.setAttribute('contenteditable','true');
  avatar.setAttribute('src',person.imgSrc);
  name1.innerHTML=person.name;
  winTalk.style.display='block'
  friend.setAttribute('data-active','1');
  friend.style.transform='scale(1.08)';
  friend.style.backgroundColor=color;
  go_1.style.backgroundColor=color;


  icon.appendChild(expression);
  icon.appendChild(file);
  go_1.appendChild(send);
  write_1.appendChild(icon);
  write_1.appendChild(say_1);
  write_1.appendChild(go_1);
  winTalk.appendChild(look_1);
  winTalk.appendChild(write_1);

  img1.appendChild(avatar);
  friend.appendChild(img1);
  friend.appendChild(name1);

  friendsList.appendChild(friend);
  right.appendChild(winTalk);

  friendsList.scrollTop = friendsList.scrollHeight;
  
  friendImg=person.imgSrc;
  /*latter(look_1,friendImg,person.message);*/

//对方发来消息
  try{
    let ipcRenderReceive = require('electron').ipcRenderer;
    /*ipcRenderReceive.on('receiveMessage',(e,s)=>{
      let ft=s.split(",");
      if(ft[6]===person.userId&&ft[3]!==person.userId){
        latter(look_1,ft[1],ft[7]);
      }
      //latter(look_1,ft[3],ft[5]);
      look_1.scrollTop = look_1.scrollHeight;
    })*/
    ipcRenderReceive.on('receiveMessage',(e,message)=>{
      if(message.toId===person.userId&&message.fromId!==person.userId){
        latter(look_1,message.fromImg,message.message);
      }
      //latter(look_1,ft[3],ft[5]);
      look_1.scrollTop = look_1.scrollHeight;
    })
  }
  catch(e){
    alert('接收消息失败');
  }

  //点击不同好友
  friend.onclick=function(){
    for(let j=0;j<winTalks.length;j++){
      winTalks[j].style.display='none';
    }
    for(let k=0;k<friends.length;k++){
      friends[k].setAttribute('data-active','0');
      friends[k].style.transform='scale(1)';
      friends[k].style.backgroundColor='white';
    }
    winTalk.style.display='block'
    friend.setAttribute('data-active','1');
    friend.style.transform='scale(1.08)';
    friend.style.backgroundColor=color1;
  }

  look_1.scrollTop = look_1.scrollHeight;
  
  //发送消息
  go_1.addEventListener('click',function(){
    let myMessage = document.createElement('div');
    let bubble_r = document.createElement('div');
    let img2 = document.createElement('div');
    let myAvatar = document.createElement('img');
    let imgSrc = person.userImgSrc;//我的头像
    let strContent = say_1.value;
    
    myMessage.className = 'message-r';
    bubble_r.className = 'bubble-r';
    img2.className = 'img2';
    myAvatar.className = 'avatar-r';
    
    bubble_r.style.backgroundColor=color1;
    bubble_r.style.borderLeftColor=color1;
    
    // myAvatar.src="../images/colorful.png";
    myAvatar.setAttribute('src',imgSrc);
    strContent = strContent.replace(/\n/g,'<br>').replace(/ /g,"&nbsp");
    bubble_r.innerHTML = strContent;//内容

    img2.appendChild(myAvatar);
    myMessage.appendChild(img2);
    myMessage.appendChild(bubble_r);
    look_1.appendChild(myMessage);

    friendImg=person.imgSrc;
    friendName=person.name;

    try{
      let ftMessage = {
        fromImg:person.userImgSrc,
        fromName:person.userName,
        fromId:person.userId,
        toImg:friendImg,
        toName:friendName,
        toId:person.id,
        message:strContent
      }
      let ipcRenderSend = require('electron').ipcRenderer;
      ipcRenderSend.send('sendMessage',ftMessage);
    }
    catch(e){
      alert('发送消息失败')
    }


    //latter(look_1,friendImg,person.message);
    
    say_1.value='';
    
    look_1.scrollTop = look_1.scrollHeight;
  }) 
}

  


clickFriend();
//点击不同好友聊天
function clickFriend(){
  for(let i=0;i<friends.length;i++){
    friends[i].onclick=function(){
      for(let j=0;j<winTalks.length;j++){
        winTalks[j].style.display='none';
      }
      for(let k=0;k<friends.length;k++){
        friends[k].setAttribute('data-active','0');
        friends[k].style.transform='scale(1)';
        friends[k].style.backgroundColor='white';
      }
      winTalks[i].style.display='block'
      friends[i].setAttribute('data-active','1');
      friends[i].style.transform='scale(1.08)';
      friends[i].style.backgroundColor=color;
    }
  }
}

function change(){
  r = Math.floor(Math.random()*255);
  g = Math.floor(Math.random()*255);
  b = Math.floor(Math.random()*255);

  color="rgba("+r+","+g+","+b+",1)";
  color1="rgba("+r+","+g+","+b+",1)";//避免关键字重复,有时候color会失灵，不明白原因，所以写一个color1，这样可以解决
  //say.style.boxShadow="2px 2px 3px rgba("+r+","+g+","+b+",1)";
  for(let i=0;i<bubble_r.length;i++){
    bubble_r[i].style.backgroundColor="rgba("+r+","+g+","+b+",1)";
    bubble_r[i].style.borderLeftColor="rgba("+r+","+g+","+b+",1)";
  }
  for(let i=0;i<go.length;i++){
    go[i].style.backgroundColor="rgba("+r+","+g+","+b+",1)";
  }
  for(let i=0;i<friends.length;i++){
    if(friends[i].getAttribute('data-active')==="1")
      friends[i].style.backgroundColor="rgba("+r+","+g+","+b+",1)";
  }
}

logo.addEventListener('click',change);

lookScroll();
function lookScroll(){
  for(let i=0;i<look.length;i++){
    look[i].scrollTop = look[i].scrollHeight;
  }
}

clickGo();
function clickGo(){
  for(let i=0;i<go.length;i++){
    go[i].onclick=function(){
      let myMessage = document.createElement('div');
      let bubble_r = document.createElement('div');
      let img2 = document.createElement('div');
      let myAvatar = document.createElement('img');
      //let imgSrc = avatar_r[i].getAttribute('src');
      let imgSrc = peopleInformation.userImgSrc;
      let strContent = say[i].value;
    
      myMessage.className = 'message-r';
      bubble_r.className = 'bubble-r';
      img2.className = 'img2';
      myAvatar.className = 'avatar-r';
    
      bubble_r.style.backgroundColor=color;
      bubble_r.style.borderLeftColor=color;
    
      //myAvatar.src="../images/colorful.png";
      myAvatar.setAttribute('src',imgSrc);
      strContent = strContent.replace(/\n/g,'<br>').replace(/ /g,"&nbsp");
      bubble_r.innerHTML = strContent;//内容
  
      img2.appendChild(myAvatar);
      myMessage.appendChild(img2);
      myMessage.appendChild(bubble_r);
      look[i].appendChild(myMessage);
    
      say[i].value='';
      say[i].focus();
    
      look[i].scrollTop = look[i].scrollHeight;
    };
  }
}


//对方发来消息
function latter(look,friendImg,message){
  let thatMessage = document.createElement('div');
  let bubble_l = document.createElement('div');
  let imgThat = document.createElement('div');
  let thatAvatar = document.createElement('img');
  let strContent1 = message;
    
  thatMessage.className = 'message-l';
  bubble_l.className = 'bubble-l';
  imgThat.className = 'img2';
  thatAvatar.className = 'avatar-l';
    
  //thatAvatar.src="../images/colorful.png";
  thatAvatar.setAttribute('src',friendImg);
  strContent1 = strContent1.replace(/\n/g,'<br>').replace(/ /g,"&nbsp");
  bubble_l.innerHTML = strContent1;//内容
  
  imgThat.appendChild(thatAvatar);
  thatMessage.appendChild(imgThat);
  thatMessage.appendChild(bubble_l);
  look.appendChild(thatMessage);  
    
  //look.scrollTop = look.scrollHeight;  
}




//关闭与退出
let min = document.getElementById('min');

min.addEventListener('click',(e)=>{
  try{
    let ipcRender = require('electron').ipcRenderer;
    ipcRender.send('min-talk');
  }
  catch(e){
    alert('最小化失败')
  }
})

let close = document.getElementById('close');

close.addEventListener('click',(e)=>{
  try {
    count=0;
    let ipcRender = require('electron').ipcRenderer;
    ipcRender.send('close-talk',count);
  }
  catch (e) {
    //console.log("不支持ipcRenderer")
    alert("关闭失败")
  }
})