var MSECONDS_BETWEEN_FRAMES = 1000/60;
var pos = 0;
var speed = 0;
var maxspeed = 200;
var speedScale = 0.05
var isAccelerating = false;
var isBraking = false;
var isTurningLeft = false;
var isTurninhRight = false;
var acceleration = 50;
var deceleration = 150;
var turnAmount = 300;

var accelerateKey = 65;
var breakKey = 90;
var leftKey = 188;
var rightKey = 190;

var screenWidth = 320;
var screenHeight = 240;
var trackWidth = 290;
var horizon = screenHeight/2;
var yWorld = - 80;

var trackObjects = new Array();
var track = new Track(yWorld,horizon,screenWidth,screenHeight,trackObjects,trackWidth);
var myCar = new MyCar(yWorld,horizon,screenWidth,screenHeight);
var trackXs = new Array();
var lastFrame = new Date().getTime();
var backgroundX = 0;


function draw(){
    drawBackground(backgroundX);
    track.draw(canvas,ctx,myCar.x,trackXs);
    trackObjects.sort(function(a,b){return a.z - b.z});
    var drawableTrackObjects = trackObjects.filter(function(a){return a.z > 0.4 && a.z < -yWorld/4});
    myCar.draw(canvas,ctx);
    var img = document.getElementById('trackobjects');
    drawTrackObjects(drawableTrackObjects, canvas, ctx, img, yWorld, horizon, myCar.x, trackXs, trackWidth);
 }

document.onkeydown =function(e) {
    if(e.which == accelerateKey){
        isAccelerating = true;
    }
    if(e.which == breakKey){
        isBraking = true;
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
        isBraking = false;
    }
    if(e.which == leftKey){
        isTurningLeft = false;
    }
    if(e.which == rightKey){
        isTurninhRight = false;
    }
}

function handleInput(dt){
    if(isAccelerating){
        if(speed < maxspeed){
            speed += acceleration*dt;
        }
    }
    if(isBraking){
        speed -=  deceleration*dt
        if(speed < 0){
            speed = 0;
        }
    }
    if(!isAccelerating && !isBraking){
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
}
 
 function update(){
    //handle time elapsed
    thisFrame = new Date().getTime();
    var dt = (thisFrame - this.lastFrame)/1000;
    this.lastFrame = thisFrame;
    handleInput(dt);
    //update player car
    dpos = speed * dt *speedScale;
    pos = pos + dpos;
    myCar.x -= track.carSegment.curve*speed *100*dt;
    myCar.isBraking = isBraking;
    //update track
    track.update(pos);
    updateTrackObjects(trackObjects,dt);
    
    backgroundX += track.carSegment.curve*speed *100*dt;

 }
 
 
 function init(){
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    trackData = document.getElementById('trackdata').innerText;
    track.initTrackData(trackData);
    canvas.width = screenWidth;
    canvas.height = screenHeight;
    setInterval(function(){update();draw();}, MSECONDS_BETWEEN_FRAMES);
 }
