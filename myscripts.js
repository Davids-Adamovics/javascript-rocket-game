let canvasWidth = 800;
let canvasHeight = 600;

var player;
var playerXPosition = canvasWidth / 2 - 30;
var playerYPosition = canvasHeight / 2 - 30;
var spaceShip = new Image();
spaceShip.src = 'img/img.png';
var rotation = 0; // Assuming this should not be 'this.rotation'
var boost = false;
var speed = 4;
let boostAmount = 100; // Correctly initialized and globally accessible
var boostLabel;

var gravity = 0;
var interval = setInterval(updateCanvas, 20);

// Key tracking
var keys = {};

// key pressed
document.addEventListener('keydown', function (event) {
    keys[event.keyCode] = true;
    if (event.keyCode === 32) { // Space key for boosting
        if (boostAmount > 0 && !boost) { // Only enable boost if there's amount left and not already boosting
            boost = true;
        }
    }
});

// Key released
document.addEventListener('keyup', function (event) {
    delete keys[event.keyCode];
    if (event.keyCode === 32) { // Space key for boosting
        boost = false;
    }
});


// start game function
function startGame() {
    gameCanvas.start();
    player = new createPlayer(50, 50);  // creates a new player
    boostLabel = new createBoostLabel(10, 30);  // creates a new label for displaying boost
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

        // Check vertical boundaries
        if (this.y > ground) {
            this.y = ground;
        }
        if (this.y < top) {
            this.y = top;
        }

        // Check horizontal boundaries
        if (this.x > rightSide) {
            this.x = rightSide;
        }
        if (this.x < leftSide) {
            this.x = leftSide;
        }
    }


    this.movePlayer = function () {
        var speed = boost ? 8 : 4; // Use ternary operator for clarity
        boost ? boostAmount-- : boostAmount+= 0.5;
        if(boostAmount>100) boostAmount = 100;
        if(boostAmount<0) boostAmount = 0;

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
    manageBoost();
    player.draw();
    boostLabel.draw();

}

function createBoostLabel(x, y) {
    this.x = x;
    this.y = y;
    this.draw = function() {
        ctx = gameCanvas.context;
        ctx.font = "25px Marker Felt";  // Setting font for the text
        ctx.fillStyle = "black";  // Setting text color
        this.text = "Boost: " + boostAmount;  // Setting text to show current boost amount
        ctx.fillText(this.text, this.x, this.y);  // Drawing the text
    }
}

// Function to manage boost usage
function manageBoost() {
    if (boost && boostAmount > 0) {
        boostAmount--; // Decrement boost amount continuously while boosting
    }
    if (boostAmount <= 0) {
        boost = false; // Automatically stop boosting when no boost amount left
        boostAmount = 0; // Ensure boost amount doesn't go negative
    }
}




