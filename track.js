function Segment(){
    this.y = 0;
    this.z = 0;
    this.shaded = 0;
    this.sizeOnScreen = 0;
}

function TrackObject(){
    this.z = 0;
}

function Track(){
    
    this.pos = 0;
    this.horizon = 120;
    
    var lastPos = 0;
    var numsegs = 120;
    var totalDist = 0;
    var yWorld = - 80;
    var printz = true;
    var zs = new Array()
    for(i = 0; i < 240; i++){
        zs[i] = yWorld/(i - (240/2));
    }
    totalDist = - yWorld;
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
    
    var trackObject = new TrackObject();
    trackObject.z = segments[1].z + segsize/4;
    
    this.draw = function(){
        var canvas = document.getElementById('tutorial');
        var ctx = canvas.getContext('2d');
        var img = document.getElementById('track');
        var imgdark = document.getElementById('trackdark');
        var y = canvas.height - 1;
        y = parseInt(y);
        ctx.drawImage(img,0, 0, img.width, 1, 0, 0, canvas.width, canvas.height);
        for(i = 1; i < 30 ; i++){
            var curIndex = (i + firstIndex) % numsegs;
            var nextIndex = (curIndex + 1)%numsegs;
            var ynew = canvas.height - ((yWorld/segments[nextIndex].z) + this.horizon + 1);
            ynew = parseInt(ynew);
            var sizeOnScreen =  ynew - y;
            var drawImg = img
            if(segments[curIndex].shaded == 1){
                drawImg = imgdark;
            }
			
            for(ypos = y; ypos > y + sizeOnScreen;  ypos--){
                ctx.drawImage(drawImg,0,200,1,1,0,ypos,canvas.width,1);
                ctx.drawImage(drawImg, 0, 220, drawImg.width,1, 160 - (canvas.width/2)/zs[ypos], ypos, canvas.width/zs[ypos],1);
            }
            y = ynew;
        }
        
        objy = canvas.height - ((yWorld/trackObject.z) + (this.horizon));
        if(objy < this.horizon)
        {
            objy= this.horizon;
        }
        carimg = document.getElementById('car')
		//0,0,96,56
		carwidth = 96;
		carheight = 56;
		carx = 160;
        ctx.drawImage(carimg,0,0,carwidth,carheight,carx - (carwidth/2)/trackObject.z , objy - (carimg.height/20)/trackObject.z, (carwidth)/trackObject.z, (carheight)/trackObject.z);
    }
     
    this.update = function(pos){
        dPos = lastPos - pos;
        lasPos = pos;
        dPos = - totalDist/10000;
    //    trackObject.z += dPos;
        if(trackObject.z <= 0.001){
//            trackObject.z = totalDist/2;
        }
        for(i = 0; i < numsegs; i ++){
            segments[i].z += dPos;
        }
        firstSegSize += dPos;
        segments[firstIndex].z = zs[239];
        if(segments[firstIndex + 1].z < 0){
			segments[firstIndex].z = segments[lastIndex].z + segsize;
            lastIndex = firstIndex;
            firstIndex = (firstIndex + 1) % numsegs;
            firstSegSize = segsize;
			if(segments[firstIndex].z + firstSegSize < zs[239]){
			
			}
        }
    }
}