let canvasWidth = 800;
let canvasHeight = 600;

var player; // player
var playerXPosition = canvasWidth / 2 - 30; // X coordinates
var playerYPosition = canvasHeight / 2 - 30; // Y coordinates

// start game function
function startGame(){
    gameCanvas.start();
    player = new createPlayer(30,30); // creates a new player
}

// defines the game field with canvas
// store the data of a canvas
var gameCanvas = {
    canvas: document.createElement("canvas"), start: function(){
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    }

}



// function
function createPlayer(width, height){
    this.width = width;
    this.height = height;
    this.x = playerXPosition;
    this.y = playerYPosition;

    ctx = gameCanvas.context;
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y, this.width, this.height);

}
