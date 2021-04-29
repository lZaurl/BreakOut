/** Width and height of application window (canvas) in pixels */
const APPLICATION_WIDTH = 400;
const APPLICATION_HEIGHT = 600;

/** Dimensions of game board (usually the same) */
const WIDTH = APPLICATION_WIDTH;
const HEIGHT = APPLICATION_HEIGHT;

/** Dimensions of the paddle */
const PADDLE_WIDTH = 60;
const PADDLE_HEIGHT = 10;

/** Offset of the paddle up from the bottom */
const PADDLE_Y_OFFSET = 30;

/** Number of bricks per row */
const NBRICKS_PER_ROW = 10;

/** Number of rows of bricks */
const NBRICK_ROWS = 10;

/** Separation between bricks */
const BRICK_SEP = 4;

/** Width of a brick */
const BRICK_WIDTH = (WIDTH - (NBRICKS_PER_ROW - 1) * BRICK_SEP) / NBRICKS_PER_ROW;

/** Height of a brick */
const BRICK_HEIGHT = 8;

/** Radius of the ball in pixels */
const BALL_RADIUS = 6;

/** Offset of the top brick row from the top */
const BRICK_Y_OFFSET = 70;

/** Number of turns */
const NTURNS = 3;


/* You fill this in, add methods */
class Breakout {
    constructor(context) {
        this.context = context;
        this.init();
    }

    /** Sets up the Breakout program. */
    init() {
        this.drawStart();
        this.drawBall();
        // this.drawPaddle();


    }
    drawStart() {
            context.beginPath();
            context.rect(130, APPLICATION_HEIGHT / 2 - 40, 143, 60);
            context.fillStyle = "yellow";
            context.fill();

            context.font = "30px Arial";
            context.fillStyle = "red"
            context.fillText("S T A R T", 135, APPLICATION_HEIGHT / 2);

            context.font = "30px Arial";
            context.strokeText("S T A R T", 135, APPLICATION_HEIGHT / 2);
        }
        // drawPaddle() {
        //     context.beginPath();
        //     context.fillrect(paddle.x, paddle.y, paddle.width, paddle.height);
        //     context.fillStyle = "black";
        //     context.lineWidth = 2;
        //     context.stroke();
        // }
    drawBall() {
        context.beginPath();
        context.arc(APPLICATION_WIDTH / 2 - BALL_RADIUS / 2, canvas.height / 2 + 200, BALL_RADIUS, 0, 2 * Math.PI);
        context.fillStyle = "#FF6A00";
        context.fill();
    }

    /** Runs the Breakout program. */
    run() {

    }
}

/* ---------------------------- GAME LOGIC FINISHES HERE ---------------------------- */

const canvas = document.getElementById("game");


/* 
    maybe do stuff here ...
*/

const context = canvas.getContext('2d');


//background

canvas.width = APPLICATION_WIDTH;
canvas.height = APPLICATION_HEIGHT;

context.beginPath();
context.rect(0, 0, APPLICATION_WIDTH, APPLICATION_HEIGHT);
context.fillStyle = "#E7E7E7";
context.fill();



//paddle
// context.beginPath();
// context.rect(APPLICATION_WIDTH / 2 - PADDLE_WIDTH / 2, APPLICATION_HEIGHT - PADDLE_Y_OFFSET, PADDLE_WIDTH, PADDLE_HEIGHT);
// context.fillStyle = "black";
// context.lineWidth = 2;
// context.stroke();

//ball 
// context.beginPath();
// context.arc(APPLICATION_WIDTH / 2 - BALL_RADIUS / 2, canvas.height / 2 + 200, BALL_RADIUS, 0, 2 * Math.PI);
// context.fillStyle = "#FF6A00";
// context.fill();

//blocks
let y = APPLICATION_HEIGHT - 450;
for (let i = 10; i > 0; i--) {
    let x = 0;
    let c;
    if (i == 1 || i == 2) {
        c = "red"
    }
    if (i == 3 || i == 4) {
        c = "orange"
    }
    if (i == 5 || i == 6) {
        c = "yellow"
    }
    if (i == 7 || i == 8) {
        c = "green"
    }
    if (i == 9 || i == 10) {
        c = "cyan"
    }
    for (let j = 10; j > 0; j--) {
        context.beginPath();
        context.rect(x, y, BRICK_WIDTH, BRICK_HEIGHT);
        context.fillStyle = c;
        context.fill();
        x = x + BRICK_WIDTH + BRICK_SEP;
    }
    y = y - BRICK_HEIGHT - BRICK_SEP;
}

//edge
context.beginPath();
context.rect(0, 0, APPLICATION_WIDTH, APPLICATION_HEIGHT);
context.fillStyle = "black";
context.lineWidth = 2;
context.stroke();







// create game here
canvas.style = "position:absolute; left: 50%; width: 400px; margin-left: -200px;"
let breakout = new Breakout(context);


/* 
   call breakout.run() to start playing 
   don't start until user interacts with canvas
   (you can add start button / wait until mouse is clicked or left/right arrows are pressed) 
*/



//paddle:
let paddle = {
    x: APPLICATION_WIDTH / 2 - PADDLE_WIDTH / 2,
    y: APPLICATION_HEIGHT - PADDLE_Y_OFFSET,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    moveBy: 5,
}
context.fillStyle = "black";
context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
let leftArrow = false;
let rightArrow = false;
document.addEventListener('keydown', function(event) {
    if (event.key == left) {
        leftArrow = true
    } else if (event.key == right) {
        rightArrow = true
    }
})
document.addEventListener('keyup', function(event) {
    if (event.key == left) {
        leftArrow = false
    } else if (event.key == right) {
        rightArrow = false
    }
})

function movePaddle() {
    if (rightArrow && paddle.x + paddle.width < APPLICATION_WIDTH) {
        context.beginPath();
        context.fillStyle = "#E7E7E7";
        context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
        paddle.x += paddle.moveBy
        context.beginPath();
        context.fillStyle = "black";
        context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    } else if (leftArrow && paddle.x > 0) {
        context.beginPath();
        context.fillStyle = "#E7E7E7";
        context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
        paddle.x -= paddle.moveBy
        context.beginPath();
        context.fillStyle = "black";
        context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }
}

//start:
document.addEventListener('keydown', function(event) {
    if (event.key == enter) {
        context.beginPath();
        context.rect(130, APPLICATION_HEIGHT / 2 - 40, 143, 60);
        context.fillStyle = "#E7E7E7";
        context.fill();

        moveBall()
        movePaddle()
    }
})

let ball = {
    x: APPLICATION_WIDTH / 2 - BALL_RADIUS / 2,
    y: canvas.height / 2 + 200,
    radius: BALL_RADIUS,

}
drawBall() {
    context.beginPath();
    context.arc(APPLICATION_WIDTH / 2 - BALL_RADIUS / 2, canvas.height / 2 + 200, BALL_RADIUS, 0, 2 * Math.PI);
    context.fillStyle = "#FF6A00";
    context.fill();
}