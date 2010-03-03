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
var accelerateKeyDown = 97;
var breakKeyDown = 122;
var accelerateKeyUp = 65;
var breakKeyUp = 90;


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
	}
	else if(isBreaking){
		velocity -=  deceleration*dt
		if(velocity < 0){
			velocity = 0;
		}
	}
	else{
		velocity -=  acceleration/2*dt
		if(velocity < 0){
			velocity = 0;
		}
	}
	
    pos = pos + velocity * dt *speedScale;
    track.update(pos);
 }
 
 function init(){
    setInterval(function(){update();}, SECONDS_BETWEEN_FRAMES)
    setInterval(function(){draw();}, SECONDS_BETWEEN_FRAMES)
 }

document.onkeypress =function(e) {
	if(e.which == accelerateKeyDown){
		isAccelerating = true;
		isBreaking = false;
	}
	else if(e.which = breakKeyDown){
		isBreaking = true;
		isAccelerating = false;
	}
}

document.onkeyup = function(e) {

	if(e.which == accelerateKeyUp){
		
		isAccelerating = false;
	}
	if(e.which = breakKeyUp){
		isBreaking = false;
	}
}