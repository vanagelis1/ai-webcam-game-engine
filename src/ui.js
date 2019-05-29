import * as tf from '@tensorflow/tfjs/dist/index';
import * as game from '../game';

const CONTROLS = ['up', 'down', 'left', 'right', 'downLeft', 'downRight', 'upRight', 'upLeft'];
const CONTROL_CODES = [38, 40, 37, 39, 41, 42, 43, 44];

export function init() {
  document.getElementById('controller').style.display = '';
  statusElement.style.display = 'none';
}

const trainStatusElement = document.getElementById('train-status');

// Set hyper params from UI values.
export const getLearningRate = () => +0.0001;

export const getBatchSizeFraction = () => +0.4;

export const getEpochs = () => +20;

export const getDenseUnits = () => +100;
const statusElement = document.getElementById('status');

export function startGame() {
  game.init()
}

export function predictClass(classId) {
  game.arrowSetting(CONTROL_CODES[classId])
  document.body.setAttribute('data-active', CONTROLS[classId]);
}

export function isPredicting() {
  statusElement.style.visibility = 'visible';
}
export function donePredicting() {
  statusElement.style.visibility = 'hidden';
}
export function trainStatus(status) {
  trainStatusElement.innerText = status;
}

export let addExampleHandler;
export function setExampleHandler(handler) {
  addExampleHandler = handler;
}
let mouseDown = false;
const totals = [0, 0, 0, 0, 0, 0, 0, 0];

const upButton = document.getElementById('up');
const downButton = document.getElementById('down');
const leftButton = document.getElementById('left');
const rightButton = document.getElementById('right');

const upLeftButton = document.getElementById('upLeft');
const downLeftButton = document.getElementById('downLeft');
const upRightButton = document.getElementById('upRight');
const downRightButton = document.getElementById('downRight');

const thumbDisplayed = {};

function sleep(duration) {
  return new Promise(function(resolve, reject) {
    setTimeout(()=> { resolve(0) }, duration);
  })
}

async function handler(label, delay) {
  const className = CONTROLS[label];

  let timesRun = 0;
  let interval = setInterval(function(){
    timesRun += 1;
    if (timesRun % 2 === 0) {
      document.body.setAttribute('data-active', CONTROLS[label]);
    } else {
      document.body.removeAttribute('data-active');
    }
    if(timesRun === 12){
      clearInterval(interval);
    }
    //do whatever here..
  }, 250);
  let remainingTime = await sleep(delay)
  for (let i = 0; i < 50; i++) {

    const total = document.getElementById(className + '-total');
    addExampleHandler(label);
    document.body.setAttribute('data-active', CONTROLS[label]);
    total.innerText = ++totals[label];
    await tf.nextFrame();
    document.body.removeAttribute('data-active');
  }
}

upButton.addEventListener('mousedown', () => handler(0, 3000));
upButton.addEventListener('mouseup', () => mouseDown = false);

downButton.addEventListener('mousedown', () => handler(1, 3000));
downButton.addEventListener('mouseup', () => mouseDown = false);

leftButton.addEventListener('mousedown', () => handler(2, 3000));
leftButton.addEventListener('mouseup', () => mouseDown = false);

rightButton.addEventListener('mousedown', () => handler(3, 3000));
rightButton.addEventListener('mouseup', () => mouseDown = false);

upLeftButton.addEventListener('mousedown', () => handler(7, 3000));
upLeftButton.addEventListener('mouseup', () => mouseDown = false);

downLeftButton.addEventListener('mousedown', () => handler(4, 3000));
downLeftButton.addEventListener('mouseup', () => mouseDown = false);

upRightButton.addEventListener('mousedown', () => handler(6, 3000));
upRightButton.addEventListener('mouseup', () => mouseDown = false);

downRightButton.addEventListener('mousedown', () => handler(5, 3000));
downRightButton.addEventListener('mouseup', () => mouseDown = false);

export function drawThumb(img, label) {
  if (thumbDisplayed[label] == null) {
    const thumbCanvas = document.getElementById(CONTROLS[label] + '-thumb');
    draw(img, thumbCanvas);
  }
}

export function draw(image, canvas) {
  const [width, height] = [224, 224];
  const ctx = canvas.getContext('2d');
  const imageData = new ImageData(width, height);
  const data = image.dataSync();
  for (let i = 0; i < height * width; ++i) {
    const j = i * 4;
    imageData.data[j + 0] = (data[i * 3 + 0] + 1) * 127;
    imageData.data[j + 1] = (data[i * 3 + 1] + 1) * 127;
    imageData.data[j + 2] = (data[i * 3 + 2] + 1) * 127;
    imageData.data[j + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
}
