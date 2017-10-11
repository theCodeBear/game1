var gridSize = 20;

var map = [
  "...............",
  "...............",
  "...............",
  "...............",
  "...............",
  "...............",
  "...............",
  "#..............",
  "#...MZW........",
  "#..............",
  "#..............",
  "#.............."
];

// Use this method of creating player objects because there will only be a single player
var player = {
  x : 8,
  y : 8,
  avatar : "@",
  color : "orange",
  lastMove : [],
  move : function(x,y) {
    // if (map[this.x+x][this.y+y] != "#") {
      this.x += x;
      this.y += y;
      update();
    // }
    this.lastMove = [x,y];
  }
};


window.addEventListener("keydown", function(event) {
  switch(event.keyCode) {
    case 37:
      player.move(-1,0);
      update();
      break;
    case 38:
      player.move(0,-1);
      update();
      break;
    case 39:
      player.move(1,0);
      update();
      break;
    case 40:
      player.move(0,1);
      update();
      break;
  }
});

function init() {
  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext("2d");

  ctx.font="17px Andale Mono";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";       // top means that the top of the character space
                                    // draws at the y-coordinate you give it.
  update();

}

// This defines a new method for array objects called drawMap. So this is the draw method
// for whatever map is active. I could make a roguelike game dev library and include this.
// Can optinonally include a two element color array representing the color of the map and
// color of the grid. If I were to put this in a game library I would always need to supply
// as a parameter the height and width of each block in the grid/map. Maybe would also need
// optionally parameters for the x,y coords to begin drawing the map at and the height and
// width of the map in blocks. And borderColor, if given, will give the whole map a border
// of that color, if it is not given then there will be no border. Also need to make it so
// it is only going through the logic of drawing what will be on screen, and not just the
// whole map.
// Also right now it always starts drawing at grid block (0,0), need to add two parameters
// to represent drawing starting at a different block in the map. Could be just two params
// at the end of the param list, but have to figure out how I keep track of it outside the
// function.
// The function expects a square map (or at least the first row must be as long as the
// others).
Array.prototype.drawMap = function(grid, colors, mapWidth, mapHeight, mapX, mapY, borderColor) {

// Clear the screen for the next frame
  ctx.clearRect(mapX,mapY,mapWidth*gridSize,mapHeight*gridSize);

// Set default values of zero for mapX and mapY if those arguments aren't given.
  if (typeof(mapX) === 'undefined') mapX = 0;
  if (typeof(mapY) === 'undefined') mapY = 0;

// Handle mapHeight parameter if larger than entire map or <= 0
  mapHeight = verifyMapDimension(mapHeight, this.length);

// Handle mapWidth parameter if larger than entire map of <= 0
  mapWidth = verifyMapDimension(mapWidth, this[0].length);

// Draw map to canvas
  for (var row=0; row < (mapHeight = mapHeight || this.length); row++) {
    for (var col=0; col < (mapWidth = mapWidth || this[row].length); col++) {
    // output ASCII map characters
      if (colors)
        colors[0] ? ctx.fillStyle = colors[0] : ctx.fillStyle = "white";
      else
        ctx.fillStyle = "white";
      // if (this[row][col].color)    // will this work?? map objects having unique colors.
      //     ctx.fillStyle = this[row][col].color;
      ctx.fillText(this[row][col], col*gridSize+(gridSize/2)+mapX, row*gridSize+mapY);
    // output grid:
      if (grid==true) {
        if (colors)
          colors[1] ? ctx.strokeStyle = colors[1] : ctx.strokeStyle = "white";
        else
          ctx.strokeStyle = "white";
        ctx.strokeRect(col*gridSize+mapX,row*gridSize+mapY,gridSize,gridSize);
      }
    // Handle drawing (or not drawing) of map border.
      if (borderColor) {
        ctx.strokeStyle = borderColor;
        ctx.strokeRect(mapX, mapY, mapWidth*gridSize, mapHeight*gridSize);
      }
    }
  }
  updatePlayerToMap(mapX, mapY);
}


// Will also be in my roguelike JS game library for moving the map on screen.
Array.prototype.moveMap = function() {
  ;
}



// Handles map width and map height display dimensions if they are bad inputs - either too
// large (larger than map) or too small (<= 0). Fixes the dimensions or throws an error.
// First parameter is the dimension of the map being displayed, second parameter is the map's
// total size in that dimension.
function verifyMapDimension(displayDimen, totalDimen) {
  try {
    // if mapHeight or mapWidth is given as 0 or negative, throw an error.
    if (displayDimen <= 0)
      throw new customError("Zero or negative number sent to drawMap() for viewable map dimension parameter");
    // if display dimension is larger than map set it equal to that of entire map
    else if (displayDimen > totalDimen)
      displayDimen = totalDimen;
  } catch(err) { console.log(err); }          // print possible error to console
  finally { return displayDimen; }
}




// Creating a function to call to display custom errors. Just do: throw new customError()
// with the error message as the argument. Then send the error to the console.log() in the
// catch block. This can also be part of my roguelike game dev library since I give the
// errors a name appropriate to the library.
function customError(message) {
  this.stack = new Error().stack;
  this.name = "Todd Roguelike Library Error";
  this.message = (message || "");
}
customError.prototype = new Error();//Error.prototype;

// Another way of doing a custom error:
    // function customError() {
    //     var err = Error.apply(this,arguments);
    //     err.name = this.name = "Todd Library Error";
    //     this.stack = err.stack;
    //     // this.message = err.message;
    //     return this;
    // }

    // function updatePlayerToMap() {

    // }

// Once the player has moved this function clears from the display what is normally
// occupying that space on the map, and outputs the player's character instead.
function updatePlayerToMap(mapX, mapY) {//, mapWidth, mapHeight) {
  console.log(player.x);
  if (map[player.x][player.y] != "#") {
    // clear display space where player is moving to.
    ctx.clearRect(player.x*gridSize+mapX, player.y*gridSize+mapY, gridSize, gridSize);
    // output the player to the screen in the correct spot
    ctx.fillStyle = player.color;
    ctx.fillText(player.avatar, player.x*gridSize+(gridSize/2)+mapX, player.y*gridSize+mapY);
  } else {
    player.x += -player.lastMove[0];
    player.y += -player.lastMove[1];
  }
}

// Game update function (the game loop)
function update() {

  map.drawMap(false, ["green","blue"], 10, 33, 100, 50);//, "rgb(0,200,0)");
}


