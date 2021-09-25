const gravity = 0.06;
const stageOneBlockCol = "green";
const stageTwoBlockCol = "gray";
const stageThreeBlockCol = "gray";
const blocksInfo = [
  [
    [200, 500, 120, 24, stageOneBlockCol],
    [500, 400, 240, 24, stageOneBlockCol],
    [100, 180, 120, 24, stageOneBlockCol],
    [200, 300, 120, 24, stageOneBlockCol],
    [480, 100, 220, 24, stageOneBlockCol],
    [200, 60, 100, 24, stageOneBlockCol],
  ],
  [
    [240, 400, 100, 48, stageTwoBlockCol],
    [200, 200, 80, 48, stageTwoBlockCol],
    [20, 300, 80, 48, stageTwoBlockCol],
    [60, 100, 100, 48, stageTwoBlockCol],
    [400, 580, 100, 48, stageTwoBlockCol],
    [540, 500, 100, 48, stageTwoBlockCol],
  ],
  [
    [240, 400, 100, 48, stageThreeBlockCol],
    [200, 200, 80, 48, stageThreeBlockCol],
    [20, 300, 80, 48, stageThreeBlockCol],
    [60, 100, 100, 48, stageThreeBlockCol],
    [400, 580, 100, 48, stageThreeBlockCol],
    [540, 500, 100, 48, stageThreeBlockCol],
  ]
];

let player = null;
let blocks = new Array(blocksInfo.length).fill(null);
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
  blocks.forEach((_v, i) => {
    blocks[i] = new Array(blocksInfo[i].length).fill(null).map((_v, j) => ( new Block(...blocksInfo[i][j]) ));
  });
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
    text("TOZAN KING", width/2, height/2 - 20);
    textSize(24);
    textFont('Impact');
    text("- press space to start -", width/2, height/2 + 20);
    fill(0);
}

function drawGameScene(stage) {

  if (stage === 1) {
    drawStage(slopeImg);
  } else if (stage === 2) {
    drawStage(shindaiImg);
  } else if (stage === 3) {
    drawStage(laboImg);
  }
  blocks[stage-1].forEach((block, i) => {
    block.draw();
    player.detectCollision(block, i);
  });
}

function switchGameState() {
  if (player.y < 0) {
    gameState++;
    player.y = height - player.y - player.s;
  } else if(player.y > height-20) {
    gameState--;
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
  text(`${secToDisplayTime(ellapsedSec)}`, width-100, 40);
}


function secToDisplayTime(sec) {
  const minutes = floor(sec / 60);
  const seconds = sec % 60;
  const displayMinutes = minutes < 10 ? (0 + minutes.toString()) : minutes.toString();
  const displaySeconds = seconds < 10 ? 0 + seconds.toString() : seconds.toString();
  const displayTime = displayMinutes + ":" + displaySeconds;
  return displayTime;
}


function drawStage(img) {
  image(img, 0, 0, width, height);
  fill('gray');
  rect(0, height/2, 20, height);
  rect(width, height/2, 20, height);
  if (gameState === 1) rect(width/2, height, width, 20);
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
  constructor(x, y, w, h, col, isVisible=true) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.col = col;
    this.isVisible = isVisible;
  }

  draw() {
    if (this.isVisible) {
      fill(this.col);
      rect(this.x, this.y, this.w, this.h, 5);
    }
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
