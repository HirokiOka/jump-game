const gravity = 0.06;
const positions = [
  [200, 500],
  [300, 400],
  [100, 140],
  [200, 300],
];
let player = null;
let blocks = [];
let img = null;

function preload() {
  img = loadImage('./forest_bg.jpg');
}

function setup() {
  createCanvas(600, 600);
  rectMode(CENTER);
  textAlign(CENTER);
  player = new Player(width/2, height-20, 20);
  blocks = new Array(positions.length).fill(null).map((_v, i) => (
    new Block(positions[i][0], positions[i][1], 160, 40)
  ));
}

function draw() {
  drawStage();
  blocks.forEach((block, _i) => {
    block.draw();
    player.detectCollision(block);
  });
  player.update();
  player.draw();
  drawTime();
}

function drawTime() {
  let ellapsedSec = floor(frameCount / 60); 
  textSize(24);
  fill(255);
  stroke(0);
  rect(width-100, 30, 120, 40);
  fill(0);
  text(`time: ${ellapsedSec}`, width-100, 40);
}

function drawStage() {
  noStroke();
  fill('#3A2012');
  image(img, 0, 0, width, height);
  rect(width/2, height, width, 20);
  rect(0, height/2, 20, height);
  rect(width, height/2, 20, height);
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
    text(`jump: ${this.isJumping}`, 40, height-40);
    text(`x: ${this.x}`, 40, height-80);
    text(`y: ${this.y}`, 40, height-60);
    this.x += this.speedX;
    this.y += this.speedY;
    
    if (this.y + this.s > height) {
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

  detectCollision(block) {
    this.detectCollisionY(block);
    this.detectCollisionX(block);
  }

  detectCollisionY(block) {
    if ((this.speedY > 0) && this.isOnTheBlock(block)) {
      this.y = block.y - block.h/2 - this.s/2;
      this.speedY = 0;
      this.speedX = 0;
      this.isJumping = false;
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
  if (player.isJumping) return;
  if (keyCode === 32) player.jump();
  if (keyCode === RIGHT_ARROW) player.speedX += 2;
  if (keyCode === LEFT_ARROW) player.speedX -= 2;
}

function keyReleased() {
  if (player.isJumping) return;
  player.speedX = 0;
}


