// ----------------------------- initialisation of variables --------------------------------------------------------
const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const maxScoreText = document.querySelector("#maxScoreText");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const paddle1Color = "#f2f2f2";
const paddle2Color = "white";
const paddleBorder = "black";
const ballColor = "white";
const ballBorderColor = "black";
const ballRadius = 2;
const paddleSpeed = 20;
let running = false;
let intervalId ;
let ballSpeed = 1;
let ballX = gameWidth/2;
let ballY = gameHeight/2;
let ballXDirection =0;
let ballYdirection =0;
let player1Score =0;
let player2Score = 0;
let maxScore = 0;
let winner= "player1";
let winscore=0;
let paddle1 = {
    width : 25,
    height : 5,
    x: 0,
    y : 0

}
let paddle2 = {
    width : 25,
    height : 5,
    x: 0,
    y : gameHeight-5

}


// ------------------------------------------ Handeling ENTER key to start the game ---------------------------------
// Function to handle key press events
function handleKeyPress(event) {
    if (event.key === 'Enter' && !running) {
      running = true;
      gameStart();
    }
  }
// Add event listener to the document
  document.addEventListener('keypress', handleKeyPress);



// ----------------------------------------- Add event listener for paddles -------------------------------------------
  window.addEventListener("keydown", changeDirection);

// =====================================  Start Function ============================================
function gameStart(){
    createBall();
    nextTick();

};

// ======================Function to specify the events happening just after the game gets start ============================
function nextTick(){
    intervalId = setTimeout(() => {
        clearBoard();
        drawPaddles();
        moveBall();
        drawBall(ballX, ballY);
        checkCollision();
        nextTick();
    }, 10)
};

// =====================================  to draw the main game area =====================================
function clearBoard(){
    const gradient = ctx.createRadialGradient(170, 150, 10, 160, 100, 200);
    gradient.addColorStop(0, "#1b2735");
    gradient.addColorStop(0.9, "#090a0f");
    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,gameWidth,gameHeight);
};

// =======================================  To draw the rods ================================================
function drawPaddles(){
    ctx.strokeStyle = paddleBorder;
    
    ctx.fillStyle = paddle1Color;
    ctx.fillRect(paddle1.x , paddle1.y , paddle1.width , paddle1.height);
    ctx.strokeRect(paddle1.x , paddle1.y , paddle1.width , paddle1.height);

    ctx.fillStyle = paddle2Color;
    ctx.fillRect(paddle2.x , paddle2.y , paddle2.width , paddle2.height);
    ctx.strokeRect(paddle2.x , paddle2.y , paddle2.width , paddle2.height);
};

// ====================================  to specify the properties of ball ===================================
function createBall(){
    ballSpeed = 0.5;
    if(Math.round(Math.random()) == 1){
        ballXDirection =  1; 
    }
    else{
        ballXDirection = -1; 
    }
    if(Math.round(Math.random()) == 1){
        ballYdirection = Math.random() * 1; //more random directions
    }
    else{
        ballYdirection = Math.random() * -1; //more random directions
    }
    ballX = gameWidth / 2;
    ballY = gameHeight / 2;
    drawBall(ballX, ballY);
};

// ===================================== to specify the path of ball ======================================
function moveBall(){
    ballX += (ballSpeed * ballXDirection);
    ballY += (ballSpeed * ballYdirection);
};

// ===================================== to draw the ball ==========================================
function drawBall(ballX,ballY){
    ctx.fillStyle = ballColor;
    ctx.beginPath();
    ctx.arc(ballX , ballY , ballRadius , 0 , 2* Math.PI);
    ctx.fill();
};

// ======================================  to check the condition of collision ==========================
function checkCollision(){
    if(ballX <=0 + ballRadius){
        ballXDirection *= -1;
    }
    if(ballX >= gameWidth - ballRadius){
        ballXDirection *= -1;
    }

    if(ballY <= 0){
        // player2Score+=1;
        // updateScore();
        // createBall();
        // return;
        resetGame();
    }
    if(ballY >= gameHeight){
        // player1Score+=1;
        // updateScore();
        // createBall();
        // return;
        resetGame();
    }
    if(ballY <= (paddle1.y + paddle1.height + ballRadius)){
        if(ballX > paddle1.x && ballX < paddle1.x + paddle1.width){
            ballY = (paddle1.y + paddle1.height) + ballRadius; // if ball gets stuck
            ballYdirection *= -1;
            ballSpeed+= 0.1;
            player1Score+=1;
            updateScore();
        }
    }

    if(ballY >= (paddle2.y - ballRadius)){
        if(ballX > paddle2.x && ballX < paddle2.x + paddle2.width){
            ballY = paddle2.y - ballRadius; // if ball gets stuck
            ballYdirection *= -1;
            ballSpeed+= 0.1;
            player2Score+=1;
            updateScore();
        }
    }
};

// ==================================  to move the rods ====================================================
function changeDirection(event){
    const keyPressed = event.keyCode;
    const paddleRight = 68;
    const paddleLeft = 65;

    switch(keyPressed){
        case(paddleRight):
        {if(paddle1.x < (gameWidth - paddle1.width ) && paddle2.x< gameWidth - paddle2.width ){
        paddle1.x += paddleSpeed;
        paddle2.x += paddleSpeed;
        }
        break;
    }

    case(paddleLeft):
        {if(paddle1.x > 0 && paddle2.x> 0){
        paddle1.x -= paddleSpeed;
        paddle2.x -= paddleSpeed;
        }
        break;
    }

    }
};

// ===================================== to update the scores ==============================
function updateScore(){
    localStorage.setItem("max", maxScore); // local storage property to score the maximum score;
    winscore = localStorage.getItem("max");
    scoreText.textContent = `${player1Score} : ${player2Score}`;
    maxScore = player1Score>=player2Score ? player1Score : player2Score;
    winner = player1Score>=player2Score ? "player1" : "player2";
    if(maxScore>=winscore){
    maxScoreText.textContent = `max: ${maxScore}`;
    localStorage.setItem("max", maxScore);
    winscore = localStorage.getItem("max");
}
  else{
    maxScore = winscore;
    maxScoreText.textContent = `max: ${winscore}`;
  }  
    
};

// ====================================== to reset the game ===================================================
function resetGame(){
    window.alert(`The max score is ${winscore} by ${winner}`);
    player1Score = 0;
    player2Score = 0;
     paddle1 = {
        width : 25,
        height : 5,
        x: 0,
        y : 0
    
    }
     paddle2 = {
        width : 25,
        height : 5,
        x: 0,
        y : gameHeight-5
    
    }

    ballSpeed = 0.5;
    ballX = 0;
    ballY = 0;
    ballXDirection = 0;
    ballYdirection = 0;
    updateScore();
    clearInterval(intervalId);
    gameStart();


};

