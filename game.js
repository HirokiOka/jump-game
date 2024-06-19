const gravity = 0.06;
const BLOCK_WIDTH = 40;
const BLOCK_HEIGHT = 40;
let showCredits = false;
/*
const stageOneBlocksInfo = [
  //centerX, centerY, width, isVisible
  [200, 550, 120, 100, true],
  [480, 420, 120,  48, true],
  [210, 310, 120,  32, true],
  [ 30, 280,  60,  32, true],
  [420, 220,  84,  32, true],
  [140, 160, 120,  32, true],
  [410,  60, 120,  48, true],
];
*/
const stageOneBlocksInfo = [
  [200, 550, 160, 80, true],
  [480, 420, 120,  40, true],
  [210, 310, 120,  40, true],
  [ 30, 280,  80,  40, true],
  [420, 220,  80,  40, true],
  [140, 160, 120,  40, true],
  [410,  60, 120,  40, true],
];

/*
const stageTwoBlocksInfo = [
  [540, 530, 100, 48, true],
  [240, 450, 100, 48, true],
  [220, 200, 100, 48, true],
  [ 20, 325,  80, 48, true],
  [ 60, 100,  20, 48, true],
  [340, 100,  24, 24, true],
  [560,  70,  48, 24, true],
  [ 60,   0,  20,  1, false],
];
*/
const stageTwoBlocksInfo = [
  [540, 530, 120, 40, true],
  [240, 450, 120, 40, true],
  [220, 200, 120, 40, true],
  [ 20, 325,  80, 40, true],
  [ 60, 120,  40, 40, true],
  [340, 100,  40, 40, true],
  [560,  70,  40, 40, true],
];

/*
const stageThreeBlocksInfo = [
  [320, 600,  20, 20, true],
  //[330, 570,   1, 60, false],
  [575, 580,  48, 20, true],
  [320, 540,  48, 20, true],

  [100, 440,  20, 20, true],
  [ 20, 310,  20, 40, true],
  [130, 310,  80, 20, true],

  //[540, 440,   1, 60, false],
  [550, 460,  20, 30, true],
  [340, 360,  60, 20, true],
  //[520, 320,  20, 20, true],
  [580, 320,  20, 20, true],
  [520, 200,  20, 20, true],

  [310, 190,  80, 20, true],
  [170, 180,  60, 20, true],
  [ 40, 170,  80, 20, true],
  [240,  36,  20, 40, true],
  [120,  100,  60, 20, true],
  //[105,  45,  30, 30, true],
];
*/
const stageThreeBlocksInfo = [
  [300, 600,  80, 40, true],
  [575, 580,  40, 40, true],

  [100, 440,  40, 40, true],
  [ 20, 310,  40, 40, true],
  [130, 310,  80, 40, true],

  [530, 500,  80, 40, true],
  [340, 380,  80, 40, true],
  [580, 320,  40, 40, true],
  [520, 260,  120, 40, true],

  [310, 190,  80, 40, true],
  [170, 180,  80, 80, true],
  [ 40, 170,  80, 80, true],
  [240,  36,  40, 40, true],
  [100,  100,  80, 40, true],
];

/*
const stageFourBlocksInfo = [
  [220, 410,  40, 380, true],
  [420, 400,  40, 400, true],

  [20, 550, 100, 20, true],
  [160, 500, 60, 20, true],
  [ 80, 380, 60,  20, true],
  [180, 370, 40,  20, true],
  [ 50, 250, 40,  20, true], 
  [180, 260, 40,  20, true],
  [180, 150, 40,  20, true],

  [540, 290, 40,  20, true],
  [340, 300, 60,  20, true],
];
*/

const stageFourBlocksInfo = [
  [220, 410,  40, 400, true],
  [420, 400,  40, 400, true],

  [20, 580, 120, 40, true],
  [160, 500, 80, 40, true],
  [ 80, 380, 40,  40, true],
  [180, 370, 40,  40, true],
  [ 50, 250, 40,  40, true], 
  [180, 260, 40,  40, true],
  //[180, 150, 40,  40, true],

  [540, 290, 40,  40, true],
  [340, 300, 40,  40, true],
];

let isClear = false;
let fc = 0;
let player = null;
let stageOneBlocks = [];
let stageTwoBlocks = [];
let stageThreeBlocks = [];
let stageFourBlocks = [];
let stageFiveBlocks = [];
let slopeImg = null;
let shindaiImg = null;
let tsukakenImg = null;
let titleImg = null;
let gameState = 0;
let isDebug = false;
let jumpSound = null;
let gameStartSound = null;
let interestingSound = null;
let badSound = null;
let clearSound = null;
let pixelFont = null;
let tsukaboImagesLeft = [];
let tsukaboImagesRight = [];
let isLeft = true;

//load assets before rendering
function preload() {

  tsukaboImagesLeft[0] = loadImage('./public/img/tsukabo_left_1.png');
  tsukaboImagesLeft[1] = loadImage('./public/img/tsukabo_left_2.png');
  tsukaboImagesLeft[2] = loadImage('./public/img/tsukabo_left_3.png');

  tsukaboImagesRight[0] = loadImage('./public/img/tsukabo_right_1.png');
  tsukaboImagesRight[1] = loadImage('./public/img/tsukabo_right_2.png');
  tsukaboImagesRight[2] = loadImage('./public/img/tsukabo_right_3.png');

  titleImg = loadImage('./public/img/tozan_king_title.png');
  stageOneImg = loadImage('./public/img/stage_one.png');
  stageTwoImg = loadImage('./public/img/stage_two.png');
  stageThreeImg = loadImage('./public/img/stage_three.png');
  stageFourImg = loadImage('./public/img/stage_four.png');
  tsukakenImg = loadImage('./public/img/tsukaken.png');

  pixelFont = loadFont('./public/font/PixelMplus10-Regular.ttf');

  jumpSound = new Audio();
  jumpSound.src = './public/sound/retro_jump.mp3';
  gameStartSound = new Audio();
  gameStartSound.src = './public/sound/retro_start.mp3';
  clearSound = new Audio();
  clearSound.src = './public/sound/retro_clear.mp3';
  interestingSound = new Audio();
  interestingSound.src = './public/sound/interesting.mp3';
  badSound = new Audio();
  badSound.src = './public/sound/bad.mp3';
}

//initialize HTML canvas and game objects
function setup() {
  const cnv = createCanvas(600, 600);
  cnv.style('display', 'block');
  rectMode(CENTER);
  textAlign(CENTER);
  const playerSize = 28;
  player = new Player(width/2, height-playerSize, playerSize);
  stageOneBlocks = new Array(stageOneBlocksInfo.length).fill(null).map((_v, i) => (
    new Block(stageOneBlocksInfo[i][0], stageOneBlocksInfo[i][1], stageOneBlocksInfo[i][2], stageOneBlocksInfo[i][3], stageOneBlocksInfo[i][4])
  ));
  stageTwoBlocks = new Array(stageTwoBlocksInfo.length).fill(null).map((_v, i) => (
    new Block(stageTwoBlocksInfo[i][0], stageTwoBlocksInfo[i][1], stageTwoBlocksInfo[i][2], stageTwoBlocksInfo[i][3], stageTwoBlocksInfo[i][4])
  ));
  stageThreeBlocks = new Array(stageThreeBlocksInfo.length).fill(null).map((_v, i) => (
    new Block(stageThreeBlocksInfo[i][0], stageThreeBlocksInfo[i][1], stageThreeBlocksInfo[i][2], stageThreeBlocksInfo[i][3], stageThreeBlocksInfo[i][4])
  ));
  stageFourBlocks = new Array(stageFourBlocksInfo.length).fill(null).map((_v, i) => (
    new Block(stageFourBlocksInfo[i][0], stageFourBlocksInfo[i][1], stageFourBlocksInfo[i][2], stageFourBlocksInfo[i][3], stageFourBlocksInfo[i][4])
  ));
}

//Draw and update game
function draw() {
  fc = parseInt(frameCount, 10);
  if (gameState === 0) {
    image(titleImg, 0, 0, width, height);
    textSize(38);
    textFont(pixelFont);
    fill('white');
    strokeWeight(4);
    stroke('black');
    if (fc % 60 < 30) {
      text("- press space to start -", width/2, height/2 + 20);
    }
    textSize(24);
    //fill('black');
    strokeWeight(2);
    text('(c) credits', 80, height - 20);
    if (showCredits) {
      const linePad = 24;
      fill('black');
      stroke('white');
      strokeWeight(4);
      rect(width/2, height/2, width*5/6, height*0.6);
      strokeWeight(1);
      textSize(24);
      fill('white');
      textFont(pixelFont);
      text('<Credits>', width/2, height/2 - 80);
      textSize(18);
      text('Game Design & Programming: Hiroki Oka & Mao Haomin', width/2, height/2 - linePad);
      text('Character Drawing: Zhang Yue', width/2, height/2);
      text('Sound Design: Kim Kwangyun', width/2, height/2 + linePad);
      text('QA Test & Level Design: Kai Washino & Natsumi Matsui', width/2, height/2 + linePad*2);
      text('                      Adhe Rahmatullah Sugiharto', width/2, height/2 + linePad*3);
      text('Special Thanks: Masahiko Tsukamoto', width/2, height/2 + linePad*4);
    }
    strokeWeight(1);
    textFont('arial black');
    return;
  }

  switchGameState();
  drawGameScene(gameState);
  player.update();
  player.draw();
  drawTime();
  if (gameState === 1) drawHowToPlay();
  if (gameState === 4) {
    const distance = dist(player.x, player.y, 260+20, 80+20);
    if (distance < 20) player.judgeClear();
  }
}

function drawHowToPlay() {
  fill('white');
  //[200, 550, 160, 80, true],
  textFont(pixelFont);
  textSize(18);
  const x = 220;
  const y = 550+18;
  if (isDebug) {
    fill('red');
    text('Debug', width/2 + 220, height - 60);
    fill('white');
  }
  text('<あそびかた>', x-20, y-34);
  text('左右キー: 移動', x-20, y-10);
  text('space: ジャンプ', x-20, y+14);
  //text('space: ジャンプ', width/2 + 220, height - 40);
  //text('左右キー: 移動', width/2 + 220, height - 20);
  textFont('arial black');
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
    fill(0)
    //image(titleImg, 0, 0, width, height);
}

function drawGameScene(stage) {
  if (stage === 1) {
    drawStageOne();
    stageOneBlocks.forEach((block, i) => {
      fill('#3A2012');
      block.draw();
      player.detectCollision(block, i);
    });
  } else if (stage === 2) {
    drawStageTwo();
    stageTwoBlocks.forEach((block, i) => {
      fill('#99FF00');
      block.draw();
      player.detectCollision(block, i);
    });
  } else if (stage === 3) {
    drawStageThree();
    stageThreeBlocks.forEach((block, i) => {
      fill('#99CCFF');
      block.draw();
      player.detectCollision(block, i);
    });
  } else if (stage === 4) {
    drawStageFour();
    stageFourBlocks.forEach((block, i) => {
      fill('#FFCC00');
      block.draw();
      player.detectCollision(block, i);
    });
  }
  drawStageName(stage);
  drawEdge(stage);
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
  } else if ((gameState === 3) && player.y < 0) {
    gameState = 4;
    player.y = height - player.y - player.s;
  } else if ((gameState === 4) && (player.y > height-20)) {
    gameState = 3;
    player.y = 20;
  } 
}

function drawTime() {
  let ellapsedSec = floor(frameCount / 60); 
  const RPAD = 80;
  const RectH = 40;

  strokeWeight(4);
  fill(255);
  rect(width-RPAD, 30, 120, RectH);
  textSize(24);
  fill(0);
  strokeWeight(1);
  stroke(0);
  textFont(pixelFont);
  text(`${secToMin(ellapsedSec)}`, width-RPAD, RectH);
  textFont('arial black');
}

function secToMin(sec) {
  const minutes = floor(sec / 60);
  const seconds = sec % 60;
  const displayMinutes = minutes < 10 ? (0 + minutes.toString()) : minutes.toString();
  const displaySeconds = seconds < 10 ? 0 + seconds.toString() : seconds.toString();
  const displayTime = displayMinutes + ":" + displaySeconds;
  return displayTime;
}

function drawStageOne() {
  image(stageOneImg, 0, 0, width, height);
  fill(0);
  stroke(0);
  fill('#3A2012');
}

function drawStageTwo() {
  image(stageTwoImg, 0, 0, width, height);
  stroke(0);
  fill('#99FF00');
}

function drawStageThree() {
  image(stageThreeImg, 0, 0, width, height);
  stroke(0);
  fill('#99CCFF');
}

function drawStageFour() {
  stroke(0);
  fill('#FFCC00');
  image(stageFourImg, 0, 0, width, height);
  image(tsukakenImg, 260, 80, 40, 40);
}

function drawEdge(stage) {
  noStroke();
  fill(87, 58, 46);
  rect(0, height/2, 20, height);
  rect(width, height/2, 20, height);
  if (stage === 1) {
    rect(width/2, height, width, 20);
  }
  stroke(0);
}

function drawStageName(stage) {
  const stageNames = ['登山口', '急斜面', '中腹', '山頂'];
  const currentStageName = stageNames[stage-1];
  const LPAD = 80;
  fill('skyblue');
  strokeWeight(4);
  rect(LPAD, 30, 120, 40, 4);
  strokeWeight(1);
  textSize(24);
  fill('black');
  stroke('white');
  textFont(pixelFont);
  
  text(currentStageName, LPAD, 40);
  textFont('arial black');
}


class Player {
  constructor(x, y, s) {
    this.x = x;
    this.y = y;
    this.s = s;
    this.speedX = 0;
    this.speedY = 0;
    this.isJumping = false;
    this.currentFrame = 0;
  }

  draw() {
    const frameDelay = 20;
    if (fc % frameDelay === 0 && this.speedX !== 0) {
      this.currentFrame = (this.currentFrame + 1) % 3;
    }
    if (isLeft) {
      image(tsukaboImagesLeft[this.currentFrame], this.x - this.s, this.y - this.s-4, this.s*2, this.s*2);
    } else {
      image(tsukaboImagesRight[this.currentFrame] , this.x - this.s, this.y - this.s-4, this.s*2, this.s*2);
    }
    //rect(this.x, this.y, 32, 32);
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

    if (this.speedY > 9) badSound.play();
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
    }
    
    if ((this.speedY === 0) && this.isDroppedFromBlock(block)) {
      this.isJumping = true;
    }

    //if ((this.speedY == 0) && this.isDroppedFromBlock(block)) this.isJumping = true;

    if (this.isCollideWithCeiling(block) && (this.speedY < 0)) {
      this.speedY *= -1;
      this.y = block.y + block.h/2 + this.s/2;
    }
  }

  detectCollisionX(block) {
    if (this.isCollideWithSide(block)) this.speedX *= -1;
  }

  judgeClear(blockIndex) {
      fill('yellow');
      textSize(64);
      stroke(0);
      textFont(pixelFont);
      text('CLEAR!', width/2, height/2);
      textSize(32);
      fill('white');
      text('ENTERでタイトルに戻る', width/2, height/2+64);
      clearSound.play();
      interestingSound.play();
      isClear = true;
      noLoop();
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
  constructor(x, y, w, h, isVisible) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.isVisible = isVisible;
  }
  draw() {
    if (this.isVisible === false) noFill();
    strokeWeight(1);
    stroke('green');
    //rect(this.x, this.y, this.w, this.h);
    const blockXNum = this.w / BLOCK_WIDTH;
    const blockYNum = this.h / BLOCK_HEIGHT;
    drawPlatform(this.x, this.y, blockXNum, blockYNum);
    noStroke();
    strokeWeight(1);
    stroke(0);
  }
}

// keyEvent functions
function keyPressed() {
  if (gameState === 0 && keyCode === 67) {
    showCredits = !showCredits;
  }
  if (gameState === 0 && keyCode === 32) {
      gameState = 1;
      gameStartSound.play();
  } else {
    if (keyCode === 13) {
      isDebug = !isDebug;
      if (isClear) window.location.reload();
    }
    if (!isDebug && player.isJumping) return;
    if (keyCode === 32) {
      player.jump();
      jumpSound.play();
    }
    if (keyCode === RIGHT_ARROW) {
      player.speedX += 2;
      isLeft = false;
    } 
    if (keyCode === LEFT_ARROW) {
      player.speedX -= 2;
      isLeft = true;
    }

  }
}

function keyReleased() {
  if (gameState !== 0 && player.isJumping) return;
  player.speedX = 0;
}

function drawBlock(x, y) {
  const fillCol = color(87, 58, 46);
  const strokeCol = color(60, 40, 30);
  const brightCol = color(117, 78, 66);
  const darkCol = color(60, 40, 30);
  const dotCol = color(100, 70, 60);

  fill(fillCol);
  stroke(strokeCol);
  rect(x, y, BLOCK_WIDTH, BLOCK_HEIGHT);

  noStroke();

  fill(brightCol);
  rect(x, y - BLOCK_HEIGHT / 2 + 2, BLOCK_WIDTH, 4); // top
  rect(x - BLOCK_WIDTH / 2 + 2, y, 4, BLOCK_HEIGHT); // left

  fill(darkCol);
  rect(x, y + BLOCK_HEIGHT / 2 - 2, BLOCK_WIDTH, 4); // bottom
  rect(x + BLOCK_WIDTH / 2 - 2, y, 4, BLOCK_HEIGHT); // right

  
  fill(dotCol);
  for (let i = x - BLOCK_WIDTH / 2 + 5; i < x + BLOCK_WIDTH / 2; i += 5) {
    for (let j = y - BLOCK_HEIGHT / 2 + 5; j < y + BLOCK_HEIGHT / 2; j += 5) {
      let brightness = random(90, 120);
      fill(brightness, 70, 60);
      rect(i, j, 2, 2);
    }
  }
}


function drawPlatform(x, y, blockXNum, blockYNum) {
  const startX = x - (blockXNum - 1) * BLOCK_WIDTH / 2;
  const startY = y - (blockYNum - 1) * BLOCK_WIDTH / 2;
  for (let j = 0; j < blockYNum; j++) {
    for (let i = 0; i < blockXNum; i++) {
      drawBlock(startX + i * BLOCK_WIDTH, startY + j * BLOCK_HEIGHT);
    }
  }
}
