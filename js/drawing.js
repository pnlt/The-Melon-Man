// Functions responsible for drawing on canvas

game.drawTile = function (tileColumn, tileRow, x, y) {
  game.context.drawImage(
    game.textures,
    tileColumn * game.options.tileWidth,
    tileRow * game.options.tileHeight,
    game.options.tileWidth,
    game.options.tileHeight,
    x * game.options.tileWidth -
      Math.round(game.player.x) +
      Math.round(game.options.canvasWidth / 2 + game.options.tileWidth / 2),
    y * game.options.tileHeight -
      Math.round(game.player.y) +
      Math.round(game.options.canvasHeight / 2 + game.options.tileHeight / 2),
    game.options.tileWidth,
    game.options.tileHeight,
  );
};

game.drawStructure = function (name, x, y) {
  var structure = game.structures[name];
  for (var i = 0; i < structure.length; i++) {
    game.drawTile(
      structure[i].tileColumn,
      structure[i].tileRow,
      structure[i].x + x,
      structure[i].y + y,
    );
  }
};

game.drawFireBall = function (tileColumn, tileRow, x, y) {
  game.context.drawImage(
    game.fireball.textures,
    tileColumn * game.fireball.tileWidth,
    tileRow * game.fireball.tileHeight,
    game.fireball.tileWidth,
    game.fireball.tileHeight,
    x * game.fireball.tileWidth -
      Math.round(game.player.x) +
      Math.round(game.fireball.canvasWidth / 2 + game.fireball.tileWidth / 2),
    y * game.fireball.tileHeight -
      Math.round(game.player.y) +
      Math.round(game.fireball.canvasHeight / 2 + game.fireball.tileHeight / 2),
    game.fireball.tileWidth,
    game.fireball.tileHeight,
  );
};

game.drawFireBalls = function () {
  for (var i = 0; i < game.map.fireballsList.length; i++) {
    var fireball = game.map.fireballsList[i];
    game.drawFireBall(
      fireball.tileColumn,
      fireball.tileRow,
      fireball.x,
      fireball.y,
    );
  }
};

game.drawPlayer = function () {
  actualPlayerTile =
    game.player.animations[game.player.direction][
      game.player.animationFrameNumber % 4
    ];
  game.context.save();
  scaleX = game.player.lastDirection === "left" ? -1 : 1;
  game.context.scale(scaleX, 1);
  game.context.drawImage(
    game.character.textures,
    actualPlayerTile.tileColumn * game.character.tileWidth,
    actualPlayerTile.tileRow * game.character.tileHeight,
    game.character.tileWidth,
    game.character.tileHeight,
    game.player.lastDirection === "left"
      ? -Math.round(
          game.character.canvasWidth / 2 + game.character.tileWidth / 2,
        )
      : Math.round(
          game.character.canvasWidth / 2 - game.character.tileWidth / 2,
        ),
    Math.round(game.character.canvasHeight / 2 - game.character.tileHeight / 2),
    game.character.tileWidth,
    game.character.tileHeight,
  );
  game.context.restore();
};

game.redraw = function () {
  game.drawPending = false;

  // Draw the background
  if (game.backgrounds["sky"].loaded) {
    var pattern = game.context.createPattern(
      game.backgrounds["sky"].image,
      "repeat",
    ); // Create a pattern with this image, and set it to "repeat".
    game.context.fillStyle = pattern;
  } else {
    game.context.fillStyle = "#78c5ff";
  }

  game.context.fillRect(0, 0, game.canvas.width, game.canvas.height);

  if (game.backgrounds["trees"].loaded) {
    game.context.drawImage(
      game.backgrounds["trees"].image,
      0,
      game.canvas.height / 2 - game.player.y / 10,
      332,
      180,
    );
    game.context.drawImage(
      game.backgrounds["trees"].image,
      332,
      game.canvas.height / 2 - game.player.y / 10,
      332,
      180,
    );
  }

  // List nearest structures
  var structuresToDraw = [];
  var drawing_distance = 15;
  for (var i = 0; i < game.map.structures.length; i++) {
    if (
      game.map.structures[i].x >
        game.player.x / game.options.tileWidth - drawing_distance &&
      game.map.structures[i].x <
        game.player.x / game.options.tileWidth + drawing_distance &&
      game.map.structures[i].y >
        game.player.y / game.options.tileHeight - drawing_distance &&
      game.map.structures[i].y <
        game.player.y / game.options.tileHeight + drawing_distance
    ) {
      structuresToDraw.push(game.map.structures[i]);
    }
  }

  // Draw them
  for (var i = 0; i < structuresToDraw.length; i++) {
    game.drawStructure(
      structuresToDraw[i].name,
      structuresToDraw[i].x,
      structuresToDraw[i].y,
    );
  }

  game.drawFireBalls();

  // Draw the player
  game.drawPlayer();

  let highScore = localStorage.getItem("highScore") || 0;

  if (
    Math.round(-game.player.highestY / (3 * game.options.tileHeight)) >
    highScore
  ) {
    highScore = Math.round(
      -game.player.highestY / (3 * game.options.tileHeight),
    );
    localStorage.setItem("highScore", highScore);
  }

  (game.counter.innerHTML =
    "A game by Karol Swierczek | Controls: A, D / arrows and SPACE | Points: " +
    Math.round(-game.player.highestY / (3 * game.options.tileHeight)) +
    " High Score:" +
    highScore),
    game.canvas.width - 50,
    game.canvas.height - 12;
};

game.requestRedraw = function () {
  if (!game.drawPending && !game.isOver) {
    game.drawPending = true;
    requestAnimationFrame(game.redraw);
  }

  if (game.isOver) {
    clearInterval(this.player.fallInterval);
    game.context.font = "30px Bangers";
    game.context.textAlign = "center";
    game.context.fillStyle = "black";
    game.context.fillText(
      "Game over!",
      game.canvas.width / 2,
      game.canvas.height / 2,
    );
    game.context.font = "15px Georgia";
    game.context.fillText(
      "(Refresh the page to restart)",
      game.canvas.width / 2,
      game.canvas.height / 2 + 50,
    );
  }
};

game.updateFireballs = function () {
  for (let i = 0; i < game.map.fireballsList.length; i++) {
    let fireball = game.map.fireballsList[i];
    fireball.y += fireball.speed;

    if (
      game.player.x / game.character.tileWidth / 2 >= fireball.x &&
      game.player.x / game.character.tileWidth / 2 <= fireball.x + 0.7 &&
      game.player.y / game.character.tileHeight / 2 >= fireball.y - 0.5 &&
      game.player.y / game.character.tileHeight / 2 <= fireball.y + 0.5
    ) {
      console.log("dung");
      clearInterval(game.player.fallInterval);
      game.isOver = true;
      game.map.fireballsList.splice(i, 1);
      i--;
      continue;
    }

    if (fireball.y > 10) {
      game.map.fireballsList.splice(i, 1);
      i--;
    }
  }
};

game.spawnFireball = function () {
  let fireball = {
    x: Math.floor(Math.random() * 4),
    y: game.player.y / game.character.tileHeight - 3,
    speed: 0.2,
    tileColumn: 0,
    tileRow: 0,
  };
  game.map.fireballsList.push(fireball);
  console.log(fireball.y);
};

setInterval(game.spawnFireball, 2000);

setInterval(game.updateFireballs, 100);
