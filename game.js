const section3 = document.getElementById('section3');
const scoreDisplay = document.createElement('div');
scoreDisplay.classList.add('score-display');
section3.appendChild(scoreDisplay);

let score = 0;
const updateScore = () => {
    score++;
    scoreDisplay.innerHTML = `Score:${score} <span id="heartSymbol">&#x2764;</span>`;
};

window.addEventListener('load', () => {
    displayImages();
    startHeartsFalling();
    startScoring();
});


const heartElements = document.querySelectorAll('.heart');
const assertImage = document.getElementById('assertImage');
const gameOverText = document.createElement('div');
gameOverText.textContent = 'Moving On!';
gameOverText.classList.add('game-over-text');
const gameWonText = document.createElement('div');
gameWonText.textContent = "Blissful Victory";
gameWonText.classList.add('game-won-text');

let gameOver = false;
let assertMoveEnabled = true;
let heartSpeed = 1.0;
const maxSpeed = 1.8;
const speedIncreaseInterval = 4000;

function displayImages() {
    const crushImageBase64 = sessionStorage.getItem('crushImage');
    const assertImageBase64 = sessionStorage.getItem('assertImage');

    const crushImageElement = document.getElementById('crushImage');
    const assertImageElement = document.getElementById('assertImage');

    if (crushImageBase64 && assertImageBase64) {
        crushImageElement.src = crushImageBase64;
        assertImageElement.src = assertImageBase64;
    } else {
        crushImageElement.src = './images/crush.jpg';
        assertImageElement.src = './images/assert.png';
    }
}

function startHeartsFalling() {
    const crushImageBounds = crushImage.getBoundingClientRect(); // Get crush image bounds
    const crushImageWidth = crushImageBounds.width;
    const crushImageLeft = crushImageBounds.left;
    const crushImageRight = crushImageBounds.right;
    const screenWidth = window.innerWidth;

    heartElements.forEach((heart, index) => {
        const randomX = Math.floor(Math.random() * (crushImageWidth - heart.offsetWidth));
        const randomY = -Math.floor(Math.random() * crushImageBounds.height);
        heart.style.left = `${randomX}px`;
        heart.style.top = `${crushImageBounds.top + randomY}px`; 

        heart.fallInterval = setInterval(() => {
            if (!gameOver) {
                const heartBounds = heart.getBoundingClientRect();

                if (heartBounds.bottom < crushImageBounds.bottom) { 
                    const newY = heart.offsetTop + heartSpeed;
                    heart.style.top = `${newY}px`;

                    // Check collision with assert image
                    const assertBounds = assertImage.getBoundingClientRect();
                    if (isColliding(heartBounds, assertBounds)) {
                        gameOver = true;
                        assertMoveEnabled = false;
                        endGame();
                    }
                } else {
                    const newX =Math.floor(Math.random() * (crushImageWidth - heart.offsetWidth));
                    const newY = -heart.offsetHeight;
                    heart.style.left = `${newX}px`; 
                    heart.style.top = `${crushImageBounds.top + newY}px`; 
                }
            }
        }, 10);
    });

    speedIncreaseIntervalId = setInterval(() => {
        if (heartSpeed < maxSpeed) {
            heartSpeed += 0.2;
        }
        if (heartSpeed >= maxSpeed) {
            gameOver = true;
            assertMoveEnabled = false;
            gameWon();
        }
    }, speedIncreaseInterval);
}

function isColliding(rect1, rect2) {
    return !(
        rect1.right-20 < rect2.left-5 ||
        rect1.left-5 > rect2.right-20 ||
        rect1.bottom-18 < rect2.top||
        rect1.top> rect2.bottom-12
    );
}


function gameWon() {
    document.body.appendChild(gameWonText);
    //new game
    heartSpeed = 1;
    // Clear intervals
    clearInterval(scoringInterval);
    heartElements.forEach((heart, index) => {
        clearInterval(heart.fallInterval);
    });
    clearInterval(speedIncreaseIntervalId); 
    const newGameButton = document.createElement('button');
    newGameButton.textContent = 'New Game';
    newGameButton.classList.add('new-game');
    newGameButton.addEventListener('click', startNewGame);
    section3.appendChild(newGameButton); 

    //exit
    const exitButton = document.createElement('button');
    exitButton.textContent = 'Exit';
    exitButton.classList.add('exit-game');
    exitButton.addEventListener('click', exitGame);
    section3.appendChild(exitButton); 

    startScoring(true);
}


function endGame() {
    document.body.appendChild(gameOverText);
    //new game
    heartSpeed = 1;
    // Clear intervals
    clearInterval(scoringInterval);
    heartElements.forEach((heart, index) => {
        clearInterval(heart.fallInterval);
    });
    clearInterval(speedIncreaseIntervalId); 
    const newGameButton = document.createElement('button');
    newGameButton.textContent = 'New Game';
    newGameButton.classList.add('new-game');
    newGameButton.addEventListener('click', startNewGame);
    section3.appendChild(newGameButton); 

    //exit
    const exitButton = document.createElement('button');
    exitButton.textContent = 'Exit';
    exitButton.classList.add('exit-game');
    exitButton.addEventListener('click', exitGame);
    section3.appendChild(exitButton); 

    startScoring(true);
}


function exitGame() {
    window.location.href = 'index.html'; 
}


function startNewGame() {
    const bywon = document.querySelector('.game-won-text');
    if(bywon)
        document.body.removeChild(gameWonText);
    const byend = document.querySelector('.game-over-text');
    if(byend)
        document.body.removeChild(gameOverText);
    const newGameButton = document.querySelector('.new-game');
    if (newGameButton) {
        section3.removeChild(newGameButton);
    }
    const exitButton = document.querySelector('.exit-game');
    if (exitButton) {
        section3.removeChild(exitButton);
    }
     //new game
     heartSpeed = 1;
     // Clear intervals
     clearInterval(scoringInterval);
     heartElements.forEach((heart, index) => {
         clearInterval(heart.fallInterval);
     });
     clearInterval(speedIncreaseIntervalId);
    gameOver = false;
    assertMoveEnabled = true;
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    startHeartsFalling();
    startScoring(false);
}

let scoringInterval; 
function startScoring(boolean) {
    if (!boolean) {
        scoringInterval = setInterval(updateScore, 1000); 
    } else {
        clearInterval(scoringInterval);
    }
}

assertImage.addEventListener("touchstart", function(event) {
    if (!gameOver) {
        initialX = event.touches[0].clientX;
        event.preventDefault();
    }
});

assertImage.addEventListener("touchmove", function(event) {
    if (!gameOver && assertMoveEnabled) {
        if (initialX === null) {
            return;
        }
        var currentX = event.touches[0].clientX;
        var diffX = currentX - initialX;

        if (diffX < 0) {
            moveLeft(Math.abs(diffX));
        } else if (diffX > 0) {
            moveRight(diffX);
        }

        initialX = currentX;
        event.preventDefault();
    }
});

document.addEventListener("keydown", function(event) {
    if (!gameOver && assertMoveEnabled) {
        if (event.key === "ArrowLeft") {
            moveLeft(10);
        } else if (event.key === "ArrowRight") {
            moveRight(10);
        }
    }
});


const crushImage = document.getElementById('crushImage');

function moveLeft(distance) {
    var leftLimit = crushImage.offsetLeft;
    var leftvalue = parseFloat(assertImage.style.left || 0) - distance;
    if (leftvalue > leftLimit) 
        assertImage.style.left = leftvalue + 'px';
}

function moveRight(distance) {
    var crushWidth = crushImage.offsetWidth;
    var rightLimit = crushImage.offsetLeft + crushWidth - assertImage.offsetWidth;
    var rightvalue = parseFloat(assertImage.style.left || 0) + distance;
    if (rightvalue < rightLimit)
        assertImage.style.left = rightvalue + 'px';
}
