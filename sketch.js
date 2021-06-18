var forestBG, player, gameOver, restartButton, monkeyS, bgSound, banana, bird, trapNets, tree, grapes;
var forestBGimg, playerImg, gameOverImg, restartButtonImg, bananaImg, birdImg, trapNetImg, treeImg, grapesImg, logImg, playerImgTwo, playerImgThree;

var obstaclesGroup, scoreGroup;

var gameStateS = "sound";

var score = 0;
var lives = 7;

var PLAY = 1;
var ENDL = 2;
var ENDW = 3;
var gameState = PLAY;

function preload() {
  forestBGimg = loadImage("forestBG.png");
  playerImgTwo = loadImage("monkey-9.png");
  playerImg = loadImage("monkey.png");
  playerImgThree = loadImage("monkey-5.png");
  bananaImg = loadImage("banana.png");
  birdImg = loadImage("bird.png");
  trapNetImg = loadImage("trapnet.png");
  treeImg = loadImage("tree.png");
  grapesImg = loadImage("grapes.png");
  monkeyS = loadSound("monkeyS.wav");
  bgSound = loadSound("bgSound.wav");
  restartButtonImg = loadImage("restart.png");
  logImg = loadImage("log.png");
}

function setup() {
  createCanvas(600, 300);
  
  forestBG = createSprite(900, 150);
  forestBG.scale = 1;
  forestBG.addImage(forestBGimg);
  forestBG.velocityX = -5;
  
  player = createSprite(100, 150);
  player.scale = 0.2;
  player.addImage(playerImg);
  // player.addAnimation(playerImg);
  
  restartButton = createSprite(300, 150);
  restartButton.scale = 0.2;
  restartButton.addImage(restartButtonImg);
  restartButton.visible = false;
  
  monkeyS.setVolume = 10;
  
  obstaclesGroup = new Group();
  scoreGroup = new Group();
  
}

function draw() {
  background(0,100,0);
  
  edges = createEdgeSprites();
  player.bounceOff(edges);
  
  if(gameState == PLAY) {
    if(forestBG.x < 0) {
      forestBG.x = 899;
    }
    
    forestBG.velocityX = -(8 + 3*score/100);

    if(keyWentDown("space")) {
      monkeyS.loop();
    } else if(keyWentUp("space")) {
        monkeyS.stop();
    }
    
    if(gameStateS == "sound") {
      bgSound.loop();
      gameStateS = "mute";
    }
    
    if(keyDown(UP_ARROW)) {
      player.scale = 0.6;
      player.addImage(playerImgTwo);
      player.setCollider("rectangle", 0, 0, 100, 100);
      // player.debug = true;
      player.y-=5;
      player.x = 100
    } else if(keyWentUp(UP_ARROW)) {
        player.addImage(playerImg);
        player.scale = 0.2;
        player.x = 100
    } else if(keyDown(DOWN_ARROW)) {
        player.scale = 0.6;
        player.addImage(playerImgThree);
        player.setCollider("rectangle", 0, 0, 100, 100);
        // player.debug = true;
        player.y+=5;
        player.x = 100
    } else if(keyWentUp(DOWN_ARROW)) {
        player.addImage(playerImg);
        player.scale = 0.2;
        player.x = 100
    }
    
    if(obstaclesGroup.isTouching(player)) {
      lives-=1;
      obstaclesGroup.destroyEach();
    }
    
    if(scoreGroup.isTouching(player)) {
      score+=1;
      scoreGroup.destroyEach();
    }
    
    if(lives == 0) {
      gameState = ENDL;
    }
    
    if(score == 10) {
      gameState = ENDW;
    }
  }
  
  drawSprites();
  
  spawnObstacles();
  spawnFruits();
  
  if(gameState == ENDL) {
    forestBG.velocityX = 0;
    obstaclesGroup.setLifetimeEach(-1);
    scoreGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);
    scoreGroup.setVelocityXEach(0);
    bgSound.stop();
    monkeyS.stop();
    restartButton.visible = true;
    fill("black");
    textSize(25);
    text("Game Over: ", 100, 150);
    if(mousePressedOver(restartButton)) {
       restart();
    }
  }
  
  if(gameState == ENDW) {
    forestBG.velocityX = 0;
    obstaclesGroup.setLifetimeEach(-1);
    scoreGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);
    scoreGroup.setVelocityXEach(0);
    bgSound.stop();
    monkeyS.stop();
    restartButton.visible = true;
    fill("black");
    textSize(25);
    text("You Won! ", 100, 150);
    if(mousePressedOver(restartButton)) {
       restart();
    }
  }
  
  
  fill("blue");
  textSize(15);
  text("Score: " + score, 270, 30);
  text("Lives: " + lives, 272, 50);
}


function spawnObstacles() {
  if (frameCount % 40 === 0) {
    var obstacle = createSprite(650, random(20, 280));
    obstacle.velocityX = -(10 + 3*score/100);


    // //generate random obstacles
    var rand = Math.round(random(1, 3));
    switch (rand) {
      case 1:
        obstacle.addImage(birdImg);
        break;
      case 2:
        obstacle.addImage(logImg);
        break;
      default:
        obstacle.addImage(treeImg);
        break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;

    //adding obstacles to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnFruits() {
  if (frameCount % 60 === 0) {
    var fruit = createSprite(650, random(20, 280));
    fruit.velocityX = -(10 + 3*score/100);


    // //generate random obstacles
    var rands = Math.round(random(1, 3));
    switch (rands) {
      case 1:
        fruit.addImage(bananaImg);
        break;
      // case 2:
      //   fruit.addImage(grapesImg);
      //   break;
      default:
        fruit.addImage(grapesImg);
        break;
    }

    //assign scale and lifetime to the obstacle           
    fruit.scale = 0.1;
    fruit.lifetime = 300;

    //adding obstacles to the group
    scoreGroup.add(fruit);
  }
}

function restart() {
  scoreGroup.destroyEach();
  obstaclesGroup.destroyEach();
  restartButton.visible = false;
  score = 0;
  lives = 7;
  gameState = PLAY;
  bgSound.play();
  forestBG.velocityX = -5;
  player.scale = 0.2;
  player.addImage(playerImg);
}