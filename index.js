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
  this.load.image('platform', 'sprites/block.png');
  this.load.image(
    'cloud1',
    'https://lh3.googleusercontent.com/proxy/z5pW2V1FjoZtI4fcTnkqpuNOIVGr86fhyFUnBIAUfUlDOQUpFdQ9vIdudYRLTgYbMeoYj99LSTl2r7hDBw7hC6vBfIxzXdUU'
  );
  this.load.image(
    'cloud2',
    'https://lh3.googleusercontent.com/proxy/z5pW2V1FjoZtI4fcTnkqpuNOIVGr86fhyFUnBIAUfUlDOQUpFdQ9vIdudYRLTgYbMeoYj99LSTl2r7hDBw7hC6vBfIxzXdUU'
  );
  this.load.image('grass', 'https://art.pixilart.com/4bb6784650da7a5.png');
  this.load.spritesheet('player', 'https://i.imgur.com/qeD0Js1.png', {
    frameWidth: 67,
    frameHeight: 70
  });
}

var player, platforms;
var cursors;
var cloud1, cloud2;

function create() {
  let back = this.add.tileSprite(0, 0, 500, 400, 'background');
  back.setOrigin(0);
  back.setScrollFactor(0); //fixedToCamera = true;
  this.cameras.main.setBounds(0, 0, 1000, 350);
  this.physics.world.setBounds(0, 0, 1000, 350);

  let grass = this.add.tileSprite(0, 350, 500, 100, 'grass');
  //let grass = this.add.tileSprite(0, 0, 50, 50, 'grass');
  grass.setOrigin(0);
  grass.setScrollFactor(0);

  cloud1 = this.physics.add.sprite(1100, 100, 'cloud1');
  cloud1.setScale(0.3);

  cloud2 = this.physics.add.sprite(1100, 170, 'cloud2');
  cloud2.setScale(0.2);

  player = this.physics.add.sprite(50, 100, 'player');
  player.setCollideWorldBounds(true);
  player.setBounce(0.2);
  player.body.setSize(40, 65, 10, 0);
  this.cameras.main.startFollow(player);

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
    frames: [{ key: 'cloud1', frame: 0 }],
    frameRate: 20
  });

  cursors = this.input.keyboard.createCursorKeys();

  platforms = this.physics.add.staticGroup();
  platforms.create(200, 240, 'platform');
  platforms.create(300, 190, 'platform');
  platforms.create(400, 140, 'platform');
  platforms.create(450, 90, 'platform');
  platforms.create(500, 140, 'platform');
  platforms.create(600, 190, 'platform');
  platforms.create(700, 240, 'platform');
  platforms.create(80, 300, 'platform');
  platforms.getChildren().forEach(c =>
    c
      .setScale(0.5)
      .setOrigin(0)
      .refreshBody()
  );

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
      player.setVelocityY(-250);
    }
  }
  cloud1.setVelocityX(-100);
  cloud1.setVelocityY(0);
  cloud1.y = 100;
  if (cloud1.x < -100) {
    cloud1.x = 1100;
  }

  cloud2.setVelocityX(-80, 10);
  cloud2.setVelocityY(0);
  cloud2.y = 170;
  if (cloud2.x < -100) {
    cloud2.x = 1100;
  }
}
