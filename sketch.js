const gravity = 0.06;
const positions = [
  [200, 500, 120],
  [500, 400, 240],
  [100, 180, 120],
  [200, 300, 120],
  [480, 100, 220],
  [200, 60, 100],
];

const cloudsPositions = [
  [240, 400, 100],
  [200, 200, 80],
  [20, 300, 80],
  [60, 100, 100],
  [400, 580, 100],
  [540, 500, 100],
];
let player = null;
let blocks = [];
let clowds = [];
let img = null;
let skyImg = null;
let tsukakenImg = null;
let gameState = 0;
let isDebug = false;
let jumpSound = null;
let gameStartSound = null;
let clearSound = null;

function preload() {
  img = loadImage('./saka.jpg');
  skyImg = loadImage('./shindai.jpeg');
  tsukakenImg = loadImage('./tsukaken.png');
  jumpSound = new Audio();
  jumpSound.src = './jump_sound.mp3';
  gameStartSound = new Audio();
  gameStartSound.src = './game_start.mp3';
  clearSound = new Audio();
  clearSound.src = './clear.mp3';
}

function setup() {
  createCanvas(600, 600);
  rectMode(CENTER);
  textAlign(CENTER);
  player = new Player(width/2, height-20, 20);
  blocks = new Array(positions.length).fill(null).map((_v, i) => (
    new Block(positions[i][0], positions[i][1], positions[i][2], 24)
  ));
  clowds = new Array(cloudsPositions.length).fill(null).map((_v, i) => (
    new Block(cloudsPositions[i][0], cloudsPositions[i][1], cloudsPositions[i][2], 48)
  ));
}

function draw() {
  if (gameState === 0) {
    background(0);
    textFont('arial black');
    fill(255);
    textSize(64);
    text("TOZAN KING", width/2, height/2 -20);
    textSize(24);
    textFont('Impact');
    text("- press space to start -", width/2, height/2 + 20);
    fill(0);
  } else {

    switchGameState();
    if (gameState === 1) {
      drawStage();
      blocks.forEach((block, i) => {
        block.draw();
        player.detectCollision(block, i);
      });
    } else if (gameState === 2) {
      drawStageTwo();
      clowds.forEach((clowd, i) => {
        fill('gray');
        clowd.draw();
        player.detectCollision(clowd, i);
      });
    }
    player.update();
    player.draw();
    drawTime();
    text(gameState, width-20, height-20);
    }
}

function switchGameState() {
  if ((gameState === 1) && player.y < 0) {
    gameState = 2;
    player.y = height - player.y - player.s;
  } else if ((gameState === 2) && (player.y > height-20)) {
    gameState = 1;
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

function drawStage() {
  noStroke();
  fill('#3A2012');
  image(img, 0, 0, width, height);
  rect(width/2, height, width, 20);
  rect(0, height/2, 20, height);
  rect(width, height/2, 20, height);
}

function drawStageTwo() {
  stroke(0);
  fill('gray');
  image(skyImg, 0, 0, width, height);
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
    fill(0);
    if (isDebug) {
      text(`jump: ${this.isJumping}`, 40, height-40);
      text(`x: ${this.x}`, 40, height-80);
      text(`y: ${this.y}`, 40, height-60);
    }
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

  detectCollisionY(block ,index) {
    if ((this.speedY > 0) && this.isOnTheBlock(block)) {
      this.y = block.y - block.h/2 - this.s/2;
      this.speedY = 0;
      this.speedX = 0;
      this.isJumping = false;
      if (gameState == 2 && index === 3) {
        fill('yellow');
        textSize(64);
        stroke(0);
        text('CLEAR!', width/2, height/2);
        clearSound.play();
        noLoop();
      }
    }
    if ((this.speedY == 0) && this.isDroppedFromBlock(block)) this.isJumping = true;

    if (this.isCollideWithCeiling(block) && (this.speedY < 0)) {
      this.speedY *= -1;
      this.y = block.y + block.h/2 + this.s/2;
    }
  }

  detectCollisionX(block) {
    if (this.isCollideWithSide(block)) {
      this.speedX *= -1;
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
        console.log('collide');
        return true;
      }
    }
    return false;
  }


  isOnTheBlock(block) {
    if ((this.x > block.x - block.w/2) && (this.x < block.x + block.w/2)) {
      if (this.calcYDistanceFromFloor(block) < 10) {
        console.log('on');
        return true;
      }
    }
    return false;
  }

  isDroppedFromBlock(block) {
    if ((this.x < block.x - block.w/2) || (this.x > block.x + block.w/2)) {
      if (this.calcYDistanceFromFloor(block) < 10) {
        console.log('dropped');
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

function keyPressed() {
  if (gameState === 0) {
    if (keyCode === 32) {
      gameState = 1;
      gameStartSound.play();
    }
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
  if (player.isJumping) return;
  player.speedX = 0;
}


