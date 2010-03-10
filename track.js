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
    this.spriteWidth = 60;
    this.spriteHeight = 175;
    this.width = 32;
}
function drawTrackObject(trackObject,canvas,ctx,img,yWorld,horizon,carX,trackXs,trackWidth){
    if(trackObject.z < 0.1 || trackObject.z > - yWorld/4)return;
    objy = canvas.height - ((yWorld/trackObject.z) + (horizon))  - trackObject.spriteHeight/trackObject.z;
    objBaseY = parseInt(objy + trackObject.spriteHeight/trackObject.z);
    objx = trackXs[objBaseY] - (((canvas.width - trackWidth)/2 - trackObject.x + carX + (trackObject.spriteWidth/2))/trackObject.z)
    ctx.drawImage(img, trackObject.spriteOffsetX ,trackObject.spriteOffsetY,
                    trackObject.spriteWidth, trackObject.spriteHeight, objx, objy ,
                    (trackObject.spriteWidth)/trackObject.z, (trackObject.spriteHeight)/trackObject.z);

}


var frameOffsetX = new Array();
var frameOffsetY = new Array();

var straight = 0;
var left = 1;
var right = 2;

frameOffsetX[straight] = 94;
frameOffsetY[straight] = 7;

frameOffsetX[left] = 6;
frameOffsetY[left] = 7;

frameOffsetX[right] = 357;
frameOffsetY[right] = 7;

function MyCar(yWorld,horizon){
    this.z = 0.9;
    this.x = 0;
    this.width = 86;
    this.height = 50;
  
    this.isBreaking = false;
    this.turnState = straight;
        
    this.yWorld = yWorld;
    this.horizon = horizon;
    
    
    this.draw = function(canvas, ctx){
        carimg = document.getElementById('car')
        objy = canvas.height - ((this.yWorld/this.z) + (this.horizon))  - (this.height/2)/this.z;
        objx = canvas.width/2;
        ctx.drawImage(carimg, frameOffsetX[this.turnState],frameOffsetY[this.turnState],this.width,this.height,objx - (this.width/2)/this.z , objy, (this.width)/this.z, (this.height)/this.z);
        if(this.isBreaking){
        /*    ctx.fillStyle = "rgba(256,0,0,0.6)";
            ctx.fillRect (this.x - (this.width/2)/this.z + 20, objy + (2.75*this.height/4)/this.z, 20, 7);
            ctx.fillRect (this.x + (this.width/2)/this.z - 34, objy + (2.75*this.height/4)/this.z, 20 , 7);*/
        }
    }
}

function Track(yWorld,horizon, width, height,trackObjectsArray,trackWidth){
    
    this.pos = 0;
    this.horizon = horizon;
    this.height = height;
    this.width = width;
    this.trackWidth = trackWidth;
    this.trackObjectsArray = trackObjectsArray;
    var lastPos = 0;
    var numsegs = 120;
    var totalDist = -yWorld;
    var printz = true;
    var zs = new Array()
    for(i = 0; i < this.height; i++){
        zs[i] = yWorld/( i - this.horizon);
        if(zs[i] < 0)
        {
            zs[i] = -zs[i];
        }
    }
    var segsize = totalDist/numsegs;
    var segments = new Array();
    
    for(i = 0;i < numsegs; i++){
        segment = new Segment();
        if(i == 0)segment.z = zs[this.height - 1];
        else segment.z = i*segsize;
        segment.shaded = i%2;
        var trackObject = new TrackObject();
        trackObject.x = trackWidth/2 + 10;
        trackObject.z = segment.z;
        trackObjectsArray.push(trackObject);
        
        trackObject = new TrackObject();
        trackObject.x = -trackWidth/2 - 10;
        trackObject.z = segment.z;
        trackObject.spriteOffsetX = 60;
        trackObjectsArray.push(trackObject);
       
        if(i > 4 && i < 30){
            segment.curve = 0.01
            
        }
        else if(i > 35 && i < 80){
            segment.curve = -0.01
        }
        else if(i > 95){
            segment.curve = 0.005;
        }
        segments[i] = segment;
    }
    this.carSegment = segments[0];
    var firstIndex = 0;
    var lastIndex = numsegs - 1;
    var firstSegSize = segsize - segments[firstIndex];
    
    
    this.draw = function(canvas,ctx, carX,trackXs){
        var img = document.getElementById('track');
        var imgdark = document.getElementById('trackdark');
        var y = canvas.height - 1;
        y = parseInt(y);
        ctx.drawImage(img,0, 0, img.width, 1, 0, 0, canvas.width, canvas.height);
        ddx = 0;
        trackX = canvas.width/2 ;
        for(i = 0; i < 20 ; i++){
            var curIndex = (i + firstIndex) % numsegs;
            var nextIndex = (curIndex + 1)%numsegs;
            var ynew = canvas.height - ((yWorld/segments[nextIndex].z) + this.horizon + 1);
            ynew = parseInt(ynew);
            if(ynew > y){
                ynew = y;
            }
            var sizeOnScreen =  ynew - y;
            var drawImg = img;
            if(segments[curIndex].shaded == 1){
                drawImg = imgdark;
            }
            for(ypos = y; ypos > y + sizeOnScreen;  ypos--){
                trackX +=  ddx;
                trackXs[ypos] = trackX;
                if(zs[ypos] > 0.75){// car.z
                    ddx += segments[curIndex].curve;
                }
                ctx.drawImage(drawImg,1,200,1,1,0,ypos,canvas.width,1);
                ctx.drawImage(drawImg, 0, 220, drawImg.width,1, trackX - ((canvas.width/2 + carX)/zs[ypos]), ypos, canvas.width/zs[ypos],1);
            }
            y = ynew;
        }
    }
     
    this.update = function(pos){
        dPos = lastPos - pos;
        lastPos = pos;
        for(i = 0; i < numsegs; i ++){
            segments[i].z += dPos;
        }
        firstSegSize += dPos;
        segments[firstIndex].z = zs[239];
        while(segments[(firstIndex + 1)%numsegs].z < 0.1){
            segments[firstIndex].z = segments[lastIndex].z + segsize;
            lastIndex = firstIndex;
            firstIndex = (firstIndex + 1) % numsegs;
            firstSegSize = segsize;
            
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
            for(i = 0; i < this.trackObjectsArray.length; i ++){
                if(this.trackObjectsArray[i].z < 0.1){
                    this.trackObjectsArray[i].z = segments[lastIndex].z;
                    this.trackObjectsArray[i].x = - this.trackWidth/2 - 10;
                    this.trackObjectsArray[i].spriteOffsetX = 60;
                    break;
                }
            }
            if(i = this.trackObjectsArray.length){
              var trackObject = new TrackObject();
                trackObject.x = - this.trackWidth/2 - 10;
                trackObject.z = segments[lastIndex].z;
                trackObject.spriteOffsetX = 60;
                this.trackObjectsArray.push(trackObject);
            }
        }
        
        for(i = firstIndex; i < firstIndex + 20; i = (i+1)%numsegs){
            if(segments[i].z > 0.75){
                break;
            }
            this.carSegment = segments[i];
        }
    }
}