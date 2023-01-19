let port;
let connectBtn;

let xPos = 300;
let yPos = 550;
let circleSize = 50;
let xVal = 0;
let altX = 0;
let yVal = 0;
let altY = 0;
let prevX;
let prevY;
let circleRadius = circleSize/2;
let sX = 400; // big square x value
let sY = 350; // big square y value
let cX = 115; // small square x value
let cY = 170; // small square y value
let canX = 600; 
let canY = 600;
// colours
let blue = '#228C22';
let yellow = '#000000';
let red = '#228C22';

let s = 5; // speed

function setup() {
  createCanvas(canX, canY);
  rectMode(CENTER);

  port = createSerial();

  connectBtn = createButton('Connect to Arduino');
  connectBtn.position(20, 20);
  connectBtn.mousePressed(connectBtnClick);
}

function draw() {
  background(240);

  /* draw the border goals */
  rectMode(CORNER);
  fill(color(blue));
  rect(0, 0, canY, 15);

  /* import the raw data from arduino as one line of inputs seperated by ':' */
  let accelInput = port.readUntil("\n");
  // console.log(accelInput); // use to test if the accelerometer is working

  /* extract & split the x value from the serial port */
  let xVal = accelInput.split(':')[0] || altX;
  /* extract & split the y value from the serial port */
  let yVal = accelInput.split(':') [1] || altY;

  if (xVal) {
    altX = xVal;
  }
  if (yVal) {
    altY = yVal;
  }

    
  /* Testing for values */
  console.log('xPos:'+xPos+' / yPos:'+yPos);

    /* stops flickering, and makes there be only one circle */
    /* WHAT I WROTE WITH MATT AND IRTI */
  if (yVal < 0 && xVal < 0) { // moves to the bottom left hand corner
        yPos ++;
        xPos --;
      } else if (yVal < 0 && xVal > 0) { // moves to bottom right hand corner
        yPos ++;
        xPos ++;
      } else if(yVal > 0 && xVal > 0) {
        yPos --;
        xPos ++;
      } else if (yVal > 0 && xVal < 0) {
        yPos --;
        xPos --;
      } else if (xVal > 0 /*|| yVal != 0*/) {
        xPos ++;
      } else if (xVal < 0) {
        xPos --;
      } else if (yVal < 0) {
        yPos ++;
      } else if (yVal > 0) {
        yPos --;
  }

  /* drawing the player circle & position */
  fill(color(red));
  ellipse(xPos, yPos, circleSize);

  /* drawing the surroundings */ 
  rectMode(CENTER);
  fill(color(yellow));
  rect(sX, sY, 250, 250); // big square
  rect(cX, cY, 130, 130); // small square

  if ((xPos > (sX - 125) - circleRadius) && (xPos < (sX + 125) + circleRadius) && (yPos < (sY + 125) + circleRadius) && (yPos > (sY - 125) - circleRadius)) {
    gameOver();
  }

 /* WINNING */
 if (yPos < 0 + circleSize/2 + 15){
    youWin();
 }

  /* Start the game */ 
  if ((xPos === 300) && (yPos === 550)) {
      startGame();
  }

  /* GAME OVER function */ 
  if (xPos > width - circleRadius || xPos < 0 + circleRadius || yPos > height - circleRadius) {
      gameOver();
  }

  /* changes button label based on connection status */
  if (!port.opened()) {
    connectBtn.html('Connect to Arduino');
  } else {
    connectBtn.html('Disconnect');
  }


}

// connect to serial port button
function connectBtnClick() {
  if (!port.opened()) {
    port.open('Arduino', 115200);
  } else {
    port.close();
  }
}

function gameOver() {
  fill(0);
  rect(300, 300, canX, canY);
  fill(255);
  textAlign(CENTER);
  text('Game Over!', 300, 305);
}

function youWin() {
  fill(color(blue));
  rectMode(CENTER);
  rect(300, 295, canX, canY);
  fill(255);
  textAlign(CENTER);
  text('You Win!', 300, 305);
}

function startGame() {
  noStroke();
  fill(240);
  rectMode(CENTER);
  rect(300, 300, canX, canY);
  textAlign(CENTER);
  fill(0);
  text('Start game by moving\n the accelerometer', 300, 300);
  /* drawing the player circle & position */
  fill(color(red));
  ellipse(xPos, yPos, circleSize);
}
