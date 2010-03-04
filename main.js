var COUNT = 0;
var NUMSEGS = 5;
var SEGSIZE = (240/2)/NUMSEGS;
var SECONDS_BETWEEN_FRAMES = 1000/120;
var pos = 0;
var velocity = 0;
var maxVelocity = 200;
var speedScale = 0.04
var isAccelerating = false;
var isBreaking = false;
var acceleration = 50;
var deceleration = 100;

var accelerateKey = 65;
var breakKey = 90;
var screenWidth = 320;
var screenHeight = 240;

lastFrame = new Date().getTime();
horizon = screenHeight/2;
yWorld = -80;
var track = new Track(yWorld,horizon,screenWidth,screenHeight);
var myCar = new MyCar(yWorld,horizon,screenWidth,screenHeight);


function draw(){
    var ctx = canvas.getContext('2d');
    track.draw(canvas,ctx);
    myCar.draw(canvas,ctx);
 }
 
 function update(){
    thisFrame = new Date().getTime();
    var dt = (thisFrame - this.lastFrame)/1000;
    this.lastFrame = thisFrame;
    if(isAccelerating){
        if(velocity < maxVelocity){
            velocity += acceleration*dt;
        }
    }
    if(isBreaking){
        velocity -=  deceleration*dt
        if(velocity < 0){
            velocity = 0;
        }
    }
    if(!isAccelerating && !isBreaking){
        velocity -=  acceleration/2*dt
        if(velocity < 0){
            velocity = 0;
        }
    }

    pos = pos + velocity * dt *speedScale;
    myCar.isBreaking = isBreaking;
    track.update(pos);
 }
 
 function init(){
    canvas = document.getElementById('canvas');
    canvas.width = screenWidth;
    canvas.height = screenHeight;
    setInterval(function(){update();}, SECONDS_BETWEEN_FRAMES)
    setInterval(function(){draw();}, SECONDS_BETWEEN_FRAMES)
 }

document.onkeydown =function(e) {
    if(e.which == accelerateKey){
        isAccelerating = true;
    }
    else if(e.which = breakKey){
        isBreaking = true;
    }
}

document.onkeyup = function(e) {
    if(e.which == accelerateKey){
        
        isAccelerating = false;
    }
    if(e.which = breakKey){
        isBreaking = false;
    }
}