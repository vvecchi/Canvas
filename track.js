function Segment(){
    this.y = 0;
    this.z = 0;
    this.shaded = 0;
    this.sizeOnScreen = 0;
}

function MyCar(yWorld,horizon){
    this.z = 0.5;
    this.x = 10;
    this.width = 94;
    this.height = 56;
    this.offsetX = 0;
    this.offsetY = 0;
    this.isBreaking = false;
    this.yWorld = yWorld;
    this.horizon = horizon;
    
    
    this.draw = function(canvas, ctx){
        carimg = document.getElementById('car')
        objy = canvas.height - ((this.yWorld/this.z) + (this.horizon))  - ((this.height/2) + 20)/this.z;
        objx = canvas.width/2 - this.x/2/this.z
        ctx.drawImage(carimg, this.offsetX,this.offsetY,this.width,this.height,objx - (this.width/2)/this.z , objy, (this.width)/this.z, (this.height)/this.z);
        if(this.isBreaking){
        /*    ctx.fillStyle = "rgba(256,0,0,0.6)";
            ctx.fillRect (this.x - (this.width/2)/this.z + 20, objy + (2.75*this.height/4)/this.z, 20, 7);
            ctx.fillRect (this.x + (this.width/2)/this.z - 34, objy + (2.75*this.height/4)/this.z, 20 , 7);*/
        }
    }
}

function Track(yWorld,horizon, width, height){
    
    this.pos = 0;
    this.horizon = horizon;
    this.height = height;
    this.width = width;
    var lastPos = 0;
    var numsegs = 120;
    var totalDist = -yWorld;
    var printz = true;
    var zs = new Array()
    for(i = 0; i < this.height; i++){
        zs[i] = yWorld/(i - (this.height/2));
        if(zs[i] < 0)
        {
            zs[i] = -zs[i];
        }
    }
    var segsize = totalDist/numsegs;
    var segments = new Array();
    
    for(i = 0;i < numsegs; i++){
        segment = new Segment();
        if(i == 0)segment.z = zs[239];
        else segment.z = i*segsize;
        segment.shaded = i%2;
        segments[i] = segment;
    }
    
    var firstIndex = 0;
    var lastIndex = numsegs - 1;
    var firstSegSize = segsize - segments[firstIndex];
    
    
    this.draw = function(canvas,ctx){
        var img = document.getElementById('track');
        var imgdark = document.getElementById('trackdark');
        var y = canvas.height - 1;
        y = parseInt(y);
        ctx.drawImage(img,0, 0, img.width, 1, 0, 0, canvas.width, canvas.height);
        for(i = 0; i < 20 ; i++){
            var curIndex = (i + firstIndex) % numsegs;
            var nextIndex = (curIndex + 1)%numsegs;
            var ynew = canvas.height - ((yWorld/segments[nextIndex].z) + this.horizon + 1);
            ynew = parseInt(ynew);
            var sizeOnScreen =  ynew - y;
            var drawImg = img;
            if(segments[curIndex].shaded == 1){
                drawImg = imgdark;
            }
            for(ypos = y; ypos > y + sizeOnScreen;  ypos--){
                track.x = canvas.width/2;
                ctx.drawImage(drawImg,0,200,1,1,0,ypos,canvas.width,1);
                ctx.drawImage(drawImg, 0, 220, drawImg.width,1, canvas.width/2 - (canvas.width/zs[ypos])/2, ypos, canvas.width/zs[ypos],1);
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
        /*	if(canvas.height - ((yWorld/segments[nextIndex].z) + this.horizon + 1) < this.horizon){
                alert("lastIndex = " + lastIndex + "firstIndex = " + firstIndex + )
            }*/
        }
    }
}