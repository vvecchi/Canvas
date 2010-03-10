var MSECONDS_BETWEEN_FRAMES = 1000/60;
var pos = 0;
var speed = 0;
var maxspeed = 200;
var speedScale = 0.05
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
var trackWidth = 290;

lastFrame = new Date().getTime();
horizon = screenHeight/2;
yWorld = - 80;
var trackObjects = new Array();
var track = new Track(yWorld,horizon,screenWidth,screenHeight,trackObjects,trackWidth);
var myCar = new MyCar(yWorld,horizon,screenWidth,screenHeight);
var trackXs = new Array();
function draw(){
    var ctx = canvas.getContext('2d');
    
    track.draw(canvas,ctx,myCar.x,trackXs);
    trackObjects = trackObjects.sort(function(a,b){return a.z - b.z});
    myCar.draw(canvas,ctx);
    var img = document.getElementById('trackobjects');
    for(i = 0; i < trackObjects.length; i ++){
        trackObject = trackObjects[i];
        drawTrackObject(trackObject,canvas,ctx,img,yWorld,horizon,myCar.x,trackXs,trackWidth);
    }
    
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
        turnSpeedScale = 1;
        if(speed < 50){
            turnSpeedScale = turnSpeedScale*speed/50;
        }
        if(isTurningLeft){
            myCar.x -= turnAmount* dt * turnSpeedScale;
            myCar.turnState = left;
        }
        if(isTurninhRight){
            myCar.x += turnAmount*dt * turnSpeedScale;
            myCar.turnState = right;
        }
    }
    if(!isTurningLeft && !isTurninhRight)
    {
        myCar.turnState = straight;
    }
    dpos = speed * dt *speedScale;
    pos = pos + dpos;
    track.update(pos);
    myCar.x -= track.carSegment.curve*speed *100*dt;
    myCar.isBreaking = isBreaking;
    for(i = 0; i < trackObjects.length; i++){
        trackObject = trackObjects[i];
        trackObject.z = trackObject.z - dpos + trackObject.speed * dt *speedScale;
        if(trackObject.z <= myCar.z + dpos && trackObject.z > myCar.z - dpos){
            if(myCar.x > trackObject.x - trackObject.width/2 &&
                myCar.x < trackObject.x + trackObject.width/2){
                speed = 0;
                myCar.x = 0;
            }            
        }
        if(trackObject.z < 0.1){
            
        }
    }
 }
 
 function init(){
    canvas = document.getElementById('canvas');
    canvas.width = screenWidth;
    canvas.height = screenHeight;
    setInterval(function(){update();}, MSECONDS_BETWEEN_FRAMES)
    setInterval(function(){draw();}, MSECONDS_BETWEEN_FRAMES)
 }

