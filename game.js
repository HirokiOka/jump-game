const gravity = 0.06;
const stageOneBlockCol = "green";
const stageTwoBlockCol = "gray";
const stageThreeBlockCol = "blue";
const stageFourBlockCol = "red";
const blocksInfo = [
  [
    [200, 550, 120, 100, stageOneBlockCol],
    [480, 400, 120,  48, stageOneBlockCol],
    [180, 320, 120,  48, stageOneBlockCol],
    [ 30, 300,  40,  48, stageOneBlockCol],
    [120, 160, 120,  48, stageOneBlockCol],
    [410,  60, 120,  48, stageOneBlockCol],
  ],
  [
    [540, 530, 100, 48, stageTwoBlockCol],
    [220, 450, 100, 48, stageTwoBlockCol],
    [220, 200, 100, 48, stageTwoBlockCol],
    [ 20, 325,  80, 48, stageTwoBlockCol],
    [ 60, 100,  20, 48, stageTwoBlockCol],
    [ 340, 100,  20, 18, stageTwoBlockCol],
    [ 580,  70,  20, 18, stageTwoBlockCol],
    [ 60,   0,  20,  1, stageTwoBlockCol, false],
  ],
  [
    [320, 590,  20, 12, stageThreeBlockCol],
    [330, 570,   1, 60, stageThreeBlockCol],
    [580, 590,  20, 12, stageThreeBlockCol],
    [320, 540,  20, 12, stageThreeBlockCol],

    [ 90, 450,  20, 12, stageThreeBlockCol],
    [ 20, 330,  20, 12, stageThreeBlockCol],
    [130, 330,  20, 12, stageThreeBlockCol],

    [550, 450,  20, 12, stageThreeBlockCol],
    [460, 320,  20, 12, stageThreeBlockCol],
    [520, 320,  20, 12, stageThreeBlockCol],
    [580, 320,  20, 12, stageThreeBlockCol],
    [520, 200,  20, 12, stageThreeBlockCol],

    [355, 185,   1, 60, stageThreeBlockCol],
    [295, 195,  20, 12, stageThreeBlockCol],
    [175, 195,  20, 12, stageThreeBlockCol],
    [ 55, 195,  20, 12, stageThreeBlockCol],
    [235,  75,  20, 12, stageThreeBlockCol],
    [115,  65,  20, 32, stageThreeBlockCol],
  ],
  [
    [80, 550, 50, 24, stageFourBlockCol],
    [120, 420, 50, 24,stageFourBlockCol],
    [400, 420, 50, 24,  stageFourBlockCol],
    [550, 300, 100, 24, stageFourBlockCol],
    [520, 170, 50, 24, stageFourBlockCol],
    [520, 40, 50, 24, stageFourBlockCol],
  ]
];

let player = null;
let blocks = new Array(blocksInfo.length).fill(null);
let stageImages = new Array(3).fill(null);
let imagePaths = ['./public/img/slope.png', './public/img/eng_front.png', './public/img/labo.jpg'];
let tsukakenLogo = null;
let gameState = 0;
let jumpSound = null;
let gameStartSound = null;
let clearSound = null;

//load assets before rendering
function preload() {
  stageImages = stageImages.map((_v, i) => loadImage(imagePaths[i]));
  tsukakenLogo = loadImage('./public/img/tsukaken.png');

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

function drawGameScene() {
  drawStage();
  blocks[gameState-1].forEach((block, i) => {
    block.draw();
    player.detectCollision(block, i);
  });
  if (gameState === 3) image(tsukakenLogo, 100, 12, 40, 40);
}

function switchGameState() {
  if (player.y < 0 && gameState !== 3) {
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


function drawStage() {
  const stageNum = gameState - 1;
  image(stageImages[stageNum], 0, 0, width, height);
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

    if (gameState === 3 && this.y - this.s < 0) {
      this.speedY *-1;
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

  detectCollisionY(block, index) {
    if ((this.speedY > 0) && this.isOnTheBlock(block)) {
      this.y = block.y - block.h/2 - this.s/2;
      this.speedY = 0;
      this.speedX = 0;
      this.isJumping = false;
      this.judgeClear(index);
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
    console.log(blockIndex);
    if (gameState == 3 && blockIndex === 17) {
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
