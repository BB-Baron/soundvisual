let mic;
let fft;
let angleStep;
let arcLength;
let threshold = 0.1;
let leftScore = 0;
let rightScore = 0;
let arcs = [];
let particles = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    angleStep = TWO_PI / 16;
    arcLength = PI / 16;
    
    mic = new p5.AudioIn();
    mic.start();
    
    fft = new p5.FFT();
    fft.setInput(mic);
    
    for (let i = 0; i < 16; i++) {
        arcs.push({ 
            angle: i * angleStep,
            color: color(100)
        });
    }
    
    document.getElementById('left-score').textContent = leftScore;
    document.getElementById('right-score').textContent = rightScore;
}

function draw() {
    background(0);
    
    translate(width / 2, height / 2);
    
    stroke(0, 0, 255, 50);
    strokeWeight(2);
    line(-width / 2, 0, width / 2, 0);
    line(0, -height / 2, 0, height / 2);
    
    let spectrum = fft.analyze();
    let volume = mic.getLevel();
    
    noFill();
    strokeWeight(16);
    
    for (let i = 0; i < arcs.length; i++) {
        let arcColor = arcs[i].color;
        stroke(arcColor);
        arc(0, 0, width * 0.75, height * 0.75, arcs[i].angle, arcs[i].angle + arcLength);
    }
    
    if (volume > threshold) {
        let index = frameCount % arcs.length;
        arcs[index].color = color(255, 0, 0, 150);
        arcs[(index + 8) % arcs.length].color = color(0, 0, 255, 150);
    } else {
        for (let arc of arcs) {
            arc.color = color(100);
        }
    }
    
    if (spectrum[1200] > threshold * 255) {
        let particle = {
            x: 0,
            y: 0,
            angle: random(TWO_PI),
            lifespan: 0.6 * 60,
        };
        particles.push(particle);
        
        background(255);
    }
    
    for (let i = particles.length - 1; i >= 0; i--) {
        stroke(255);
        strokeWeight(2);
        line(particles[i].x, particles[i].y, particles[i].x + cos(particles[i].angle) * 20, particles[i].y + sin(particles[i].angle) * 20);
        
        particles[i].lifespan--;
        
        if (particles[i].lifespan <= 0) {
            particles.splice(i, 1);
        }
    }
    
    handleKeys();
}

function handleKeys() {
    if (keyIsDown(ENTER)) {
        showCountdown();
    }
    
    if (keyIsDown(49)) {
        updateScore('left', 1, 'spin');
    }
    
    if (keyIsDown(54)) {
        updateScore('right', 1, 'spin');
    }
    
    if (keyIsDown(50)) {
        updateScore('left', 2, 'burst');
    }
    
    if (keyIsDown(55)) {
        updateScore('right', 2, 'burst');
    }
}

function updateScore(side, points, type) {
    if (side === 'left') {
        leftScore += points;
        document.getElementById('left-score').textContent = leftScore;
        showImage(type + 'L');
    } else {
        rightScore += points;
        document.getElementById('right-score').textContent = rightScore;
        showImage(type + 'R');
    }
}

function showImage(type) {
    let img = createImg(type + '.png');
    img.position(width / 2 - img.width / 2, height / 2 - img.height / 2);
    setTimeout(() => img.remove(), 3000);
}

function showCountdown() {
    const messages = ['Ready', '3', '2', '1', 'Go', 'Shoot!'];
    let idx = 0;
    let interval = setInterval(() => {
        if (idx < messages.length) {
            let countdown = createDiv(messages[idx]);
            countdown.position(width / 2 - countdown.width / 2, height / 2 - countdown.height / 2);
            setTimeout(() => countdown.remove(), 1000);
            idx++;
        } else {
            clearInterval(interval);
        }
    }, 1000);
}
