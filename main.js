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

// TODO:
// 1. put inside class
// 2. rename score 
let nTurns = NTURNS
let remainingBricks = 100;
let SCORE = 0;




/* You fill this in, add methods */
class Paddle {
    constructor(context, x, y, width, height, moveBy) {
        this.context = context;

        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.moveBy = moveBy
        this.drawPaddle();
        this.init();

    }
    init() {
        document.addEventListener('keydown', (event) => {
            if (event.key == "ArrowRight" && this.x + this.width < APPLICATION_WIDTH) {
                this.clearPaddle();
                this.x += this.moveBy
                this.drawPaddle();

            } else if (event.key == "ArrowLeft" && this.x > 0) {
                this.clearPaddle();
                this.x -= this.moveBy
                this.drawPaddle();

            }
        })

        document.addEventListener("mousemove", (event) => {
            let mouseX = event.clientX - canvas.offsetLeft;
            if (mouseX > 0 && mouseX < canvas.width) {
                this.clearPaddle();
                this.x = mouseX - this.width / 2;
                this.drawPaddle();

            }
        })
    }
    drawPaddle() {
        context.beginPath();
        context.fillStyle = "black";
        context.fillRect(this.x, this.y, this.width, this.height);
    }
    clearPaddle() {
        context.beginPath();
        context.fillStyle = "#E7E7E7";
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}



class Ball {
    constructor(context, x, y, radius, dx, dy) {
        this.context = context
        this.x = x
        this.y = y
        this.radius = radius
        this.dx = dx
        this.dy = dy

        this.init()
    }

    init() {
        this.drawBall();
    }

    drawBall() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.fillStyle = "#FF6A00";
        context.fill();
        context.closePath();
    }

    clearBall() {
        context.rect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        context.fillStyle = "#E7E7E7";
        context.fill();
    }

    wallCollision() {
        if (this.x + this.radius > APPLICATION_WIDTH || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y - this.radius < 0) {
            this.dy = -this.dy
        }
        if (this.y + this.radius > APPLICATION_HEIGHT) {
            nTurns--
            this.clearBall();
            this.reset();
        }
    }

    reset() {
        this.x = APPLICATION_WIDTH / 2 - BALL_RADIUS / 2;
        this.y = canvas.height / 2 + 100;
        this.dy = 3;
        this.dx = 0;
        // Paddle.clearPaddle();
        // Paddle.x = APPLICATION_WIDTH / 2 - PADDLE_WIDTH / 2;
        // Paddle.y = APPLICATION_HEIGHT - PADDLE_Y_OFFSET;
        // Paddle.drawPaddle();
        // context.fillStyle = "#E7E7E7"
        // context.fillRect(APPLICATION_WIDTH - 60, 5, 30, 30)
    }

    paddleCollistion(paddle) {
        if (this.y + this.radius > paddle.y && this.y < paddle.y + paddle.height && this.x > paddle.x && this.x < paddle.x + paddle.width) {
            this.dy = -3
            if (this.x < paddle.x + 12) {
                this.dx = -3
            }
            if (this.x < paddle.x + 24 && this.x > paddle.x + 12) {
                this.dx = -1.5
            }
            if (this.x < paddle.x + 36 && this.x > paddle.x + 24) {
                this.dx = 0
            }
            if (this.x < paddle.x + 48 && this.x > paddle.x + 36) {
                this.dx = 1.5
            }
            if (this.x < paddle.x + 60 && this.x > paddle.x + 48) {
                this.dx = 3
            }
        }
    }
    run(paddle) {
        this.clearBall();
        this.x += this.dx;
        this.y += this.dy;
        this.drawBall();
        this.wallCollision();
        this.paddleCollistion(paddle);
    }
}




class Breakout {
    constructor(context) {
        this.context = context;
        this.init();
    }

    /** Sets up the Breakout program. */
    init() {
            this.background(); // drawBackground
            this.drawStart();
            this.blocks(); // drawBlocks
            this.drawEdge();
            this.createBrickBoolean()

            context.fillStyle = "black"
            context.fillText(SCORE, 60, 30)

            this.paddle = new Paddle(context, APPLICATION_WIDTH / 2 - PADDLE_WIDTH / 2, APPLICATION_HEIGHT - PADDLE_Y_OFFSET, PADDLE_WIDTH, PADDLE_HEIGHT, 10)
            this.ball = new Ball(context, APPLICATION_WIDTH / 2 - BALL_RADIUS / 2, canvas.height / 2 + 100, BALL_RADIUS, 0, 3)

            //addOnEnterKeyDown

            document.addEventListener('keydown', (event) => {
                if (event.key == "Enter") {
                    context.beginPath();
                    context.rect(130, APPLICATION_HEIGHT / 2 - 40, 143, 60);
                    context.fillStyle = "#E7E7E7";
                    context.fill();
                    let self = this
                    setInterval(() => { self.run() }, 10)

                }
            })
        }
        //background
    background() {
            canvas.width = APPLICATION_WIDTH;
            canvas.height = APPLICATION_HEIGHT;

            context.beginPath();
            context.rect(0, 0, APPLICATION_WIDTH, APPLICATION_HEIGHT);
            context.fillStyle = "#E7E7E7";
            context.fill();
        }
        //blocks
    blocks() {
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
        }
        //edge
    drawEdge() {
        context.beginPath();
        context.rect(0, 0, APPLICATION_WIDTH, APPLICATION_HEIGHT);
        context.fillStyle = "black";
        context.lineWidth = 2;
        context.stroke();
        // context.closePath();
    }

    //start
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

    createBrickBoolean() {
        this.brickBoolean = [];
        for (let i = 0; i < 10; i++) {
            this.brickBoolean.push([])
            for (let j = 1; j < 11; j++) {
                this.brickBoolean[i].push(false)
            }
        }
        this.brickX = []
        let x = 0;
        for (let i = 0; i < 10; i++) {
            this.brickX.push(x)
            x = x + BRICK_WIDTH + BRICK_SEP;
        }

        this.brickY = []
        let y = APPLICATION_HEIGHT - 450;
        for (let i = 0; i < 10; i++) {
            this.brickY.push(y)
            y = y - BRICK_HEIGHT - BRICK_SEP;
        }
    }

    brickCollision() {
        for (let i = 0; i < 10; i++) {
            if ((this.ball.y > this.brickY[i] && this.ball.y < this.brickY[i] + BRICK_HEIGHT) || (this.ball.y + this.ball.radius > this.brickY[i] && this.ball.y + this.ball.radius < this.brickY[i] + BRICK_HEIGHT) ||
                (this.ball.y + this.ball.radius * 2 > this.brickY[i] && this.ball.y + this.ball.radius * 2 < this.brickY[i] + BRICK_HEIGHT)) {

                for (let j = 0; j < 10; j++) {
                    if ((this.ball.x > this.brickX[j] && this.ball.x < this.brickX[j] + BRICK_WIDTH) || (this.ball.x + this.ball.radius > this.brickX[j] && this.ball.x + this.ball.radius < this.brickX[j] + BRICK_WIDTH) ||
                        (this.ball.x + this.ball.radius * 2 > this.brickX[j] && this.ball.x + this.ball.radius * 2 < this.brickX[j] + BRICK_WIDTH)) {
                        this.breakBrick(i, j)
                    }

                }
            }
        }
    }

    breakBrick(i, j) {
        if (this.brickBoolean[i][j] == false) {
            this.brickBoolean[i][j] = true
            this.deleteBrick(i, j)
            if (this.ball.dy < 0) { this.ball.dy = -this.ball.dy }
            this.keepScore()
        }
    }

    showLife() {
        if (nTurns >= 0) {
            context.fillStyle = "#E7E7E7"
            context.fillRect(APPLICATION_WIDTH - 60, 5, 30, 30)
            context.fillStyle = "black"
            context.fillText(nTurns, APPLICATION_WIDTH - 60, 30)
        }
    }

    keepScore() {
        if (remainingBricks > 0) {
            remainingBricks--
            context.fillStyle = "#E7E7E7";
            context.fillRect(55, 5, 70, 30)
            SCORE = SCORE + 10
            context.fillStyle = "black"
            context.fillText(SCORE, 60, 30)
                // console.log(SCORE)
        } else if (remainingBricks = 0) {
            context.beginPath();
            context.rect(0, 0, APPLICATION_WIDTH, APPLICATION_HEIGHT);
            context.fillStyle = "#E7E7E7";
            context.fill();

            context.beginPath();
            context.rect(130, APPLICATION_HEIGHT / 2 - 40, 143, 60);
            context.fillStyle = "green";
            context.fill();

            context.font = "30px Arial";
            context.fillStyle = "yellow"
            context.fillText("W O N", 150, APPLICATION_HEIGHT / 2);

            context.font = "30px Arial";
            context.strokeText("W O N", 150, APPLICATION_HEIGHT / 2);
        }

    }

    deleteBrick(i, j) {
        context.beginPath();
        context.rect(this.brickX[j], this.brickY[i], BRICK_WIDTH, BRICK_HEIGHT);
        context.fillStyle = "#E7E7E7";
        context.fill();
    }

    gameLost() {
        if (nTurns < 0) {

            context.beginPath();
            context.rect(0, 0, APPLICATION_WIDTH, APPLICATION_HEIGHT);
            context.fillStyle = "#E7E7E7";
            context.fill();

            context.beginPath();
            context.rect(130, APPLICATION_HEIGHT / 2 - 40, 143, 60);
            context.fillStyle = "red";
            context.fill();

            context.font = "30px Arial";
            context.fillStyle = "yellow"
            context.fillText("L O S T", 150, APPLICATION_HEIGHT / 2);

            context.font = "30px Arial";
            context.strokeText("L O S T", 150, APPLICATION_HEIGHT / 2);

        }
    }

    /** Runs the Breakout program. */
    run() {
        this.ball.run(this.paddle);
        this.brickCollision()
        this.gameLost()
        this.showLife()
            // this.drawEdge()
    }
}

/* ---------------------------- GAME LOGIC FINISHES HERE ---------------------------- */

const canvas = document.getElementById("game");


/* 
    maybe do stuff here ...
*/

const context = canvas.getContext('2d');



// create game here
canvas.style = "position:absolute; left: 50%; width: 400px; margin-left: -200px;"
let breakout = new Breakout(context);


/*
   call breakout.run() to start playing
   don't start until user interacts with canvas
   (you can add start button / wait until mouse is clicked or left/right arrows are pressed)
*/

// let brickBoolean = [];
// for (let i = 0; i < 10; i++) {
//     brickBoolean.push([])
//     for (let j = 1; j < 11; j++) {
//         brickBoolean[i].push(false)
//     }
// }

// let brickX = []
// let x = 0;
// for (let i = 0; i < 10; i++) {
//     brickX.push(x)
//     x = x + BRICK_WIDTH + BRICK_SEP;
// }

// let brickY = []
// y = APPLICATION_HEIGHT - 450;
// for (let i = 0; i < 10; i++) {
//     brickY.push(y)
//     y = y - BRICK_HEIGHT - BRICK_SEP;
// }




// //paddle:
// let paddle = {
//     x: APPLICATION_WIDTH / 2 - PADDLE_WIDTH / 2,
//     y: APPLICATION_HEIGHT - PADDLE_Y_OFFSET,
//     width: PADDLE_WIDTH,
//     height: PADDLE_HEIGHT,
//     moveBy: 10,
// }
// context.fillStyle = "black";
// context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

// function drawPaddle() {
//     context.beginPath();
//     context.fillStyle = "black";
//     context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
// }

// function clearPaddle() {
//     context.beginPath();
//     context.fillStyle = "#E7E7E7";
//     context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
// }
// document.addEventListener('keydown', function(event) {
//     if (event.key == "ArrowRight" && paddle.x + paddle.width < APPLICATION_WIDTH) {
//         clearPaddle();
//         paddle.x += paddle.moveBy
//         drawPaddle();
//     } else if (event.key == "ArrowLeft" && paddle.x > 0) {
//         clearPaddle();
//         paddle.x -= paddle.moveBy
//         drawPaddle();
//     }
// })



//start:
// document.addEventListener('keydown', (event) => {
//     if (event.key == "Enter") {
//         context.beginPath();
//         context.rect(130, APPLICATION_HEIGHT / 2 - 40, 143, 60);
//         context.fillStyle = "#E7E7E7";
//         context.fill();
//         setInterval(Ball.init, 15);

//     }
// })

//ball:


// let ball = {
//     x: APPLICATION_WIDTH / 2 - BALL_RADIUS / 2,
//     y: canvas.height / 2 + 100,
//     radius: BALL_RADIUS,
//     dx: 0,
//     dy: 3,
// }

// drawBall()

// function drawBall() {
//     context.beginPath();
//     context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
//     context.fillStyle = "#FF6A00";
//     context.fill();
//     context.closePath();
// }
// // E7E7E7
// function clearBall() {
//     context.beginPath();
//     context.rect(ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
//     context.fillStyle = "#E7E7E7";
//     context.fill();
//     context.closePath();
// }

// function moveBall() {

//     clearBall();
//     ball.x += ball.dx;
//     ball.y += ball.dy;
//     drawBall();
//     wallCollision();
//     ballCollision();
//     paddleCollistion();
//     showLife();
//     drawEdge()
//     gameLost()
// }


// function wallCollision() {
//     if (ball.x + ball.radius > APPLICATION_WIDTH || ball.x - ball.radius < 0) {
//         ball.dx = -ball.dx;
//     }
//     if (ball.y - ball.radius < 0) {
//         ball.dy = -ball.dy
//     }
//     if (ball.y + ball.radius > APPLICATION_HEIGHT) {

//         NTURNS--
//         clearBall();
//         reset();
//     }
// }

// function reset() {
//     ball.x = APPLICATION_WIDTH / 2 - BALL_RADIUS / 2;
//     ball.y = canvas.height / 2 + 100;
//     ball.dy = 3;
//     ball.dx = 0;
//     clearPaddle();
//     paddle.x = APPLICATION_WIDTH / 2 - PADDLE_WIDTH / 2;
//     paddle.y = APPLICATION_HEIGHT - PADDLE_Y_OFFSET;
//     drawPaddle();
//     context.fillStyle = "#E7E7E7"
//     context.fillRect(APPLICATION_WIDTH - 60, 5, 30, 30)
// }

// function paddleCollistion() {
//     if (ball.y + ball.radius > paddle.y && ball.y < paddle.y + paddle.height && ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
//         ball.dy = -3
//         if (ball.x < paddle.x + 12) {
//             ball.dx = -3
//         }
//         if (ball.x < paddle.x + 24 && ball.x > paddle.x + 12) {
//             ball.dx = -1.5
//         }
//         if (ball.x < paddle.x + 36 && ball.x > paddle.x + 24) {
//             ball.dx = 0
//         }
//         if (ball.x < paddle.x + 48 && ball.x > paddle.x + 36) {
//             ball.dx = 1.5
//         }
//         if (ball.x < paddle.x + 60 && ball.x > paddle.x + 48) {
//             ball.dx = 3
//         }
//     }
// }

// function showLife() {
//     context.fillStyle = "black"
//     context.fillText(NTURNS, APPLICATION_WIDTH - 60, 30)
// }

// function gameLost() {
//     if (nTturns <= 0) {

//         context.beginPath();
//         context.rect(0, 0, APPLICATION_WIDTH, APPLICATION_HEIGHT);
//         context.fillStyle = "#E7E7E7";
//         context.fill();

//         context.beginPath();
//         context.rect(130, APPLICATION_HEIGHT / 2 - 40, 143, 60);
//         context.fillStyle = "red";
//         context.fill();

//         context.font = "30px Arial";
//         context.fillStyle = "yellow"
//         context.fillText("L O S T", 150, APPLICATION_HEIGHT / 2);

//         context.font = "30px Arial";
//         context.strokeText("L O S T", 150, APPLICATION_HEIGHT / 2);

//     }
// }
//blocks
// var bricks = [];
// let h = APPLICATION_HEIGHT - 450;

// for (let i = 0; i < 10; i++) {
//     bricks[i] = [h]
//     let w = 1;
//     for (let j = 0; j < 10; j++) {
//         bricks[i].push(w)
//         w = w + BRICK_WIDTH + BRICK_SEP;
//     }
//     h = h - BRICK_HEIGHT - BRICK_SEP;
// }

// function brickCollisionn() {
//     console.log(ball.y, h)
//     if (ball.y < h) {
//         for (let i = 0; i < 10; i++) {
//             console.log(bricks[i])
//             if (bricks[i][0] < ball.y && ball.y > bricks[i][0] + BRICK_HEIGHT) {

//                 for (let j = 1; j < 11; j++) {
//                     if (bricks[i][j] > 0 && bricks[i][j] < ball.x && ball.x > bricks[i][j] + BRICK_WIDTH) {
//                         ball.dy = -ball.dy
//                         ball.dx = -ball.dx
//                         deleteBrick();
//                         bricks[i][j] = 0
//                         console.log(bricks[i][j])
//                     }
//                 }
//             }
//         }
//     }
// }
// let h = APPLICATION_HEIGHT - 450;
// let w = 0;

// function brickCollision() {
//     for (let i = 0; i < 10; i++) {
//         if (h < ball.y && ball.y > h + BRICK_HEIGHT)
//         w = 0;
//         for (let j = 1; j < 11; j++) {
//             w = w + BRICK_WIDTH + BRICK_SEP;
//         }
//     }
//     h = h - BRICK_HEIGHT - BRICK_SEP;
// }

// let brickBoolean = [];
// for (let i = 0; i < 10; i++) {
//     brickBoolean.push([])
//     for (let j = 1; j < 11; j++) {
//         brickBoolean[i].push(false)
//     }
// }

// let brickX = []
// let x = 0;
// for (let i = 0; i < 10; i++) {
//     brickX.push(x)
//     x = x + BRICK_WIDTH + BRICK_SEP;
// }

// let brickY = []
// y = APPLICATION_HEIGHT - 450;
// for (let i = 0; i < 10; i++) {
//     brickY.push(y)
//     y = y - BRICK_HEIGHT - BRICK_SEP;
// }


// function ballCollision() {
//     for (let i = 0; i < 10; i++) {
//         if ((ball.y > brickY[i] && ball.y < brickY[i] + BRICK_HEIGHT) || (ball.y + ball.radius > brickY[i] && ball.y + ball.radius < brickY[i] + BRICK_HEIGHT) ||
//             (ball.y + ball.radius * 2 > brickY[i] && ball.y + ball.radius * 2 < brickY[i] + BRICK_HEIGHT)) {

//             for (let j = 0; j < 10; j++) {
//                 if ((ball.x > brickX[j] && ball.x < brickX[j] + BRICK_WIDTH) || (ball.x + ball.radius > brickX[j] && ball.x + ball.radius < brickX[j] + BRICK_WIDTH) ||
//                     (ball.x + ball.radius * 2 > brickX[j] && ball.x + ball.radius * 2 < brickX[j] + BRICK_WIDTH)) {
//                     breakBrick(i, j)
//                 }

//             }
//         }
//     }
// }


// function breakBrick(i, j) {
//     if (brickBoolean[i][j] == false) {
//         brickBoolean[i][j] = true
//         deleteBrick(i, j)
//         if (ball.dy < 0) { ball.dy = -ball.dy }
//         keepScore()
//     }
// }
// let remainingBricks = 100;
// let SCORE = 0;
// context.fillStyle = "black"
// context.fillText(SCORE, 60, 30)

// function keepScore() {
//     if (remainingBricks > 0) {
//         remainingBricks--
//         context.fillStyle = "#E7E7E7";
//         context.fillRect(55, 5, 70, 30)
//         SCORE = SCORE + 10
//         context.fillStyle = "black"
//         context.fillText(SCORE, 60, 30)
//         console.log(SCORE)
//     } else if (remainingBricks = 0) {
//         context.beginPath();
//         context.rect(0, 0, APPLICATION_WIDTH, APPLICATION_HEIGHT);
//         context.fillStyle = "#E7E7E7";
//         context.fill();

//         context.beginPath();
//         context.rect(130, APPLICATION_HEIGHT / 2 - 40, 143, 60);
//         context.fillStyle = "green";
//         context.fill();

//         context.font = "30px Arial";
//         context.fillStyle = "yellow"
//         context.fillText("W O N", 150, APPLICATION_HEIGHT / 2);

//         context.font = "30px Arial";
//         context.strokeText("W O N", 150, APPLICATION_HEIGHT / 2);
//     }

// }

// function deleteBrick(i, j) {
//     context.beginPath();
//     context.rect(brickX[j], brickY[i], BRICK_WIDTH, BRICK_HEIGHT);
//     context.fillStyle = "#E7E7E7";
//     context.fill();
// }