// ============== CANVAS ==============
let canvasWidth = 800;
let canvasHeight = 600;
var boostLabel;
var interval = setInterval(updateCanvas, 20);
var points = 0;
// ============== Player ==============
var player;
var playerXPosition = canvasWidth / 2 - 30; //player spawn location
var playerYPosition = canvasHeight / 2 - 30; //player spawn location
var spaceShip = new Image();
spaceShip.src = 'img/img.png';
var rotation = 0; // Assuming this should not be 'this.rotation'
var boost = false;
var speed = 4;
let boostAmount = 100; // Correctly initialized and globally accessible

// ============== Meteorite ==============
var meteorImg = new Image();
meteorImg.src = 'img/metor.png';
var meteorite;
var gravity = 0;
var meteoriteXposition = 0;
var meteoriteYposition = 0;
var alive = true;

// ============== Keys ==============
var keys = {}; // Key tracking
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
document.addEventListener('keydown', function(event) {
    if (event.keyCode === 13) {  // Enter key
        restartGame();
    }
});

function restartGame() {
    // Reset player, meteorites, and other necessary game state before restarting
    playerXPosition = canvasWidth / 2 - 30;
    playerYPosition = canvasHeight / 2 - 30;
    boostAmount = 100;
    allmeteorites = []; // Clear existing meteorites
    alive = true; // Set game state to alive
    interval = setInterval(updateCanvas, 20); // Restart game loop
    startGame();
}

// start game function
var allmeteorites = []; // Move this to a more global scope if necessary
var meteoriteCreationInterval;

function startGame() {
    gameCanvas.start();
    player = new createPlayer(50, 50); // Resets the player
    boostLabel = new createBoostLabel(10, 30);

    // Clear any existing meteorite creation interval
    clearInterval(meteoriteCreationInterval);

    // Set an interval to continuously spawn meteorites
    meteoriteCreationInterval = setInterval(function() {
        if (alive) { // Check if the game is still on
            let meteorite = new createMetorite(50, 50);
            allmeteorites.push(meteorite);
            points++;
        } else {
            clearInterval(meteoriteCreationInterval); // Stop creating meteorites if not alive
        }
    }, 500); // Adjust the interval as needed for game balance
}


function endGame() {
    gameCanvas.end();
    alive = false; // Assuming 'alive' variable tracks if the game is running
    clearInterval(interval); // Stop the game loop
    
}

function startScreen() {

}



// defines the game field with canvas
// store the data of a canvas
var gameCanvas = {
    canvas: document.createElement("canvas"),
    context: null,

    start: function () {
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    },

    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    end: function(){
        this.clear();
        this.context.fillStyle = "darkgrey";
        this.context.font = "30px Arial";
        this.context.fillStyle = "white";
        this.context.textAlign = "center";
        this.context.fillText("Game Over", this.canvas.width / 2, this.canvas.height / 2 - 40);
        this.context.fillText("Points: " + points, this.canvas.width / 2, this.canvas.height / 2);
        this.context.fillText("Press Enter to Restart", this.canvas.width / 2, this.canvas.height / 2 + 40);
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

    this.stopPlayer = function () { // borders
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
        boost ? boostAmount-- : boostAmount += 0.5;
        if (boostAmount > 100) boostAmount = 100;
        if (boostAmount < 0) boostAmount = 0;

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

function createMetorite(width, height) {
    this.width = width;
    this.height = height;
    var xyCoordinatesStart = randomMeteoriteStartLocation();
    this.xstart = xyCoordinatesStart["x"];
    this.ystart = xyCoordinatesStart["y"];
    var xyCoordinatesEnd = randomMeteoriteEndLocation();
    this.xend = xyCoordinatesEnd["x"];
    this.yend = xyCoordinatesEnd["y"];


    this.draw = function () {
        const ctx = gameCanvas.context;
        ctx.save(); // Save the current context state
        ctx.translate(this.xstart + this.width / 2, this.ystart + this.height / 2); // Move context to center of the image
        ctx.rotate(this.rotation); // Rotate context
        if (spaceShip.complete) {
            ctx.drawImage(meteorImg, -this.width / 2, -this.height / 2, this.width, this.height);
        } else {
            spaceShip.onload = () => {
                ctx.drawImage(meteorImg, -this.width / 2, -this.height / 2, this.width, this.height);
            };
        }
        ctx.restore(); // Restore context to its original state
    };

    this.makeFall = function () {
        // Calculate distance between current position and end position
        var deltaX = this.xend - this.xstart;
        var deltaY = this.yend - this.ystart;

        // Determine step size based on gravity or a constant speed
        var stepSize = 4;  // Or some other appropriate value

        // Normalize the distance vector
        var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        var normX = deltaX / distance;
        var normY = deltaY / distance;

        // Move meteorite by normalized vector scaled by the step size
        if (distance > stepSize) { // Check if the meteorite has not yet reached the endpoint
            this.xstart += normX * stepSize;
            this.ystart += normY * stepSize;
        } else {
            this.xstart = this.xend; // Snap to end position if very close
            this.ystart = this.yend;
        }
    };
}
function randomMeteoriteStartLocation() {
    var dict = new Object();
    let x = Math.floor(Math.random() * 2); // Nāks no X vai Y {0 == X} {1 == Y}

    if (x == 0) {
        let xWidthRandomLocation = Math.floor(Math.random() * canvasWidth) + 1;
        console.log("x start random location", xWidthRandomLocation);
        var dict = {
            x: xWidthRandomLocation,
            y: 0
        };
        return dict;
    } else {
        let yWidthRandomLocation = Math.floor(Math.random() * canvasHeight) + 1;
        console.log("y start random location", yWidthRandomLocation);
        var dict = {
            x: 0,
            y: yWidthRandomLocation
        };
        return dict;
    }
}

function randomMeteoriteEndLocation() {
    var dict = new Object();
    let x = Math.floor(Math.random() * 2); // Nāks no X vai Y {0 == X} {1 == Y}

    if (x == 0) {
        let xWidthRandomLocation = Math.floor(Math.random() * canvasWidth) + 1;
        console.log("x end random location", xWidthRandomLocation);
        var dict = {
            x: xWidthRandomLocation,
            y: canvasHeight
        };
        return dict;
    } else {
        let yWidthRandomLocation = Math.floor(Math.random() * canvasHeight) + 1;
        console.log("y end random location", yWidthRandomLocation);
        var dict = {
            x: canvasWidth,
            y: yWidthRandomLocation
        };
        return dict;
    }
}

function checkIfHit() {
    allmeteorites.forEach(function (meteorite) {
        if (player.x < meteorite.xstart + meteorite.width &&
            player.x + player.width > meteorite.xstart &&
            player.y < meteorite.ystart + meteorite.height &&
            player.y + player.height > meteorite.ystart) {
            console.log("Hit detected with a meteorite!");
            endGame();
            // Additional code to handle the hit (e.g., end game, reduce health, etc.)
        }
    });
}


function updateCanvas() {
    var ctx = gameCanvas.context;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Update and draw each meteorite
    allmeteorites.forEach(function (meteorite) {
        meteorite.makeFall();
        meteorite.draw();

    });

    // Move and draw player
    player.movePlayer();
    checkIfHit();
    manageBoost();
    player.draw();
    boostLabel.draw();
}


function createBoostLabel(x, y) {
    this.x = x;
    this.y = y;
    this.draw = function () {
        ctx = gameCanvas.context;
        ctx.font = "25px Marker Felt";  // Setting font for the text
        ctx.fillStyle = "black";  // Setting text color
        this.text = "Boost: " + boostAmount;  // Setting text to show current boost amount
        ctx.fillText(this.text, this.x, this.y);  // Drawing the text
    }
}

function createPoints(x, y) {
    this.x = x;
    this.y = y;
    this.draw = function () {
        ctx = gameCanvas.context;
        ctx.font = "25px Marker Felt";  // Setting font for the text
        ctx.fillStyle = "black";  // Setting text color
        this.text = "Points: " + boostAmount;  // Setting text to show current boost amount
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




