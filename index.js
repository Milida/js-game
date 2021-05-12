// Import stylesheets
import './style.css';
import 'phaser';

// Write Javascript code!
const appDiv = document.getElementById('app');

var config = {
  type: Phaser.AUTO,
  width: 500,
  height: 400,
  parent: appDiv,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);

function preload() {
  this.load.baseURL = 'https://examples.phaser.io/assets/';
  this.load.crossOrigin = 'anonymous';
  this.load.image('background', 'games/gofish/background.png');
  this.load.image('platform', 'games/breakout/paddle.png');
  this.load.image(
    'cloud1',
    'https://lh3.googleusercontent.com/proxy/cuw3TgVceUMMP6V1Cqby0dxzl13ZQ_NDeJ1G0EwSxrbzjZWEbN_aZjx8si68s_XiQ-hAPJFNYdfm2s31tvdm6mz5XKue6-lf'
  );
  this.load.image(
    'cloud2',
    'https://lh3.googleusercontent.com/proxy/cuw3TgVceUMMP6V1Cqby0dxzl13ZQ_NDeJ1G0EwSxrbzjZWEbN_aZjx8si68s_XiQ-hAPJFNYdfm2s31tvdm6mz5XKue6-lf'
  );
  this.load.image(
    'heart',
    'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b8aae8df-2c2c-4ac3-b45d-ac9a9eefd2be/d4r844m-ea976dcf-7494-44d6-859a-0edf5e67ed65.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2I4YWFlOGRmLTJjMmMtNGFjMy1iNDVkLWFjOWE5ZWVmZDJiZVwvZDRyODQ0bS1lYTk3NmRjZi03NDk0LTQ0ZDYtODU5YS0wZWRmNWU2N2VkNjUucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.EezexrxhS7nkcWMEEko08bStLQGSfv9qzGV5ZI_ppRo'
  );
  this.load.image('doll', 'virtualjoystick/beball1.png');
  /*this.load.image('grass', 'https://art.pixilart.com/4bb6784650da7a5.png');*/
  this.load.spritesheet('player', 'https://i.imgur.com/qeD0Js1.png', {
    frameWidth: 67,
    frameHeight: 70
  });
  this.load.spritesheet('coin', '/sprites/coin.png', {
    frameWidth: 32,
    frameHeight: 32
  });
  this.load.spritesheet('bird', 'https://i.imgur.com/hxYRHjm.png', {
    frameWidth: 192,
    frameHeight: 180
  });
}

var player, platforms, doll;
var cursors;
var clouds = [];
var coins = [];
var birds = [];
var hearts = [];
var dollText;
var collectedCoins = 0;
var lifes = 3;
var coinText;
var gameOverText;
var spaceBar;
var back;

function create() {
  spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  back = this.add.tileSprite(0, 0, 500, 400, 'background');
  back.setOrigin(0);
  back.setScrollFactor(0); //fixedToCamera = true;
  this.cameras.main.setBounds(0, 0, 1000, 350);
  this.physics.world.setBounds(0, 0, 1000, 350);

  /*let grass = this.add.tileSprite(0, 350, 500, 100, 'grass');
  grass.setOrigin(0);
  grass.setScrollFactor(0);*/

  clouds[0] = this.physics.add.sprite(1100, 100, 'cloud1');
  clouds[0].setScale(0.3);
  clouds[0].body.setAllowGravity(false);

  clouds[1] = this.physics.add.sprite(1100, 170, 'cloud2');
  clouds[1].setScale(0.2);
  clouds[1].body.setAllowGravity(false);

  player = this.physics.add.sprite(50, 100, 'player');
  //player.setCollideWorldBounds(true);
  player.setBounce(0.2);
  player.body.setSize(40, 65, 10, 0);
  this.cameras.main.startFollow(player);

  coins[0] = this.physics.add.sprite(180, 100, 'coin');
  coins[0].body.setAllowGravity(false);

  coins[1] = this.physics.add.sprite(300, 80, 'coin');
  coins[1].body.setAllowGravity(false);

  coins[2] = this.physics.add.sprite(165, 300, 'coin');
  coins[2].body.setAllowGravity(false);

  coins[3] = this.physics.add.sprite(520, 250, 'coin');
  coins[3].body.setAllowGravity(false);

  coins[4] = this.physics.add.sprite(580, 100, 'coin');
  coins[4].body.setAllowGravity(false);

  coins[5] = this.physics.add.sprite(700, 90, 'coin');
  coins[5].body.setAllowGravity(false);

  coins[6] = this.physics.add.sprite(920, 300, 'coin');
  coins[6].body.setAllowGravity(false);

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
    frameRate: 10
  });

  this.anims.create({
    key: 'front',
    frames: [{ key: 'player', frame: 0 }],
    frameRate: 20
  });

  this.anims.create({
    key: 'up',
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('player', { start: 8, end: 11 }),
    frameRate: 10
  });

  this.anims.create({
    key: 'move',
    frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 5 }),
    frameRate: 8,
    repeat: -1
  });

  this.anims.create({
    key: 'bird',
    frames: this.anims.generateFrameNumbers('bird', { start: 0, end: 4 }),
    frameRate: 10,
    repeat: -1,
    yoyo: true
  });

  cursors = this.input.keyboard.createCursorKeys();
  doll = this.physics.add.sprite(600, 350, 'doll');
  doll.body.setAllowGravity(false);

  platforms = this.physics.add.staticGroup();
  platforms.create(25, 350, 'platform');
  platforms.create(80, 300, 'platform');
  platforms.create(150, 350, 'platform');
  platforms.create(200, 200, 'platform');
  platforms.create(250, 300, 'platform');
  platforms.create(300, 210, 'platform');
  platforms.create(400, 140, 'platform');
  platforms.create(450, 90, 'platform');
  platforms.create(500, 290, 'platform');
  platforms.create(600, 200, 'platform');
  platforms.create(580, 380, 'platform');
  platforms.create(600, 380, 'platform');
  platforms.create(700, 240, 'platform');
  platforms.create(850, 260, 'platform');
  platforms.create(900, 350, 'platform');
  platforms.create(920, 170, 'platform');

  platforms.getChildren().forEach(c =>
    c
      .setScale(0.7)
      .setOrigin(0)
      .refreshBody()
  );
  birds[0] = this.physics.add.sprite(1100, 100, 'bird');
  birds[1] = this.physics.add.sprite(1100, 200, 'bird');
  birds[2] = this.physics.add.sprite(1100, 250, 'bird');

  coinText = this.add.text(5, 5, 'Collected coins: ' + collectedCoins, {
    font: '15px Arial',
    fill: '#ffffff',
    align: 'center'
  });
  coinText.setOrigin(0);
  coinText.setScrollFactor(0);

  hearts[0] = this.physics.add.staticSprite(15, 30, 'heart');
  hearts[1] = this.physics.add.staticSprite(35, 30, 'heart');
  hearts[2] = this.physics.add.staticSprite(55, 30, 'heart');
  for (let heart of hearts) {
    heart.setScale(0.02);
    heart.setOrigin(0);
    heart.setScrollFactor(0);
  }

  const screenCenterX =
    this.cameras.main.worldView.x + this.cameras.main.width / 2;

  gameOverText = this.add.text(screenCenterX, 180, 'Game over', {
    font: '35px Arial',
    fill: '#ffffff',
    align: 'center'
  });
  gameOverText.setOrigin(0.5);
  gameOverText.setScrollFactor(0);
  gameOverText.setVisible(false);

  for (let coin of coins) {
    this.physics.add.overlap(player, coin, function(player, coin) {
      if (coin.visible) {
        collectedCoins += 1;
        coinText.setText('Collected coins: ' + collectedCoins);
        coin.setActive(false).setVisible(false);
      }
    });
  }
  for (let bird of birds) {
    this.physics.add.collider(player, bird, function(player, bird) {
      if (lifes != 0) {
        hearts[--lifes].setVisible(false);
        bird.body.checkCollision.none = true;
        setTimeout(function() {
          bird.body.checkCollision.none = false;
        }, 200);
        if (lifes == 0) {
          gameOverText.setVisible(true);
          this.cameras.main.stopFollow();
          player.setActive(false).setVisible(false);
        }
      }
      bird.setVelocityY(0);
    });
    bird.body.setAllowGravity(false);
    bird.setScale(0.4);
    bird.body.setSize(150, 85, 75, 30);
    bird.setBounce(0);
  }

  dollText = this.add.text(100, 180, 'To buy lifes press space', {
    font: '35px Arial',
    fill: '#ffffff',
    align: 'center'
  });
  dollText.setOrigin(0);
  dollText.setScrollFactor(0);
  dollText.setVisible(false);
  this.physics.add.overlap(player, doll, function(player, doll) {
    dollText.setVisible(true);
    setTimeout(function() {
      dollText.setVisible(false);
    }, 100);
    if (spaceBar.isDown && collectedCoins >= 3 && lifes < 3) {
      collectedCoins -= 3;
      coinText.setText('Collected coins: ' + collectedCoins);
      hearts[lives++].setVisible(true);
    }
  });

  this.physics.add.collider(player, platforms);
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-150);
    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(150);
    player.anims.play('right', true);
  } else if (!cursors.up.isDown) {
    player.setVelocityX(0);
    player.anims.play('front');
  }

  if (cursors.up.isDown) {
    player.anims.play('up', true);
    if (player.body.touching.down || player.body.onFloor()) {
      player.setVelocityY(-300);
    }
  }

  if (player.x < -player.width || player.y > 400 + player.height) {
    gameOverText.setVisible(true);
    this.cameras.main.stopFollow();
  }
  if (player.x > 900 + player.width) {
    gameOverText.setText('You win! \n Your score: ' + collectedCoins);
    gameOverText.setVisible(true);
    this.cameras.main.stopFollow();
  }

  clouds[0].setVelocityX(-100);
  clouds[1].setVelocityX(-80);
  for (let cloud of clouds) {
    if (cloud.x < -100) {
      cloud.x = 1100;
    }
  }

  for (let coin of coins) {
    coin.anims.play('move', true);
  }

  for (let bird of birds) {
    bird.anims.play('bird', true);
  }

  birds[0].setVelocityX(-50);
  birds[1].setVelocityX(-100);
  birds[2].setVelocityX(-80);

  for (let bird of birds) {
    if (bird.x < -100) {
      bird.x = 1100;
    }
  }
}
