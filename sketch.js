const gravity = 0.06;
let player = null;
let blocks = [];
let positions = [
  [400, 400],
  [500, 500],
  [700, 200],
  [100, 200],
  [200, 300],
  [400, 100],
];
let img = null;

function preload() {
  img = loadImage('./forest_bg.jpg');
}


function setup() {
  createCanvas(600, 600);
  rectMode(CENTER);
  player = new Player(width/2, height-20, 20);
  blocks = new Array(positions.length).fill(null).map((_v, i) => (
    new Block(positions[i][0], positions[i][1], 200, 10)
  ));
}

function draw() {
  let ellapsedSec = floor(frameCount / 60); 
  image(img, 0, 0, width, height);
  noStroke();
  fill('#3A2012');
  rect(width/2, height, width, 20);
  rect(0, height/2, 20, height);
  rect(width, height/2, 20, height);

  blocks.forEach((block, _i) => {
    block.draw();
    player.detectCollision(block);
  });
  player.update();
  player.draw();
  textSize(24);
  fill(255);
  stroke(0);
  rect(width-100, 30, 120, 40);
  fill(0);
  text(`time: ${ellapsedSec}`, width*3/4, 40);
}

class Player {
  constructor(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.isJumping = false;
    this.speedX = 0;
    this.speedY = 0;
  }

  draw() {
    textSize(this.w * 2);
    if (this.isJumping) {
      text("🕺", this.x, this.y);
    } else {
      text("🚶", this.x, this.y);
    }
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    if (this.y + this.w/2 > height) {
      this.y = height - this.w/2;
      if (this.isJumping) {
        this.isJumping = false;
        this.speedX = 0;
      }
    }

    if (this.speedY < 300) { this.speedY += gravity; }
    if (this.x + this.w*2 > width) {
      this.x = width - this.w*2;
      if (this.isJumping) this.speedX *= -1;
    }
    if (this.x - this.w/2 < 0) {
      this.x = this.w/2;
      if (this.isJumping) this.speedX *= -1;
    }
  }

  jump() {
    if (this.isJumping) return;
    this.speedY = -4;
    this.isJumping = true;
  }

  detectCollision(block) {
    if (this.calcYDistance(block) > 20) return;
    if (this.isUnderTheBlock(block) && (this.speedY < 0)) {
      this.y = block.y + block.h/2 + this.w/2;
      this.speedY += 4;
    }
    if (this.isAboveTheBlock(block) && (this.speedY > 0)) {
      this.y = block.y - block.h - this.w/2;
      if (this.isJumping) {
        this.isJumping = false;
        this.speedX = 0;
      }
      this.speedY = 0;
    }
  }

  calcYDistance(block) {
    const yDistance = floor(abs(this.y - block.y));
    return yDistance;
  }

  isUnderTheBlock(block) {
    if ((this.x > block.x - block.w/2) && (this.x < block.x + block.w/2)) {
      if ((this.y - this.w/2) > (block.y + block.h/2)) return true;
    }
    return false;
  }

  isAboveTheBlock(block) {
    if ((this.x > block.x - block.w/2) && (this.x < block.x + block.w/2)) {
      if ((this.y + this.w/2) < (block.y - block.h/2)) return true;
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
    rect(this.x, this.y,  this.w, this.h);
  }
}

function keyPressed() {
  if (keyCode === RETURN) player.jump();
  if ((keyCode === RIGHT_ARROW) && !player.isJumping) player.speedX += 2;
  if (keyCode === LEFT_ARROW && !player.isJumping) player.speedX -= 2;
}

function keyReleased() {
  if (player.isJumping) return;
  player.speedX = 0;
}
