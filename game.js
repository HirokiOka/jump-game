const gravity = 0.06;
const stageOneBlocksInfo = [
  //centerX, centerY, width
  [200, 500, 120],
  [500, 400, 240],
  [100, 180, 120],
  [200, 300, 120],
  [480, 100, 220],
  [200, 60, 100],
];
const stageTwoBlocksInfo = [
  [240, 400, 100],
  [200, 200, 80],
  [20, 300, 80],
  [60, 100, 100],
  [400, 580, 100],
  [540, 500, 100],
];
const stageThreeBlocksInfo = [
  [240, 400, 100],
  [200, 200, 80],
  [20, 300, 80],
  [60, 100, 100],
  [400, 580, 100],
  [540, 500, 100],
];

let player = null;
let stageOneBlocks = [];
let stageTwoBlocks = [];
let stageThreeBlocks = [];
let slopeImg = null;
let shindaiImg = null;
let tsukakenImg = null;
let gameState = 0;
let isDebug = false;
let jumpSound = null;
let gameStartSound = null;
let clearSound = null;

//load assets before rendering
function preload() {
  slopeImg = loadImage('./public/img/slope.png');
  shindaiImg = loadImage('./public/img/eng_front.png');
  laboImg = loadImage('./public/img/labo.jpg');
  tsukakenImg = loadImage('./public/img/tsukaken.png');

  jumpSound = new Audio();
  jumpSound.src = './public/sound/jump_sound.mp3';
  gameStartSound = new Audio();
  gameStartSound.src = './public/sound/game_start.mp3';
  clearSound = new Audio();
  clearSound.src = './public/sound/clear.mp3';
}

//initialize HTML canvas and game objects
function setup() {
  createCanvas(600, 600);
  rectMode(CENTER);
  textAlign(CENTER);
  player = new Player(width/2, height-20, 20);
  stageOneBlocks = new Array(stageOneBlocksInfo.length).fill(null).map((_v, i) => (
    new Block(stageOneBlocksInfo[i][0], stageOneBlocksInfo[i][1], stageOneBlocksInfo[i][2], 24)
  ));
  stageTwoBlocks = new Array(stageTwoBlocksInfo.length).fill(null).map((_v, i) => (
    new Block(stageTwoBlocksInfo[i][0], stageTwoBlocksInfo[i][1], stageTwoBlocksInfo[i][2], 48)
  ));
  stageThreeBlocks = new Array(stageThreeBlocksInfo.length).fill(null).map((_v, i) => (
    new Block(stageThreeBlocksInfo[i][0], stageThreeBlocksInfo[i][1], stageThreeBlocksInfo[i][2], 48)
  ));
}

//draw and update game
function draw() {
  if (gameState === 0) {
    drawStartScene();
    return;
  }

  switchGameState();
  drawGameScene(gameState);
  player.update();
  player.draw();
  drawTime();
}

//global functions in draw
function drawStartScene() {
    background(0);
    textFont('arial black');
    fill(255);
    textSize(64);
    text("TOZAN KING", width/2, height/2 -20);
    textSize(24);
    textFont('Impact');
    text("- press space to start -", width/2, height/2 + 20);
    fill(0);
}

function drawGameScene(stage) {
  if (stage === 1) {
    drawStageOne();
    stageOneBlocks.forEach((block, i) => {
      fill('green');
      block.draw();
      player.detectCollision(block, i);
    });
  } else if (stage === 2) {
    drawStageTwo();
    stageTwoBlocks.forEach((block, i) => {
      fill('gray');
      block.draw();
      player.detectCollision(block, i);
    });
  } else if (stage === 3) {
    drawStageThree();
    stageThreeBlocks.forEach((block, i) => {
      fill('blue');
      block.draw();
      player.detectCollision(block, i);
    });
  }
}

function switchGameState() {
  if ((gameState === 1) && player.y < 0) {
    gameState = 2;
    player.y = height - player.y - player.s;
  } else if ((gameState === 2) && (player.y > height-20)) {
    gameState = 1;
    player.y = 20;
  } else if ((gameState === 2) && player.y < 0) {
    gameState = 3;
    player.y = height - player.y - player.s;
  } else if ((gameState === 3) && (player.y > height-20)) {
    gameState = 2;
    player.y = 20;
  }
}

function drawTime() {
  let ellapsedSec = floor(frameCount / 60); 
  textSize(24);
  fill(255);
  stroke(0);
  rect(width-100, 30, 120, 40);
  fill(0);
  text(`${secToMin(ellapsedSec)}`, width-100, 40);
}

function secToMin(sec) {
  const minutes = floor(sec / 60);
  const seconds = sec % 60;
  const displayTime = `${minutes}:${seconds}`;
  return displayTime;
}

function drawStageOne() {
  noStroke();
  fill('#3A2012');
  image(slopeImg, 0, 0, width, height);
  rect(width/2, height, width, 20);
  rect(0, height/2, 20, height);
  rect(width, height/2, 20, height);
}

function drawStageTwo() {
  stroke(0);
  fill('#3A2012');
  image(shindaiImg, 0, 0, width, height);
  rect(0, height/2, 20, height);
  rect(width, height/2, 20, height);
}

function drawStageThree() {
  stroke(0);
  fill('gray');
  image(laboImg, 0, 0, width, height);
  rect(0, height/2, 20, height);
  rect(width, height/2, 20, height);
  image(tsukakenImg, 30, 20, 40, 40);
}


class Player {
  constructor(x, y, s) {
    this.x = x;
    this.y = y;
    this.s = s;
    this.speedX = 0;
    this.speedY = 0;
    this.isJumping = false;
  }

  draw() {
    textSize(this.s * 2);
    this.isJumping ? text("🕺", this.x, this.y) : text("🚶", this.x, this.y);
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    if (gameState === 1 && this.y + this.s > height) {
      this.y = height - this.s;
      this.speedY = 0;
      if (this.isJumping) {
        this.isJumping = false;
        this.speedX = 0;
      }
    }

    if (this.isJumping) this.speedY += gravity; 

    if (this.x + this.s > width) {
      this.x = width - this.s;
      if (this.speedY !== 0) this.speedX *= -1;
    }

    if (this.x - this.s < 0) {
      this.x = this.s;
      if (this.speedY !== 0) this.speedX *= -1;
    }
  }

  jump() {
    this.speedY -= 4;
    this.isJumping = true;
  }

  detectCollision(block, index) {
    this.detectCollisionY(block, index);
    this.detectCollisionX(block);
  }

  detectCollisionY(block) {
    if ((this.speedY > 0) && this.isOnTheBlock(block)) {
      this.y = block.y - block.h/2 - this.s/2;
      this.speedY = 0;
      this.speedX = 0;
      this.isJumping = false;
      this.judgeClear();
    }
    
    if ((this.speedY == 0) && this.isDroppedFromBlock(block)) this.isJumping = true;

    if (this.isCollideWithCeiling(block) && (this.speedY < 0)) {
      this.speedY *= -1;
      this.y = block.y + block.h/2 + this.s/2;
    }
  }

  detectCollisionX(block) {
    if (this.isCollideWithSide(block)) this.speedX *= -1;
  }

  judgeClear(blockIndex) {
    if (gameState == 3 && blockIndex === 3) {
      fill('yellow');
      textSize(64);
      stroke(0);
      text('CLEAR!', width/2, height/2);
      clearSound.play();
      noLoop();
    }
  }

  calcYDistanceFromFloor(block) {
    const playerBottom = this.y + this.s/2;
    const floorTop = block.y - block.h/2
    const distance = abs(playerBottom - floorTop);
    return distance;
  }

  calcYDistanceFromCeiling(block) {
    const playerTop = this.y - this.s/2;
    const ceilingTop = block.y + block.h/2;
    const distance = abs(ceilingTop - playerTop);
    return distance;
  }

  calcXDistanceFromLeftSide(block) {
    const playerLeft = this.x - this.s/2;
    const blockLeft = block.x - block.w/2;
    const distance = abs(playerLeft - blockLeft);
    return distance;
  }

  calcXDistanceFromRightSide(block) {
    const playerRight = this.x + this.s/2;
    const blockRight = block.x + block.w/2;
    const distance = abs(playerRight - blockRight);
    return distance;
  }

  isCollideWithSide(block) {
    if ((this.y > block.y - block.h/2) && (this.y < block.y + block.h/2)) {
      if ((this.calcXDistanceFromLeftSide(block) < 10) || (this.calcXDistanceFromRightSide(block) < 10)) {
        return true;
      }
    }
    return false;
  }


  isCollideWithCeiling(block) {
    if ((this.x > block.x - block.w/2) && (this.x < block.x + block.w/2)) {
      if (this.calcYDistanceFromCeiling(block) < 10) {
        return true;
      }
    }
    return false;
  }


  isOnTheBlock(block) {
    if ((this.x > block.x - block.w/2) && (this.x < block.x + block.w/2)) {
      if (this.calcYDistanceFromFloor(block) < 10) {
        return true;
      }
    }
    return false;
  }

  isDroppedFromBlock(block) {
    if ((this.x < block.x - block.w/2) || (this.x > block.x + block.w/2)) {
      if (this.calcYDistanceFromFloor(block) < 10) {
        return true;
      }
    }
    return false;
  }
}

class Block {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  draw() {
    rect(this.x, this.y, this.w, this.h, 5);
  }
}

// keyEvent functions
function keyPressed() {
  if (gameState === 0 && keyCode === 32) {
      gameState = 1;
      gameStartSound.play();
  } else {
    if (player.isJumping) return;
    if (keyCode === 32) {
      player.jump();
      jumpSound.play();
    }

    if (keyCode === RIGHT_ARROW) player.speedX += 2;
    if (keyCode === LEFT_ARROW) player.speedX -= 2;
  }
}

function keyReleased() {
  if (gameState !== 0 && player.isJumping) return;
  player.speedX = 0;
}
