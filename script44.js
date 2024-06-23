let canvas;
let score = { left: 0, right: 0 };
let winningScore = 7;
let lights = [];
let rotationSpeed = 0;
let lastCollisionTime = 0;
let popupImage = null;
let popupTimer = 0;
let scoreLog = [];
let settingsOpen = false;
let mic, fft;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-container');
    setupLights();
    setupAudio();
    setupKeyboardListeners();
    updateScoreDisplay();
}

function draw() {
    drawBackground();
    updateLights();
    drawLights();
    drawPopup();
    drawScoreLog();
    analyzeAudio();
}

function setupLights() {
    for (let i = 0; i < 32; i++) {
        lights.push({ color: i % 2 === 0 ? color(255, 0, 0) : color(0, 0, 255), active: false });
    }
}

function setupAudio() {
    mic = new p5.AudioIn();
    mic.start();
    fft = new p5.FFT();
    fft.setInput(mic);
}

function setupKeyboardListeners() {
    document.addEventListener('keydown', handleKeyPress);
}

function handleKeyPress(event) {
    const key = event.key;
    switch (key) {
        case '7': updateScore('left', 3, 'LX.png'); break;
        case '9': updateScore('right', 3, 'RX.png'); break;
        case '4': updateScore('left', 2, 'LO.png'); break;
        case '6': updateScore('right', 2, 'RO.png'); break;
        case '1': updateScore('left', 2, 'LB.png'); break;
        case '3': updateScore('right', 2, 'RB.png'); break;
        case '0': updateScore('left', 1, 'LS.png'); break;
        case '.': updateScore('right', 1, 'RS.png'); break;
        case '5': updateScore('left', 1, 'LOF.png'); break;
        case '+': updateScore('right', 1, 'ROF.png'); break;
        case 'Enter': playCountdownVideo(); break;
        case '/': resetScores(); break;
        case '*': toggleSettings(); break;
    }
}

function updateScore(side, points, image) {
    score[side] += points;
    popupImage = loadImage(image);
    popupTimer = 180; // 3秒間表示
    scoreLog.push(`${side} +${points}`);
    checkWinningCondition(side);
    updateScoreDisplay();
}

function checkWinningCondition(side) {
    if (score[side] >= winningScore) {
        document.getElementById(`${side}-score`).classList.add('winning-score');
    }
}

function updateScoreDisplay() {
    document.getElementById('left-score').textContent = score.left;
    document.getElementById('right-score').textContent = score.right;
}

function drawBackground() {
    let c1 = color(0, 0, 50);
    let c2 = color(0, 0, 100);
    for (let y = 0; y < height; y++) {
        let inter = map(y, 0, height, 0, 1);
        let c = lerpColor(c1, c2, inter);
        stroke(c);
        line(0, y, width, y);
    }
}

function updateLights() {
    let volume = mic.getLevel();
    rotationSpeed = map(volume, 0, 1, 0, 0.2);
    
    for (let i = 0; i < lights.length; i++) {
        let angle = map(i, 0, lights.length, 0, TWO_PI);
        angle += frameCount * rotationSpeed * (i % 2 === 0 ? 1 : -1);
        lights[i].x = width / 2 + cos(angle) * min(width, height) * 0.4;
        lights[i].y = height / 2 + sin(angle) * min(width, height) * 0.4;
        lights[i].active = random() < volume * 2;
    }
}

function drawLights() {
    for (let light of lights) {
        if (light.active) {
            fill(light.color);
            noStroke();
            ellipse(light.x, light.y, 20, 20);
        }
    }
}

function drawPopup() {
    if (popupImage && popupTimer > 0) {
        image(popupImage, width / 2 - 100, height / 2 - 100, 200, 200);
        popupTimer--;
        if (popupTimer === 0) {
            popupImage = null;
        }
    }
}

function drawScoreLog() {
    let logElement = document.getElementById('score-log');
    logElement.innerHTML = scoreLog.slice(-5).join('<br>');
}

function playCountdownVideo() {
    let video = document.createElement('video');
    video.src = document.getElementById('countdown-video').value;
    video.style.position = 'absolute';
    video.style.top = '0';
    video.style.left = '0';
    video.style.width = '100%';
    video.style.height = '100%';
    document.body.appendChild(video);
    video.play();
    video.onended = () => {
        document.body.removeChild(video);
    };
}

function resetScores() {
    score = { left: 0, right: 0 };
    scoreLog = [];
    updateScoreDisplay();
    document.getElementById('left-score').classList.remove('winning-score');
    document.getElementById('right-score').classList.remove('winning-score');
}

function toggleSettings() {
    settingsOpen = !settingsOpen;
    document.getElementById('settings-panel').classList.toggle('hidden');
}

function analyzeAudio() {
    let spectrum = fft.analyze();
    let energy = fft.getEnergy("treble");
    
    if (energy > 200 && millis() - lastCollisionTime > 500) {
        triggerCollisionEffect();
        lastCollisionTime = millis();
    }
}

function triggerCollisionEffect() {
    let startLight = floor(random(lights.length));
    let endLight = (startLight + floor(lights.length / 2)) % lights.length;
    
    stroke(255, 255, 0);
    strokeWeight(3);
    line(lights[startLight].x, lights[startLight].y, lights[endLight].x, lights[endLight].y);
    
    background(255);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// 設定パネルのイベントリスナー
document.getElementById('close-settings').addEventListener('click', toggleSettings);
document.getElementById('winning-score').addEventListener('change', (e) => {
    winningScore = parseInt(e.target.value);
});
document.getElementById('style-sheet').addEventListener('change', (e) => {
    document.body.className = e.target.value;
});

// PWA関連の設定
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
}