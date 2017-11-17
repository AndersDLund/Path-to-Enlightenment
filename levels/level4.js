let gameArea = $('#gameArea');
let apiArea = $('#apiArea');
let body = $('body');

let button = $('button');
let quoteArea = $('#quoteArea');

var state, robo, love, nicks, chimes, exit, player, dungeon,
    Ghandi, healthBar, message, gameScene, gameOverScene, enemies, id, apiQuote;



//----------------------------------------------------------------------------
//------------------------------Game------------------------------------------
//----------------------------------------------------------------------------


var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Texture = PIXI.Texture,
    Sprite = PIXI.Sprite,
    Text = PIXI.Text,
    Graphics = PIXI.Graphics;
//Created Pixi stage and renderer and added the
//renderer.view to the DOM
var stage = new Container(),
    renderer = autoDetectRenderer(770, 620);
    resize(renderer.view);
document.body.appendChild(renderer.view);
loader
  .add("../images/thePath.json")
  .load(setup);

var state, robo, love, nicks, chimes, exit, player, dungeon,
    Ghandi, healthBar, message, gameScene, gameOverScene, enemies, id, apiQuote;


//----------------------------------setup function--------------------------

function setup() {
  //Made the game scene and add it to the stage
  gameScene = new Container();
  stage.addChild(gameScene);

  //Made the sprites and add them to the `gameScene`
  //Created an alias for the texture atlas frame ids
  id = resources["../images/thePath.json"].textures;
  //Dungeon
  dungeon = new Sprite(id["dungeon.png"]);
  gameScene.addChild(dungeon);
  //Ghandi
  Ghandi = new Sprite(id["Ghandi.png"]);
  Ghandi.position.set(45, 0);
  gameScene.addChild(Ghandi);
  //robo
  robo = new Sprite(id["robo.png"]);
  robo.x = 63;
  robo.y = gameScene.height / 2 - robo.height / 2;
  robo.vx = 0;
  robo.vy = 0;
  gameScene.addChild(robo);

  //love
  love = new Sprite(id["love.png"]);
  love.x = gameScene.width - love.width - 48;
  love.y = gameScene.height / 2 - love.height / 2;
  love.anchor.x = 0.5;
  love.anchor.y = 0.5;
  gameScene.addChild(love);
  //spin nicks

  weirdnick = new Sprite(id["nick.png"]);
  weirdnick.x = gameScene.width / 2;
  weirdnick.y = gameScene.height / 4;
  weirdnick.anchor.x = 1;
  weirdnick.anchor.y = 1;
  gameScene.addChild(weirdnick);

  weirdnick1 = new Sprite(id["nick.png"]);
  weirdnick1.x = gameScene.width / 2;
  weirdnick1.y = gameScene.height - 150;
  weirdnick1.anchor.x = 1;
  weirdnick1.anchor.y = 1;
  gameScene.addChild(weirdnick1);

//spin nicks
  weirdnick2 = new Sprite(id["nick.png"]);
  weirdnick2.x = gameScene.width - love.width - 40;
  weirdnick2.y = gameScene.height / 2 - love.height / 2;
  weirdnick2.anchor.x = 1;
  weirdnick2.anchor.y = 1;
  gameScene.addChild(weirdnick2);
  //the nicks aka shias
  var numberOfnicks = 12,
      spacing = 48,
      xOffset = 120,
      speed = 3.5,
      direction = 1;

  nicks = [];

  //Make as many nicks as there are `numberOfnicks`
  for (var i = 0; i < numberOfnicks; i++) {
    speed = randomInt(2, 4)
    //Make a nick
    var nick = new Sprite(id["nick.png"]);
    //Space each nick horizontally
    var x = spacing * i + xOffset;
    //Give the nick a random y position
    var y = randomInt(0, stage.height - nick.height);
    //Set the nick's position
    nick.x = x;
    nick.y = y;
    //Set the nick's vertical velocity.
    nick.vy = speed * direction;
    //Reverse the direction for the next nick
    direction *= -1;
    //Push the nick into the `nicks` array
    nicks.push(nick);
    //Add the nick to the `gameScene`
    gameScene.addChild(nick);
  }
  //Created the health bar
  healthBar = new Container();
  healthBar.position.set(stage.width - 170, 6)
  gameScene.addChild(healthBar);
  //Created the black background rectangle
  var innerBar = new Graphics();
  innerBar.beginFill(0x000000);
  innerBar.drawRect(0, 0, 128, 8);
  innerBar.endFill();
  healthBar.addChild(innerBar);
  //Created the front red rectangle
  var outerBar = new Graphics();
  outerBar.beginFill(0xFF3300);
  outerBar.drawRect(0, 0, 128, 8);
  outerBar.endFill();
  healthBar.addChild(outerBar);
  healthBar.outer = outerBar;
  //Created the `gameOver` scene
  gameOverScene = new Container();
  stage.addChild(gameOverScene);
  //Make the `gameOver` scene invisible when the game first starts
  gameOverScene.visible = false;
  //`gameOver` scene
  message = new Text(
    "you Lose, Loser",
    {font: "64px Futura", fill: "white"}
  );
  message.x = 120;
  message.y = stage.height / 2 - 32;
  gameOverScene.addChild(message);
  // keyboard arrow keys
  var left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40);
  //Left arrow key
  left.press = function() {
    //Change the robo's velocity
    robo.vx = -5;
    robo.vy = 0;
  };
  //Left arrow key `release`
  left.release = function() {

    //Stop the robo
    if (!right.isDown && robo.vy === 0) {
      robo.vx = 0;
    }
  };
  //Up
  up.press = function() {
    robo.vy = -5;
    robo.vx = 0;
  };
  up.release = function() {
    if (!down.isDown && robo.vx === 0) {
      robo.vy = 0;
    }
  };
  //Right
  right.press = function() {
    robo.vx = 5;
    robo.vy = 0;
  };
  right.release = function() {
    if (!left.isDown && robo.vy === 0) {
      robo.vx = 0;
    }
  };
  //Down
  down.press = function() {
    robo.vy = 5;
    robo.vx = 0;
  };
  down.release = function() {
    if (!up.isDown && robo.vx === 0) {
      robo.vy = 0;
    }
  };
  //Set the game state
  state = play;

  //Start the game loop
  gameLoop();

}

//------------------------------Game Loop------------------------------

function gameLoop(){
  //Loop this function 60 times per second
  requestAnimationFrame(gameLoop);
  love.rotation += 0.05;
  weirdnick.rotation -=.2
  weirdnick1.rotation -=-.2
  weirdnick2.rotation -=.2
  //Update the current game state
  state();
  //Render the stage
  renderer.render(stage);
}

//------------------------------play function----------------------------

function play() {
  //use the robo's velocity to make it move
  robo.x += robo.vx;
  robo.y += robo.vy;
  //Contain the robo inside the area of the dungeon
  contain(robo, {x: 28, y: 10, width: 780, height: 610});

  var roboHit = false;
  //Loop through all the sprites in the `enemies` array
  nicks.forEach(function(nick) {
    //Move the nick
    nick.y += nick.vy;
    //Check the nick's boundaries
    var nickHitsWall = contain(nick, {x: 28, y: 10, width: 790, height: 640});
    //If the nick hits the top or bottom of the stage, reverse
    //its direction
    if (nickHitsWall === "top" || nickHitsWall === "bottom") {
      nick.vy *= -1;
    }
    //Test for a collision
    if(hitTestRectangle(robo, nick)) {
      roboHit = true;
    } else if (hitTestRectangle(robo, weirdnick)) {
      roboHit = true;
    }  else if (hitTestRectangle(robo, weirdnick2)) {
      roboHit = true;
    } else if (hitTestRectangle(robo, weirdnick1)) {
      roboHit = true;
    }
  });
  //If the robo is hit...
  if(roboHit) {
    //Make the robo semi-transparent
    robo.alpha = 0.5;
    //Reduce the width of the health bar's inner rectangle by 1 pixel
    healthBar.outer.width -= 3;
  } else {
    //Make the robo fully opaque (non-transparent) if it hasn't been hit
    robo.alpha = 1;
  }
  //Check for a collision between the robo and the love emoji
  if (hitTestRectangle(robo, love)) {
    //If the love is touching the robo, center it over the robo
    love.x = robo.x + 8;
    love.y = robo.y + 8;
  }
  //Does the robo have enough health? If the width of the `innerBar`
  //is less than zero, end the game and display "You lost!"
  if (healthBar.outer.width < 0) {
    state = end;
    message.text = "You Lose, Loser!";
  }

  //If the robo has brought the love to the exit,
  //end the game and display "You won!"
  if (hitTestRectangle(love, Ghandi)) {
    state = end;
    message.text = "This is starting to get dangerous!"
  }
  if (hitTestRectangle(robo, Ghandi)) {
    if (healthBar.outer.width < 128) {


    healthBar.outer.width += 0.2;
  }
  }
}


//--------------------------end function--------------------------
function end() {
  gameScene.visible = false;
  gameOverScene.visible = true;
}




/* ---------------Helper functions---------------- */

function contain(sprite, container) {
  var collision = undefined;
  //Left
  if (sprite.x < container.x) {
    sprite.x = container.x;
    collision = "left";
  }
  //Top
  if (sprite.y < container.y) {
    sprite.y = container.y;
    collision = "top";
  }
  //Right
  if (sprite.x + sprite.width > container.width) {
    sprite.x = container.width - sprite.width;
    collision = "right";
  }
  //Bottom
  if (sprite.y + sprite.height > container.height) {
    sprite.y = container.height - sprite.height;
    collision = "bottom";
  }
  //Return the `collision` value
  return collision;
}
//----------------------------------`hitTestRectangle` function
function hitTestRectangle(r1, r2) {
  //Define the variables we'll need to calculate
  var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
  //hit will determine whether there's a collision
  hit = false;
  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;
  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;
  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;
  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;
  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths - 10) {
    //A collision might be occuring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights - 10) {
      //There's definitely a collision happening
      hit = true;
    } else {
      //There's no collision on the y axis
      hit = false;
    }
  } else {
    //There's no collision on the x axis
    hit = false;
  }
  //`hit` will be either `true` or `false`
  return hit;
};
//-------------------------------------`randomInt` function
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//----------------------------------The `keyboard` helper function
function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };
  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };
  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}
//------------------------center stage------------------------------

function resize() {
  renderer.view.style.position = 'absolute';renderer.view.style.left = ((window.innerWidth - renderer.width) >> 1) + 'px';renderer.view.style.top = ((window.innerHeight - renderer.height) >> 1) + 'px';} resize();window.addEventListener('resize', resize);
