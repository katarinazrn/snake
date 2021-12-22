let body = [];

let topPosition;
let leftPosition;

let appleTopPosition;
let appleLeftPostiion;

let arrowLeft = false;
let arrowRight = false;
let arrowDown = false;
let arrowUp = false;

let interval;

let count = 0;

let speed = 300;

let pause = false;

let lostSound = new Audio("./mixkit-arcade-retro-game-over-213.wav");
let pointSound = new Audio("./mixkit-fairy-arcade-sparkle-866.wav");


function resetArrows() {
    arrowLeft = false;
    arrowRight = false;
    arrowDown = false;
    arrowUp = false;
}

function initialize() {
    document.getElementById("container").innerHTML =
        "<div id='head'></div><div id='apple'></div>";
    positionApple();
    topPosition = 20;
    leftPosition = 20;
    resetArrows();
    body = [];
    pause = false
    count = 0
    document.getElementById('score').innerHTML = count
    initDifficulty()
    interval = setInterval(steps, speed);
}

function steps() {
    move();
    checkIfLost();
    checkIfAppleEaten();
}

function initDifficulty() {
    let radios = document.getElementsByName('difficulty');
    for (let i = 0; i < radios.length; i++) {
        document.getElementsByName('difficulty')[i].style.border = 'none'
    }
    document.getElementsByName('difficulty')[0].style.border = "2px solid rgba(0, 255, 170, 0.5)"
    speed = 500
    for (let i = 0; i < radios.length; i++) {
        document.getElementsByName('difficulty')[i].addEventListener("click", (e) => {
            if (e.target.value == "easy") {
                speed = 300;
                changeDifficulty(0)
            }
            else if (e.target.value == "normal") {
                speed = 70
                changeDifficulty(1)
            }
            else if (e.target.value == "hard") {
                speed = 30
                changeDifficulty(2)
            }
        })
    }
}

function changeDifficulty(type = 0) {
    clearInterval(interval)
    interval = setInterval(steps, speed);
    document.getElementById("container").focus()
    let radios = document.getElementsByName('difficulty');
    for (let i = 0; i < radios.length; i++) {
        document.getElementsByName('difficulty')[i].blur()
        document.getElementsByName('difficulty')[i].style.border = 'none'
    }
    document.getElementsByName('difficulty')[type].style.border = "2px solid rgba(0, 255, 170, 0.5)"
}

document.addEventListener("keydown", (e) => {
    let key = e.code;

    switch (key) {
        case "ArrowUp":
            resetArrows();
            arrowUp = true;
            break;
        case "ArrowDown":
            resetArrows();
            arrowDown = true;
            break;
        case "ArrowLeft":
            resetArrows();
            arrowLeft = true;
            break;
        case "ArrowRight":
            resetArrows();
            arrowRight = true;
            break;
        case "Space":
            if (!((overBorder() || collided()))) {
                togglePause();
            }
            break;
        default:
            break;
    }
});

function togglePause() {
    if (pause == false) {
        pause = true;
        clearInterval(interval);
        let pauseScreen = document.createElement("div");
        pauseScreen.id = "pause";
        pauseScreen.innerHTML =
            "<p><span>PAUSE</span></br>press space to resume</p>";
        document.body.appendChild(pauseScreen);
    } else {
        pause = false;
        interval = setInterval(steps, speed);
        document.body.removeChild(document.getElementById("pause"));
    }
}

function distance(x1, y1, x2, y2) {
    let pom = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
    return Math.sqrt(pom);
}

function positionApple() {

    let i;
    let positioning = true;
    while (positioning) {
        appleTopPosition = Math.floor(Math.random() * 380 + 10);
        appleLeftPostiion = Math.floor(Math.random() * 380 + 10);
        if (body.length == 0) {
            positioning = false;
            break;
        }
        for (i = 0; i < body.length; i++) {
            if (distance(appleTopPosition, appleLeftPostiion, body[i].topP, body[i].leftP) < 10) {
                positioning = true;
                break;
            }
        }
        if(i==body.length){
            positioning=false;
        }
    }
    document.getElementById("apple").style.top = appleTopPosition + "px";
    document.getElementById("apple").style.left = appleLeftPostiion + "px";
}

function move() {
    let oldHeadT = topPosition;
    let oldHeadL = leftPosition;

    if (arrowDown) {
        topPosition = topPosition + 10;
    } else if (arrowUp) {
        topPosition = topPosition - 10;
    } else if (arrowLeft) {
        leftPosition = leftPosition - 10;
    } else if (arrowRight) {
        leftPosition = leftPosition + 10;
    }

    if (body.length > 0) {
        body.splice(0, 0, {
            topP: oldHeadT,
            leftP: oldHeadL,
        });
        body.pop();
    }

    let element = document.getElementById("head");
    element.style.top = topPosition + "px";
    element.style.left = leftPosition + "px";

    for (let i = 0; i < body.length; i++) {
        body[i];
    }

    for (let i = 0; i < body.length; i++) {
        document.getElementById(i + "").style.display = "block"
        document.getElementById(i + "").style.borderRadius = "0"
        document.getElementById(i + "").style.top = body[i].topP + "px";
        document.getElementById(i + "").style.left = body[i].leftP + "px";
    }
    if (body.length > 0) {
        document.getElementById((body.length - 1) + "").style.borderRadius = "30%"
    }
}

function overBorder() {
    if (
        topPosition < 0 ||
        topPosition > 390 ||
        leftPosition < 0 ||
        leftPosition > 390
    ) {
        return true;
    } else {
        return false;
    }
}

function collided() {
    for (let i = 0; i < body.length; i++) {
        if (distance(body[i].topP, body[i].leftP, topPosition, leftPosition) < 10) {
            return true;
        }
    }
    return false;
}

function checkIfLost() {
    if (overBorder() || collided()) {
        lostSound.pause()
        lostSound.currentTime=0
        lostSound.play()
        document.getElementById("container").innerHTML =
            "<div id='gameOver'><p>GAME OVER</p>" +
            "<button id='newGame'>New Game</button></div>";
        clearInterval(interval);
        document
            .getElementById("newGame")
            .addEventListener("click", initialize);
    }
}

function checkIfAppleEaten() {
    if (
        distance(
            topPosition,
            leftPosition,
            appleTopPosition,
            appleLeftPostiion
        ) < 10
    ) {
        pointSound.pause()
        pointSound.currentTime=0
        pointSound.play()
        prolong();
        positionApple();
        count++;
        document.getElementById("score").innerHTML = count
    }
}

function prolong() {
    body.push({
        topP: topPosition,
        leftP: leftPosition,
    });
    let part = document.createElement("div");
    part.id = body.length - 1 + "";
    part.className = "snakeBody";
    part.style.display = "none"
    document.getElementById("container").appendChild(part);
}