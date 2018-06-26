///<reference path="./libs/p5.global-mode.d.ts" />

let player;
let enemy;
let ball;

let playerVelocity = 0;
let enemyVelocity = 0;

let isPlaying = false;

let inputdata = [];
let outputdata = [];

let playerScore = 0;
let enemyScore = 0;

let trainnig_mode = true;

function setup() {
    createCanvas(900, 600);
    ball = new Ball();
    player = new Paddle(width - 40);
    enemy = new Paddle(20);
    smooth(100);
}

function draw() {
    background(232, 235, 242);
    stroke(22, 38, 61);
    strokeWeight(1);

    // outer border
    rect(0, 0, width - 1, height - 1);
    // center line
    for (i = 0; i < height; i += 9) {
        if (i % 2 == 0) line(width / 2, i, width / 2, i + 10);
    }

    stroke(170, 110, 48);
    fill(254, 193, 131);
    ball.display();

    if (isPlaying) ball.update();

    fill(235, 133, 165);
    stroke(166, 43, 82);
    enemy.display();

    stroke(22, 94, 94);
    fill(115, 201, 201);

    let d = -enemy.pos.y + ball.pos.y;

    if (d < -5) {
        enemyVelocity = -10;
    }
    else if (d > 90) {
        enemyVelocity = 10;
    } else {
        enemyVelocity = 0;
    }

    if (isPlaying) enemy.move(enemyVelocity);
    if (isPlaying) enemy.checkEdges();

    if (ball.collide(enemy.pos.x + enemy.w + ball.rx / 2, enemy.pos.y, enemy.h)) {
        ball.direction.y += enemyVelocity / 32;
    }

    if (ball.collide(player.pos.x, player.pos.y - 10, player.h + 12)) {
        ball.direction.y += playerVelocity / 32;
    }

    player.display();

    if (!trainnig_mode) {
        const _d = tf.tensor2d([
            [ball.pos.x, ball.pos.y, player.pos.y, enemy.pos.y]
        ]);
        let x2 = tfmodel.predict(_d).dataSync();
        let m = x2.indexOf(Math.max(...x2));
        if (m === 0) {
            playerVelocity = -10;
            console.log("UP");
        } else if (m === 1) {
            playerVelocity = 0;
            console.log("STAY");
        } else if (m === 2) {
            playerVelocity = 10;
            console.log("BOTTOM");
        }
    }

    if (isPlaying) player.move(playerVelocity);


    if (isPlaying && trainnig_mode) {
        let xd = [
            ball.pos.x, ball.pos.y, player.pos.y, enemy.pos.y
        ];
        let yd = playerVelocity < 0 ? [1, 0, 0] : playerVelocity > 0 ? [0, 0, 1] : [0, 1, 0];
        inputdata.push(xd);
        outputdata.push(yd);
    }


    if (isPlaying) player.checkEdges();

    if (ball.pos.x > width || ball.pos.x < 0) {

        if (ball.pos.x > width) enemyScore++;
        if (ball.pos.x < 0) playerScore++;

        player.pos.y = height / 2 - player.h / 2;
        enemy.pos.y = height / 2 - enemy.h / 2;

        ball.pos.x = width / 2;
        ball.pos.y = height / 2;
        ball.direction.x = 1;
        ball.direction.y = 1;
    }

    if (isPlaying) ball.checkEdges();
    drawScore();
}

function keyPressed() {
    if (key.toLowerCase() === 'w' || keyCode === UP_ARROW) {
        playerVelocity = -10;
    }
    if (key.toLowerCase() === 's' || keyCode === DOWN_ARROW) {
        playerVelocity = 10;
    }
    if (key.toLowerCase() === 'p') {
        isPlaying = !isPlaying;
    }

    if (key.toLowerCase() === 't') {
        isPlaying = false;
        trainnig_mode = false;
        train().then(x => { isPlaying = true; playerScore = enemyScore = 0 });
    }

}

function keyReleased() {
    if (key.toLowerCase() === 'w' || keyCode === UP_ARROW || key.toLowerCase() === 's' || keyCode === DOWN_ARROW) {
        playerVelocity = 0;
    }
}


async function train() {
    console.log('Traning Started!');
    const xs = tf.tensor2d(inputdata);
    const ys = tf.tensor2d(outputdata);
    for (let i = 0; i < 50; i++) {
        const res = await tfmodel.fit(xs, ys, { shuffle: true });
        console.log('Loss :', res.history.loss[0]);
    }
    console.log('Training Completed!');
    console.log('Saving Model');
    // const saveResult = await tfmodel.save('downloads://my-model-1')
    console.log('Model saved!');
    xs.dispose();
    ys.dispose();
}


function drawScore() {
    fill(0);
    textAlign(CENTER);
    textSize(20);
    textFont('Roboto Thin');
    // text("Press 'p' to start or pause the game.", width /2, 50);
    // text("Press 't' to start training the nn.", width / 2, 100);
    textSize(40);
    text(playerScore, player.pos.x - 80, 80);
    text(enemyScore, 80, 80);
    fill(232, 235, 242);
}
