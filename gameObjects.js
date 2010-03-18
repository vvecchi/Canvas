var straight = 0;
var left = 1;
var right = 2;

function Segment(){
    this.y = 0;
    this.z = 0;
    this.x = 0;
    this.curve = 0;
    this.shaded = 0;
}

function TrackObject() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.speed = 0;
    this.spriteOffsetX = 0;
    this.spriteOffsetY = 0;
    this.spriteWidth = 30;
    this.spriteHeight = 87;
    this.spriteScale = 2;
    this.width = 60;
}
function drawTrackObjects(trackObjects, canvas, ctx, img, yWorld, horizon, carX, trackXs, trackWidth){
    for(i = 0; i < trackObjects.length; i ++){
        trackObject = trackObjects[i];
        objy = canvas.height - ((yWorld/trackObject.z) + (horizon))  - trackObject.spriteHeight/trackObject.z * trackObject.spriteScale;
        objBaseY = parseInt(objy + trackObject.spriteHeight/trackObject.z* trackObject.spriteScale);
        objx = trackXs[objBaseY] - (((canvas.width - trackWidth)/2 - trackObject.x + myCar.x + (trackObject.spriteWidth/2 * trackObject.spriteScale))/trackObject.z);
        
        sx = trackObject.spriteOffsetX;
        sy = trackObject.spriteOffsetY;
        sw = trackObject.spriteWidth;
        sh = trackObject.spriteHeight;
        
        dx = objx; 
        dy = objy;
        dw = (trackObject.spriteWidth)/trackObject.z * trackObject.spriteScale;
        dh = (trackObject.spriteHeight)/trackObject.z * trackObject.spriteScale;
        ctx.drawImage(img, sx , sy, sw, sh, dx, dy, dw, dh) ;
    }
}
function updateTrackObjects(trackObjects,dt){
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
    }
}

function drawBackground(){
    var img = document.getElementById('panorama');
    var drawWidth = canvas.width;
    backgroundX = backgroundX%img.width;
    while(backgroundX < 0){
        backgroundX = img.width + backgroundX;
    }
    
    if(img.width - backgroundX < canvas.width){
        drawWidth = img.width - backgroundX;
    }
    ctx.drawImage(img, backgroundX, 0, drawWidth, img.height, 0, 0, drawWidth, canvas.height);
    if(drawWidth < canvas.width){
        ctx.drawImage(img, 0, 0, canvas.width - drawWidth, img.height, drawWidth, 0, canvas.width - drawWidth, canvas.height);
    }
}
function MyCar(yWorld,horizon){
    this.z = 0.9;
    this.x = 0;
    this.width = 86;
    this.height = 50;
  
    this.isBraking = false;
    this.turnState = straight;
        
    this.yWorld = yWorld;
    this.horizon = horizon;
    
    var carFrameOffsetX = new Array();
    var carFrameOffsetY = new Array();

    carFrameOffsetX[straight] = 94;
    carFrameOffsetY[straight] = 7;

    carFrameOffsetX[left] = 6;
    carFrameOffsetY[left] = 7;

    carFrameOffsetX[right] = 357;
    carFrameOffsetY[right] = 7;

    
    
    this.draw = function(canvas, ctx){
        carimg = document.getElementById('car')
        objy = canvas.height - ((this.yWorld/this.z) + (this.horizon))  - (this.height/2)/this.z;
        objx = canvas.width/2;
        ctx.drawImage(carimg, carFrameOffsetX[this.turnState],carFrameOffsetY[this.turnState],this.width,this.height,objx - (this.width/2)/this.z , objy, (this.width)/this.z, (this.height)/this.z);
    }
}

function Track(yWorld,horizon, width, height,trackObjectsArray,trackWidth){
    this.pos = 0;
    this.horizon = horizon;
    this.height = height;
    this.width = width;
    this.trackWidth = trackWidth;
    this.trackObjectsArray = trackObjectsArray;
    this.trackDataIndex = 0;
    this.trackData = "|";
    
    var lastPos = 0;
    var numsegs = 30;
    var totalDist = -yWorld;
    
    //create the z map for the screen
    var zs = new Array()
    for(i = 0; i < this.height; i++){
        zs[i] = yWorld/( i - this.horizon);
        if(zs[i] < 0){
            zs[i] = -zs[i];
        }
    }
    var segsize = totalDist/(numsegs*4); //the last segments have less than one line of height
    //create the track segments
    var segments = new Array();
    for(i = 0;i < numsegs; i++){
        segment = new Segment();
        if(i == 0)segment.z = zs[this.height - 1];
        else segment.z = i*segsize;
        segment.shaded = i%2;
        //each segment gets a palm tree, in alternating sides of it
        //TODO: define the trackside objects somewhere else
        if(segment.shaded){
            var trackObject = new TrackObject();
            trackObject.x = trackWidth/2 + 10;
            trackObject.z = segment.z;
            trackObjectsArray.push(trackObject);
        }else{
            trackObject = new TrackObject();
            trackObject.x = -trackWidth/2 - 10;
            trackObject.z = segment.z;
            trackObject.spriteOffsetX = 30;
            trackObjectsArray.push(trackObject);
        }
       segments[i] = segment;
    }
    this.carSegment = segments[0];//car segment is the segment where the car is
    var firstIndex = 0;//The segments array gets wrapped and its elements are reused
    var lastIndex = numsegs - 1;
    
    this.draw = function(canvas,ctx, carX,trackXs){
        var img = document.getElementById('track');
        var imgdark = document.getElementById('trackdark');
        var y = canvas.height - 1;
        y = parseInt(y);
        dx = 0;
        trackX = canvas.width/2 ;
        
        for(i = 0; i < numsegs -1; i++){
            var curIndex = (i + firstIndex) % numsegs;
            var nextIndex = (curIndex + 1)%numsegs;
            var ynew = canvas.height - ((yWorld/segments[nextIndex].z) + this.horizon + 1);
            ynew = parseInt(ynew);
            var sizeOnScreen =  ynew - y;
            var drawImg = img;
            if(segments[curIndex].shaded == 1){
                drawImg = imgdark;
            }
             //draw the track  segment line by line, updating its x position if the road is curving
            for(ypos = y; ypos > y + sizeOnScreen;  ypos--){
                trackX +=  dx;
                trackXs[ypos] = trackX;
                if(zs[ypos] > 0.75){// if the track position is after car.z (above the car on sreen) make the road bend
                    dx += segments[curIndex].curve * zs[ypos];
                }
                ctx.drawImage(drawImg,1,200,1,1,0,ypos,canvas.width,1);//draw the grass
                ctx.drawImage(drawImg, 0, 220, drawImg.width,1, trackX - ((canvas.width/2 + carX)/zs[ypos]), ypos, canvas.width/zs[ypos],1);//draw the track, with some perspective transform
            }
            y = ynew;
        }
    }
    
    this.getCurveAmount = function(index){
        var curveAmount = 0;
        switch(trackData.charAt(index%trackData.length)){
            case '(':
                curveAmount = 0.01;
                break;
            case ')':
                curveAmount = -0.01;
                break;
            case '<':
                curveAmount = 0.02;
                break;
            case '>':
                curveAmount = -0.02;
                break;
            case '|':
            default:
                break;
        }
        return curveAmount;
    }
    
    this.initTrackData = function(trackData){
        this.trackData = trackData;
        for( i = 0; i < numsegs; i ++){
            segments[i].curve = this.getCurveAmount(i);
        }
        this.trackDataIndex = i;
    }
    
    this.update = function(pos){
        dPos = lastPos - pos;
        lastPos = pos;
        for(i = 0; i < numsegs; i ++){
            segments[i].z += dPos;
        }
        segments[firstIndex].z = zs[canvas.height - 1];
        //when the second segment gets to the bottom of the screen, reuse the first segment to create a new track segment
        while(segments[(firstIndex + 1)%numsegs].z < 0.1){
            segments[firstIndex].z = segments[lastIndex].z + segsize;
            lastIndex = firstIndex;
            firstIndex = (firstIndex + 1) % numsegs;
            segments[lastIndex].curve = this.getCurveAmount(this.trackDataIndex);
            this.trackDataIndex += 1;
            // put a roadsied object going along this segment
            // try to reuse an track object, if not available create one
            if(segments[lastIndex].shaded){
                for(i = 0; i < this.trackObjectsArray.length; i ++){
                    if(this.trackObjectsArray[i].z < 0.1){
                        this.trackObjectsArray[i].z = segments[lastIndex].z;
                        this.trackObjectsArray[i].x = this.trackWidth/2 + 10;
                        this.trackObjectsArray[i].spriteOffsetX = 0;
                        break;
                    }
                }
                if(i = this.trackObjectsArray.length){
                  var trackObject = new TrackObject();
                    trackObject.x = this.trackWidth/2 + 10;
                    trackObject.z = segments[lastIndex].z;
                    trackObject.spriteOffsetX = 0;
                    this.trackObjectsArray.push(trackObject);
                }
            }
            else
            {
                for(i = 0; i < this.trackObjectsArray.length; i ++){
                    if(this.trackObjectsArray[i].z < 0.1){
                        this.trackObjectsArray[i].z = segments[lastIndex].z;
                        this.trackObjectsArray[i].x = - this.trackWidth/2 - 10;
                        this.trackObjectsArray[i].spriteOffsetX = 30;
                        break;
                    }
                }
                if(i = this.trackObjectsArray.length){
                  var trackObject = new TrackObject();
                    trackObject.x = - this.trackWidth/2 - 10;
                    trackObject.z = segments[lastIndex].z;
                    trackObject.spriteOffsetX = 30;
                    this.trackObjectsArray.push(trackObject);
                }
            }
        }
        // update which the segment the car is in
        for(i = 0; i < numsegs - 1; i++){
            if(segments[(i + firstIndex)%numsegs].z > 0.75){
                break;
            }
            this.carSegment = segments[(i + firstIndex)%numsegs];
        }
    }
}