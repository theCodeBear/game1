/*
 * library needs to expose public methods init, update (more to come) methods
 * library needs to expose public setters loadMap, setTileSize, createPlayer
 * library needs to expose public getters getMap, getPlayer, getCanvas??, getContext??
 * keys pressed, drawMap, updatePlayerToMap should be run on update
*/

let game = {
  // DATA
  tileSize: null,
  map: null,
  player: null,
  canvas: null,
  ctx: null,
  // FUNCTIONS
  init: null,
//  verifyMapDimension: null,
//  customError: null,
//  updatePlayerToMap: null,
//  update: null,
  setTileSize: null,
  createPlayer: null,
  setMap: null,
//  keydown: null,
//  drawMap: null
};

game.createPlayer = (avatar, color, x, y) => {
  game.player = {
    x,
    y,
    avatar,
    color,
    lastMove: [],
    move: (x,y) => {
      // if (map[this.x+x][this.y+y] != "#") {
      game.player.x += x;
      game.player.y += y;
      update();
      // }
      game.player.lastMove = [x,y];
    }
  };
};

game.setMap = (mapArray) => {
  if (game.map) return;
  game.map = mapArray;
};

game.setTileSize = (tileSize) => {
  if (game.tileSize) return;
  game.tileSize = tileSize;
};

        let tileSize = 20;

        let map = [
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
        /*var player = {
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
        };*/


        window.addEventListener("keydown", (event) => {
            switch(event.keyCode) {
                case 37:
                    game.player.move(-1,0);
                    update();
                    break;
                case 38:
                    game.player.move(0,-1);
                    update();
                    break;
                case 39:
                    game.player.move(1,0);
                    update();
                    break;
                case 40:
                    game.player.move(0,1);
                    update();
                    break;
            }
        });

        game.init = () => {
            game.canvas = document.getElementById("myCanvas");
            game.canvas.width = window.innerWidth;
            game.canvas.height = window.innerHeight;
            game.ctx = game.canvas.getContext("2d");

            game.ctx.font="17px Andale Mono";
            game.ctx.textAlign = "center";
            game.ctx.textBaseline = "top";       // top means that the top of the character space
                                            // draws at the y-coordinate you give it.
            game.createPlayer('@', 'orange', 8, 8);
            game.setTileSize(tileSize);
            game.setMap(map);
            update();

        };

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
            game.ctx.clearRect(mapX,mapY,mapWidth*tileSize,mapHeight*tileSize);

        // Set default values of zero for mapX and mapY if those arguments aren't given.
            if (typeof(mapX) === 'undefined') mapX = 0;
            if (typeof(mapY) === 'undefined') mapY = 0;

        // Handle mapHeight parameter if larger than entire map or <= 0
            mapHeight = verifyMapDimension(mapHeight, this.length);

        // Handle mapWidth parameter if larger than entire map of <= 0
            mapWidth = verifyMapDimension(mapWidth, this[0].length);

        // Draw map to canvas
            for (let row=0; row < (mapHeight = mapHeight || this.length); row++) {
                for (let col=0; col < (mapWidth = mapWidth || this[row].length); col++) {
                // output ASCII map characters
                    if (colors)
                        colors[0] ? game.ctx.fillStyle = colors[0] : game.ctx.fillStyle = "white";
                    else
                        game.ctx.fillStyle = "white";
                    // if (this[row][col].color)    // will this work?? map objects having unique colors.
                    //     game.ctx.fillStyle = this[row][col].color;
                    game.ctx.fillText(this[row][col], col*tileSize+(tileSize/2)+mapX, row*tileSize+mapY);
                // output grid:
                    if (grid==true) {
                        if (colors)
                            colors[1] ? game.ctx.strokeStyle = colors[1] : game.ctx.strokeStyle = "white";
                        else
                            game.ctx.strokeStyle = "white";
                        game.ctx.strokeRect(col*tileSize+mapX,row*tileSize+mapY,tileSize,tileSize);
                    }
                // Handle drawing (or not drawing) of map border.
                    if (borderColor) {
                        game.ctx.strokeStyle = borderColor;
                        game.ctx.strokeRect(mapX, mapY, mapWidth*tileSize, mapHeight*tileSize);
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
        //     let err = Error.apply(this,arguments);
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
            console.log(game.player.x);
            if (game.map[game.player.x][game.player.y] != "#") {
                // clear display space where player is moving to.
                game.ctx.clearRect(game.player.x*tileSize+mapX, game.player.y*tileSize+mapY, tileSize, tileSize);
                // output the player to the screen in the correct spot
                game.ctx.fillStyle = game.player.color;
                game.ctx.fillText(game.player.avatar, game.player.x*tileSize+(tileSize/2)+mapX, game.player.y*tileSize+mapY);
            } else {
                game.player.x += -game.player.lastMove[0];
                game.player.y += -game.player.lastMove[1];
            }
        }

    // Game update function (the game loop)
        function update() {

            game.map.drawMap(false, ["green","blue"], 10, 33, 100, 50);//, "rgb(0,200,0)");
        }








/*
var game = {
  // DATA
  gridSize: null,
  map: null,
  player: null,
  canvas: null,
  ctx: null,
  // FUNCTIONS
  init: null,
  verifyMapDimension: null,
  customError: null,
  updatePlayerToMap: null,
  update: null,
  setGrideSize: null,
  createPlayer: null,
  setMap: null,
  keydown: null,
  drawMap: null
};

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
//var player = {
//  x : 8,
//  y : 8,
//  avatar : "@",
//  color : "orange",
//  lastMove : [],
//  move : function(x,y) {
//    // if (map[this.x+x][this.y+y] != "#") {
//      this.x += x;
//      this.y += y;
//      game.update();
//    // }
//    this.lastMove = [x,y];
//  }
//};

game.init = function() {
  game.canvas = document.getElementById("myCanvas");
  game.ctx = game.canvas.getContext("2d");

  game.ctx.font="17px Andale Mono";
  game.ctx.textAlign = "center";
  game.ctx.textBaseline = "top";       // top means that the top of the character space
                                    // draws at the y-coordinate you give it.
  game.createPlayer('@', 'orange', 8, 8);
  game.setMap(map);

  game.update();
};


game.createPlayer = function(avatar, color, startingX, startingY) {
  game.player = {
    x: startingX,
    y: startingY,
    avatar: avatar,
    color: color,
    lastMove: [],
    move: function(x,y) {
      // if (map[this.x+x][this.y+y] != "#") {
      console.log('this in move', this);
      this.x += x;
      this.y += y;
      game.update();
      // }
      this.lastMove = [x,y];
    }
  };
};

game.setGridSize = function(size) {
  if (game.gridSize) return;
  game.gridSize = size;
};

game.setMap = function(mapArray) {
  game.map = mapArray;
};


//window.addEventListener("keydown", function(event) {
game.keydown = function(event) {
  console.log('move', event.keyCode);
  switch(event.keyCode) {
    case 37:
      game.player.move(-1,0);
      game.update();
      break;
    case 38:
      game.player.move(0,-1);
      game.update();
      break;
    case 39:
      game.player.move(1,0);
      game.update();
      break;
    case 40:
      game.player.move(0,1);
      game.update();
      break;
  }
};

window.addEventListener('keydown', game.keydown);


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
game.drawMap = function(grid, colors, mapWidth, mapHeight, mapX, mapY, borderColor) {

// Clear the screen for the next frame
  game.ctx.clearRect(mapX,mapY,mapWidth*game.gridSize,mapHeight*game.gridSize);

// Set default values of zero for mapX and mapY if those arguments aren't given.
  if (typeof(mapX) === 'undefined') mapX = 0;
  if (typeof(mapY) === 'undefined') mapY = 0;

// Handle mapHeight parameter if larger than entire map or <= 0
  mapHeight = game.verifyMapDimension(mapHeight, this.length);

// Handle mapWidth parameter if larger than entire map of <= 0
  mapWidth = game.verifyMapDimension(mapWidth, this[0].length);

// Draw map to canvas
  for (var row=0; row < (mapHeight = mapHeight || this.length); row++) {
    for (var col=0; col < (mapWidth = mapWidth || this[row].length); col++) {
    // output ASCII map characters
      if (colors)
        colors[0] ? game.ctx.fillStyle = colors[0] : game.ctx.fillStyle = "white";
      else
        game.ctx.fillStyle = "white";
      // if (this[row][col].color)    // will this work?? map objects having unique colors.
      //     game.ctx.fillStyle = this[row][col].color;
      game.ctx.fillText(this[row][col], col*game.gridSize+(game.gridSize/2)+mapX, row*game.gridSize+mapY);
    // output grid:
      if (grid==true) {
        if (colors)
          colors[1] ? game.ctx.strokeStyle = colors[1] : game.ctx.strokeStyle = "white";
        else
          game.ctx.strokeStyle = "white";
        game.ctx.strokeRect(col*game.gridSize+mapX,row*game.gridSize+mapY,game.gridSize,game.gridSize);
      }
    // Handle drawing (or not drawing) of map border.
      if (borderColor) {
        game.ctx.strokeStyle = borderColor;
        game.ctx.strokeRect(mapX, mapY, mapWidth*game.gridSize, mapHeight*game.gridSize);
      }
    }
  }
  game.updatePlayerToMap(mapX, mapY);
};

Array.prototype.drawMap = game.drawMap;


// Will also be in my roguelike JS game library for moving the map on screen.
game.moveMap = function() {
  ;
};

Array.prototype.moveMap = game.moveMap;



// Handles map width and map height display dimensions if they are bad inputs - either too
// large (larger than map) or too small (<= 0). Fixes the dimensions or throws an error.
// First parameter is the dimension of the map being displayed, second parameter is the map's
// total size in that dimension.
game.verifyMapDimension = function(displayDimen, totalDimen) {
  try {
    // if mapHeight or mapWidth is given as 0 or negative, throw an error.
    if (displayDimen <= 0)
      throw new customError("Zero or negative number sent to drawMap() for viewable map dimension parameter");
    // if display dimension is larger than map set it equal to that of entire map
    else if (displayDimen > totalDimen)
      displayDimen = totalDimen;
  } catch(err) { console.log(err); }          // print possible error to console
  finally { return displayDimen; }
};




// Creating a function to call to display custom errors. Just do: throw new customError()
// with the error message as the argument. Then send the error to the console.log() in the
// catch block. This can also be part of my roguelike game dev library since I give the
// errors a name appropriate to the library.
game.customError = function(message) {
  this.stack = new Error().stack;
  this.name = "Todd Roguelike Library Error";
  this.message = (message || "");
};
game.customError.prototype = new Error();//Error.prototype;

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
game.updatePlayerToMap = function(mapX, mapY) {//, mapWidth, mapHeight) {
  console.log('game', game);
  console.log(game.player.x);
  if (game.map[game.player.x][game.player.y] != "#") {
    // clear display space where player is moving to.
    game.ctx.clearRect(game.player.x*game.gridSize+mapX, game.player.y*game.gridSize+mapY, game.gridSize, game.gridSize);
    // output the player to the screen in the correct spot
    game.ctx.fillStyle = game.player.color;
    game.ctx.fillText(game.player.avatar, game.player.x*game.gridSize+(game.gridSize/2)+mapX, game.player.y*game.gridSize+mapY);
  } else {
    game.player.x += -game.player.lastMove[0];
    game.player.y += -game.player.lastMove[1];
  }
};

// Game update function (the game loop)
game.update = function() {

  game.map.drawMap(false, ["green","blue"], 10, 33, 100, 50);//, "rgb(0,200,0)");
}
*/
