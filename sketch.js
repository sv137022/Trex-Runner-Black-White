var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var dog = 5+1
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOverButton,gameOver

var restart,restartButton
var die
var jump
var checkPoint
 localStorage ["HIGHESTSCORE"] = 0
function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameOverButton = loadImage("gameOver.png");
  restartButton = loadImage("restart.png");
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3");
  checkPoint = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  
  ground = createSprite(width/2,height-20,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(width/2,height/2,20,20);
  gameOver.addImage("gameOver",gameOverButton);
  gameOver.scale=0.5;
  
  restart = createSprite(width/2,height/2-50);
  restart.addImage("r",restartButton);
  restart.scale=0.5;
  invisibleGround = createSprite(width/2,height-20,width,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hello" + 5);
  
  score = 0;
  trex.debug=false;
  trex.setCollider("circle",0,0,45); 
}

function draw() {
  
  background(180);
  //displaying score
  text("Score: "+ score, 500,50);
  text("Highest Score:"+localStorage["HIGHESTSCORE"],100,50);
  
  //console.log(dog)
  if(gameState === PLAY){
    restart.visible=false;
    gameOver.visible=false;
    //move the ground
    ground.velocityX = -(4+score/100);
    //scoring
    score = score + Math.round(frameCount/200);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(touches.length>0||keyDown("space")&& trex.y >= height-100) {
        trex.velocityY = -13;
      jump.play();
      touches=[];
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
      die.play();
    }
    if (score>0&&score%100===0){
      //checkPoint.play();
    }
  }
   else if (gameState === END) {
     restart.visible=true;
     gameOver.visible=true;
      ground.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     obstaclesGroup.setLifetimeEach(-300);
     cloudsGroup.setLifetimeEach(-2);
     trex.changeAnimation("collided",trex_collided);
     if(touches.length>0||keyDown("space")){
       reset();
     touches=[];
     }
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  
  
  drawSprites();   
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(200,height-40,10,40);
   obstacle.velocityX = -(6+score/100);
   // -6+100/100=-5
   //-6+200/100=-4
   //PEMDAS rule
   //-(6+score/100)=
   //-(6+100/100)=-7
   //-(6+500/100)=-11
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
   //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime=300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
     obstacle.debug=false;
   obstaclesGroup.setColliderEach("rectangle",0,0,70,70);
 }

}

function spawnClouds() {
  //write code here to spawn the clouds
   if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -(3+score/100);
    
     //assign lifetime to the variable
    cloud.lifetime = 134;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}
    function reset(){
      gameState=PLAY;
      obstaclesGroup.destroyEach();
      cloudsGroup.destroyEach();
     if(localStorage["HIGHESTSCORE"]<score){
       localStorage["HIGHESTSCORE"]=score;
      
     }
    console.log(localStorage["HIGHESTSCORE"]);
  trex.changeAnimation("running",trex_running);
      
       score=0;
      
    }
  


