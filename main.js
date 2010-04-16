var MSECONDS_BETWEEN_FRAMES = 1000/600;//1 for the highest possible fps, good for testing, 1000/60 for 60 fps
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
var yWorld = - 75;

var trackObjects = new Array();
var track = new Track(yWorld,horizon,screenWidth,screenHeight,trackObjects,trackWidth);
var myCar = new MyCar(yWorld,horizon,screenWidth,screenHeight);
var trackXs = new Array();
var lastFrame = new Date().getTime();
var backgroundX = 0;


function doTheDrawing(ctx,canvas,img,sx,sy,sw,sh,dx,dy,dw,dh){
		try{
			ctx.drawImage(img, sx , sy, sw, sh, dx, dy, dw, dh) ;	
		}
		catch(e){
		
		}
}

function draw(){
    drawBackground(canvas,ctx,backgroundX);
    track.draw(canvas,ctx,myCar.x,trackXs);
    var drawableTrackObjectsFront = trackObjects.filter(function(a){return a.z > 0.1 && a.z < myCar.z});
	var drawableTrackObjectsBack = trackObjects.filter(function(a){return a.z >= myCar.z && a.z < -yWorld});
    drawableTrackObjectsFront.sort(function(a,b){return b.z - a.z});
	drawableTrackObjectsBack.sort(function(a,b){return b.z - a.z});
    var img = document.getElementById('trackobjects');
	drawTrackObjects(drawableTrackObjectsBack, canvas, ctx, img, yWorld, horizon, myCar.x, trackXs, trackWidth);
	myCar.draw(canvas,ctx);
    drawTrackObjects(drawableTrackObjectsFront, canvas, ctx, img, yWorld, horizon, myCar.x, trackXs, trackWidth);
 }

//================= input handling =============================================//

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
            backgroundX -= 1/8*turnAmount*dt * turnSpeedScale;
            myCar.turnState = left;
        }
        if(isTurninhRight){
            myCar.x += turnAmount*dt * turnSpeedScale;
            backgroundX += 1/8*turnAmount*dt * turnSpeedScale;
            myCar.turnState = right;
        }
    }
    if(!isTurningLeft && !isTurninhRight)
    {
        myCar.turnState = straight;
    }
}
//========================================


 // update the game world
 function update(){
    //handle time elapsed
    thisFrame = new Date().getTime();
    var dt = (thisFrame - this.lastFrame)/1000;
    this.lastFrame = thisFrame;
    
    handleInput(dt);
    
    //update player car
    dpos = speed * dt *speedScale;
    pos = pos + dpos;
    myCar.x -= 2*track.carSegment.curve*speed *100*dt;
    myCar.isBraking = isBraking;
    
    track.update(pos);
    
    updateTrackObjects(trackObjects,dt,pos);
    
    if(document.all){
	    document.getElementById('framerate').innerText = "fps: "+parseInt(1/dt);
	}
	else{
		document.getElementById('framerate').textContent = "fps: "+parseInt(1/dt);
	}
 }
 
 
 function init(){
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    if(document.all){
    	trackData = document.getElementById('trackdata').innerText;
	}
	else{
		trackData = document.getElementById('trackdata').textContent;
	}


    track.initTrackData(trackData);
    canvas.width = screenWidth;
    canvas.height = screenHeight;
    setInterval(function(){update();draw();}, MSECONDS_BETWEEN_FRAMES);
 }
