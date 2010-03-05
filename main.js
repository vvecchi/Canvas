var SECONDS_BETWEEN_FRAMES = 16;
var pos = 0;
var speed = 0;
var maxspeed = 200;
var speedScale = 0.06
var isAccelerating = false;
var isBreaking = false;
var isTurningLeft = false;
var isTurninhRight = false;
var acceleration = 50;
var deceleration = 100;
var turnAmount = 300;

var accelerateKey = 65;
var breakKey = 90;
var leftKey = 188;
var rightKey = 190;
var screenWidth = 320;
var screenHeight = 240;

lastFrame = new Date().getTime();
horizon = screenHeight/2;
yWorld = - 80;
var track = new Track(yWorld,horizon,screenWidth,screenHeight);
var myCar = new MyCar(yWorld,horizon,screenWidth,screenHeight);


function draw(){
    var ctx = canvas.getContext('2d');
    track.draw(canvas,ctx,myCar.x);
    myCar.draw(canvas,ctx);
 }

document.onkeydown =function(e) {
    if(e.which == accelerateKey){
        isAccelerating = true;
    }
    if(e.which == breakKey){
        isBreaking = true;
    }
    if(e.which == leftKey){
        isTurningLeft = true;
    }
    if(e.which == rightKey){
        isTurninhRight = true;
    }
}

document.onkeyup = function(e) {
    if(e.which == accelerateKey){
        isAccelerating = false;
    }
    if(e.which == breakKey){
        isBreaking = false;
    }
    if(e.which == leftKey){
        isTurningLeft = false;
    }
    if(e.which == rightKey){
        isTurninhRight = false;
    }
}
 
 function update(){
    thisFrame = new Date().getTime();
    var dt = (thisFrame - this.lastFrame)/1000;
    this.lastFrame = thisFrame;
    
    if(isAccelerating){
        if(speed < maxspeed){
            speed += acceleration*dt;
        }
    }
    if(isBreaking){
        speed -=  deceleration*dt
        if(speed < 0){
            speed = 0;
        }
    }
    if(!isAccelerating && !isBreaking){
        speed -=  acceleration/2*dt
        if(speed < 0){
            speed = 0;
        }
    }
    if(speed > 0){
        if(isTurningLeft){
            myCar.x -= turnAmount* dt;
        }
        if(isTurninhRight){
            myCar.x += turnAmount*dt;
        }
    }
    pos = pos + speed * dt *speedScale;
    track.update(pos);
    myCar.x -= track.carSegment.curve*speed *100*dt;
    myCar.isBreaking = isBreaking;
    
 }
 
 function init(){
    canvas = document.getElementById('canvas');
    canvas.width = screenWidth;
    canvas.height = screenHeight;
    setInterval(function(){update();}, SECONDS_BETWEEN_FRAMES)
    setInterval(function(){draw();}, SECONDS_BETWEEN_FRAMES)
 }

