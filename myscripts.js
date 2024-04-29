let canvasWidth = 800;
let canvasHeight = 600;

var player; // player
var playerXPosition = canvasWidth / 2 - 30; // X coordinates
var playerYPosition = canvasHeight / 2 - 30; // Y coordinates
var spaceShip = new Image();
spaceShip.src = 'img/img.png';
this.rotation = 0;
var boost = false;
var speed = 4;

var gravity = 0;
var interval = setInterval(updateCanvas, 20);

// Key tracking
var keys = {};

// key pressed
document.addEventListener('keydown', function(event) {
    keys[event.keyCode] = true;
    if (event.keyCode === 32) { // Space key for boosting
        boost = true;
    }
});

document.addEventListener('keyup', function(event) {
    delete keys[event.keyCode];
    if (event.keyCode === 32) { // Space key for boosting
        boost = false;
    }
});


// start game function
function startGame() {
    gameCanvas.start();
    player = new createPlayer(50, 50); // creates a new player
}

// defines the game field with canvas
// store the data of a canvas
var gameCanvas = {
    canvas: document.createElement("canvas"), start: function () {
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    }

}

// function create player
function createPlayer(width, height) {
    this.width = width;
    this.height = height;
    this.x = playerXPosition;
    this.y = playerYPosition;

    this.draw = function () {
        const ctx = gameCanvas.context;
        ctx.save(); // Save the current context state
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2); // Move context to center of the image
        ctx.rotate(this.rotation); // Rotate context
        if (spaceShip.complete) {
            ctx.drawImage(spaceShip, -this.width / 2, -this.height / 2, this.width, this.height);
        } else {
            spaceShip.onload = () => {
                ctx.drawImage(spaceShip, -this.width / 2, -this.height / 2, this.width, this.height);
            };
        }
        ctx.restore(); // Restore context to its original state
    };


    // this.makeFall = function () {   IF GRAVITY IS NEEDED
    //     this.y += gravity;
    //     gravity += 0.1;

    //     this.stopPlayer();
    // }

    this.stopPlayer = function () {
        var ground = canvasHeight - this.height;
        var top = 0;
        var leftSide = 0;
        var rightSide = canvasWidth - this.width;
        if (this.y > ground ) {
            this.y = ground;
        }
        else if (this.y < top) {
            this.y = top;
        }
        else if (this.x > rightSide) {
            this.x = rightSide;
        }
        else if (this.x < leftSide) {
            this.x = leftSide;
        }
    }

    this.movePlayer = function() {
        var speed = boost ? 8 : 4; // Use ternary operator for clarity
    
        if (keys[37]) { // Left arrow
            this.x -= speed;
            this.rotation = -Math.PI / 2; // Rotate 90 degrees to the left
        }
        if (keys[39]) { // Right arrow
            this.x += speed;
            this.rotation = Math.PI / 2; // Rotate 90 degrees to the right
        }
        if (keys[38]) { // Up arrow
            this.y -= speed;
            this.rotation = 0; // Original rotation
        }
        if (keys[40]) { // Down arrow
            this.y += speed;
            this.rotation = Math.PI; // Rotate 180 degrees
        }
        // Add diagonal movement rotation adjustments
        if (keys[40] && keys[39]) { // Down + Right arrow
            this.rotation = 3 * Math.PI / 4; // Rotate 135 degrees clockwise
        }
        if (keys[40] && keys[37]) { // Down + Left arrow
            this.rotation = 5 * Math.PI / 4; // Rotate 225 degrees clockwise
        }
        if (keys[38] && keys[39]) { // Up + Right arrow
            this.rotation = Math.PI / 4; // Rotate 45 degrees clockwise
        }
        if (keys[38] && keys[37]) { // Up + Left arrow
            this.rotation = 7 * Math.PI / 4; // Rotate 315 degrees clockwise
        }
        this.stopPlayer();
    };

}

function updateCanvas() {
    ctx = gameCanvas.context;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    // player.makeFall();
    player.movePlayer();
    player.draw();

}


