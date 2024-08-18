game.player = {
  x: 54,
  y: 0,
  height: 32,
  highestY: 0,
  direction: "idle",
  lastDirection: "right",
  jumpCount: 0,
  maxJumps: 2,
  isInAir: false,
  startedJump: false,
  moveInterval: null,
  fallTimeoutId: null,
  fallTimeout: function (startingY, time, maxHeight) {
    if (this.fallTimeoutId) clearTimeout(this.fallTimeoutId);
    this.fallTimeoutId = setTimeout(
      function () {
        if (this.isInAir) {
          this.y = startingY - maxHeight + Math.pow(-time / 3 + 11, 2);
          if (this.y < this.highestY) {
            this.highestY = this.y;
          }
          if (time > 37) {
            this.startedJump = false;
            game.checkCollisions();
          }
          if (time < 150) {
            time++;
            this.fallTimeout(startingY, time, maxHeight);
          } else {
            game.isOver = true;
          }
          if (this.y > 40) {
            game.isOver = true;
          }
          game.requestRedraw();
        }
      }.bind(this, startingY, time, maxHeight),
      12,
    );
  },
  animationFrameNumber: 0,
  collidesWithGround: true,
  animations: {
    // Describe coordinates of consecutive animation frames of objects in textures
    idle: [
      { texture: "character", tileColumn: 0, tileRow: 0 },
      { texture: "character", tileColumn: 1, tileRow: 0 },
      { texture: "character", tileColumn: 2, tileRow: 0 },
      { texture: "character", tileColumn: 3, tileRow: 0 },
      { texture: "character", tileColumn: 4, tileRow: 0 },
      { texture: "character", tileColumn: 5, tileRow: 0 },
      { texture: "character", tileColumn: 6, tileRow: 0 },
      { texture: "character", tileColumn: 7, tileRow: 0 },
      { texture: "character", tileColumn: 8, tileRow: 0 },
    ],
    left: [
      { texture: "character", tileColumn: 9, tileRow: 0 },
      { texture: "character", tileColumn: 10, tileRow: 0 },
      { texture: "character", tileColumn: 11, tileRow: 0 },
      { texture: "character", tileColumn: 12, tileRow: 0 },
      { texture: "character", tileColumn: 13, tileRow: 0 },
      { texture: "character", tileColumn: 14, tileRow: 0 },
    ],
    right: [
      { texture: "character", tileColumn: 9, tileRow: 0 },
      { texture: "character", tileColumn: 10, tileRow: 0 },
      { texture: "character", tileColumn: 11, tileRow: 0 },
      { texture: "character", tileColumn: 12, tileRow: 0 },
      { texture: "character", tileColumn: 13, tileRow: 0 },
      { texture: "character", tileColumn: 14, tileRow: 0 },
    ],
  },
  jump: function (type) {
    if (this.jumpCount >= this.maxJumps) return;
    var startingY = this.y;
    var time = 1;
    maxHeight = 121;
    if (type == "fall") {
      if (!this.isInAir) {
        time = 30;
        maxHeight = 0;
        this.isInAir = true;
        this.fallTimeout(startingY, time, maxHeight);
      }
      return;
    }
    clearInterval(this.fallInterval);
    game.sounds.jump.play();
    this.jumpCount++;
    this.isInAir = true;
    this.startedJump = true;
    this.fallTimeout(startingY, time, maxHeight);
  },
};
