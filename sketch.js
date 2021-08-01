var dog, dogImg, happyDog;
var foodS, foodStock;
var database, lastFed, fed;
var milkBottle2;
var addFood, foodObj, addFoods;
var gameState = 0;

function preload()
{
	dogImg = loadImage("dogImg.png");
  happyDogImg = loadImage("dogImg1.png");
  bedroomImg = loadImage("Bed Room.png");
  gardenImg = loadImage("Garden.png");
  washroomImg = loadImage("Wash Room.png");
}

function setup() {
	createCanvas(1000,400);
  database = firebase.database();
  
  foodObj = new Food();

  dog = createSprite(800,200);
  dog.addImage(dogImg);
  dog.scale = 0.15;

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  feed = createButton("Feed the Dog");
  feed.position(700,115);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(700,137);
  addFood.mousePressed(addFoods);
}


function draw() {  
background(gardenImg);
foodObj.display();

if(foodS == 0){
  dog.addImage(happyDog);
  milkBottle2.visible = false;
}else{
  dog.addImage(dogImg);
  //milkBottle2.visible = true;
}

fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  })

  fill(225,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : " + lastFed%12 + "PM", 350,30);
  }else if(lastFed==0){
    text("Last Feed : 12 AM",350,30);
  }else{
    text("Last Feed : " + lastFed + "AM", 350,30);
  }
  drawSprites();
textSize(20);
  fill(225);
    text("Note: Press UP ARROW to Feed Drago milk", 50,50);
    text("Food Remaining:" + foodS, 150,150);

  

  

  if(gameState === 1){
    dog.addImage(happyDog);
    dog.scale = 0.175
    dog.y = 250;
  }

  if(gameState === 2){
    dog.addImage(dogImg);
    dog.scale = 0.175
   // milkBottle2.visible = false;
    dog.y = 250;
  }

  var Bath = createButton("I want to take a bath");
  Bath.position(580,125);
  if(Bath.mousePressed(function(){
    gameState = 3;
    database.ref('/').update({'gameState':gameState})
  }));
  
  if(gameState === 3){
    dog.addImage(washroomImg);
    dog.scale = 1
   // milkBottle2.visible = false;
  }

  var Sleep = createButton("I am very sleepy");
  Sleep.position(710,125);
  if(Sleep.mousePressed(function(){
    gameState = 4;
    database.ref('/').update({'gameState':gameState})
  }));
  
  if(gameState === 4){
    dog.addImage(bedroomImg);
    dog.scale = 1
    //milkBottle2.visiblity = false;
  }
  
  
  
  currentTime = hour();
  if(currentTime==(lastFed+1)){
    update("playing");
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update(Bathing);
    foodObj.washroom();
  }else{
    update("Hungry")
    foodObj.display();
  }
 var addFood = createButton("Add Food");
 addFood.position(500,125)
 if(addFood.mousePressed(function(){
  foodS = foodS + 1;
  gameState = 2;
  database.ref('/').update({'gameState':gameState})
 }));
}
 
 
  

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){

  if(x<=0){
    x = 0;
  }else{
    x=x-1;
  }


database.ref('/').update({
  Food:x
 })
}

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
   foodS++;
   database.ref('/').update({
     Food:foodS
   })

}
function update(state){
  database.ref('/').update({
    gameState:state
  });
}