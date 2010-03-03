var COUNT = 0;
var NUMSEGS = 5;
var SEGSIZE = (240/2)/NUMSEGS;
var SECONDS_BETWEEN_FRAMES = 1/60;
var pos = 0;
var velocity = 0;
var maxVelocity = 200;
var speedScale = 0.04
lastFrame = new Date().getTime();
var track = new Track();
var isAccelerating = false;
var isBreaking = false;
var acceleration = 50;
var deceleration = 100;
var accelerateKey = 97;
var breakKey = 122;

function draw(){
   track.draw();
 }
 
 function update(){
    thisFrame = new Date().getTime();
    var dt = (thisFrame - this.lastFrame)/1000;
    this.lastFrame = thisFrame;
	if(isAccelerating){
		if(velocity < maxVelocity){
			velocity += acceleration*dt;
		}
		isAccelerating = false;
	}
	else if(isBreaking){
			velocity -=  deceleration*dt
		if(velocity < 0){
			velocity = 0;
		}
		isBreaking = false;
	}
    pos = pos + velocity * dt *speedScale;
    track.update(pos);
 }
 
 function init(){
    setInterval(function(){update();}, SECONDS_BETWEEN_FRAMES)
    setInterval(function(){draw();}, SECONDS_BETWEEN_FRAMES)
 }

document.onkeypress=function(e) {
	if(e.which == accelerateKey){
		isAccelerating = true;
		isBreaking = false;
	}
	else if(e.which = breakKey){
		isBreaking = true;
		isAccelerating = false;
	}
}