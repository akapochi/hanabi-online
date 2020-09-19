'use strict';
import $ from 'jquery';
import io from 'socket.io-client';

const gameObj = {
  myDisplayName: $('#main').attr('data-displayName'),
  myThumbUrl: $('#main').attr('data-thumbUrl')
};

const socketQueryParameters = `displayName=${gameObj.myDisplayName}&thumbUrl=${gameObj.myThumbUrl}`;
const socket = io($('#main').attr('data-ipAddress') + '?' + socketQueryParameters);

socket.on('start data', (startObj) => {
  console.log('start data came');
});

socket.on('map data', (compressed) => {
  console.log('map data came');
});

const hanabiMany = 10;
const hanabis = [];
const hinokos = [];
const colors = ['#FF0000', '#00FFFF', '#008000', '#FFFF00'];
let nightSkyHeight = 300;
// let nightSkyWidth = 3000;

nightSkyHeight = document.getElementById('nightSky').clientHeight;
// nightSkyWidth = document.getElementById('nightSky').clientWidth;


// 花火の色を選ぶ

let color;

document.getElementById('red').onclick = () => {
  color = colors[0];
  // obj.style.border = "solid 300px black";
  console.log(color);
}

document.getElementById('blue').onclick = () => {
  color = colors[1];
  console.log(color);
}

document.getElementById('green').onclick = () => {
  color = colors[2];
  console.log(color);
}

document.getElementById('yellow').onclick = () => {
  color = colors[3];
  console.log(color);
}

document.getElementById('random').onclick = () => {
  color = colors[Math.floor(Math.random() * colors.length)];
  console.log(color);
}


// クリックしたときに実行する関数

let target = document.getElementById('nightSky');
let offsetX;
let offsetY;

target.addEventListener('click', getPosition);

function getPosition(e) {
  if (!color) {
    alert("色を指定してください")
    return; //ガード句
  }
  offsetX = e.offsetX; // =>要素左上からのx座標
  offsetY = e.offsetY; // =>要素左上からのy座標

  createHanabi();

  setInterval(() => {
    moveHanabis();
    moveHinokos();
  }, 33);
}

function createHanabi() {
  const x = offsetX;
  const deadY = offsetY; //deadYは爆発する位置のy座標
  const deadWidth = 120 + Math.floor(Math.random() * 50);
  const widePoint = 10 + Math.floor(Math.random() * 2) * 2;
  const moveY = 5 + Math.floor(Math.random() * 3) * 4;
  const y = nightSkyHeight;
  const width = 2;
  const height = 15;
  const hanabi = document.createElement("div");
  hanabi.style.width = `${width}px`;
  hanabi.style.height = `${height}px`;
  hanabi.style.backgroundColor = color;
  hanabi.style.borderRadius = '50%';
  hanabi.style.position = 'absolute';
  hanabi.style.left = x + 'px';
  hanabi.style.top = y + 'px';
  const hanabiObj = {
    x,
    y,
    width,
    height,
    deadY,
    deadWidth,
    widePoint,
    moveY,
    color,
    element: hanabi
  }
  hanabis.push(hanabiObj);
  document.getElementById('nightSky').appendChild(hanabi);
}

const hinokoMany = 30;

function createHinokos(x, y, color) {
  const width = 4;
  const height = 4;
  let positionMax = 3 + Math.floor(Math.random() * 2);
  for (let position = 0; position < positionMax; position++) {
    for (let i = 1; i <= hinokoMany; i++) {
      const direction = 360 * i / hinokoMany;
      const createX = x + Math.cos(getRadian(direction)) * 12 * position;
      const createY = y + Math.sin(getRadian(direction)) * 12 * position;
      const hinoko = document.createElement("div");
      hinoko.style.width = `${width}px`;
      hinoko.style.height = `${height}px`;
      hinoko.style.backgroundColor = color;
      hinoko.style.borderRadius = '50%';
      hinoko.style.position = 'absolute';
      hinoko.style.left = x + 'px';
      hinoko.style.top = y + 'px';
      const hinokoObj = {
        x: createX,
        y: createY,
        color,
        direction,
        aliveClock: 0,
        gravity: 0,
        element: hinoko
      }
      hinokos.push(hinokoObj);
      document.getElementById('nightSky').appendChild(hinoko);
    }
  }
}


function moveHanabis() {
  for (let index = 0; index < hanabis.length; index++) {
    const hanabiObj = hanabis[index];

    if (hanabiObj.y <= hanabiObj.deadY) {
      hanabis.splice(index, 1);
      index -= 1;
      hanabiObj.element.parentNode.removeChild(hanabiObj.element); //自分を削除
      setTimeout(() => {
        createHinokos(hanabiObj.x, hanabiObj.y, hanabiObj.color);
      }, 400);

      continue;

    } else {
      hanabiObj.y -= hanabiObj.moveY;
      hanabiObj.element.style.top = hanabiObj.y + 'px';
    }
  }
}

const deadClock = 40;
const velocity = 4;

function moveHinokos() {
  for (let index = 0; index < hinokos.length; index++) {
    const hinokoObj = hinokos[index];

    if (hinokoObj.aliveClock >= deadClock) {
      hinokos.splice(index, 1);
      index -= 1;
      hinokoObj.element.parentNode.removeChild(hinokoObj.element); //自分を削除
    }

    hinokoObj.x += Math.cos(getRadian(hinokoObj.direction)) * velocity;
    hinokoObj.y += Math.sin(getRadian(hinokoObj.direction)) * velocity + hinokoObj.gravity;
    hinokoObj.gravity += 0.08;
    hinokoObj.element.style.left = hinokoObj.x + 'px';
    hinokoObj.element.style.top = hinokoObj.y + 'px';
    hinokoObj.element.style.opacity = 1 - (hinokoObj.aliveClock / deadClock).toFixed(2);

    hinokoObj.aliveClock += 1;
  }
}

function getRadian(kakudo) {
  return kakudo * (Math.PI / 180);
}