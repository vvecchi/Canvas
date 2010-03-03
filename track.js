function Segment(){
    this.y = 0;
    this.z = 0;
    this.shaded = 0;
    this.sizeOnScreen = 0;
}

function MyCar(){
    this.z = 0;
	this.x = 160;
	this.width = 94;
	this.height = 56;
	this.offsetX = 0;
	this.offsetY = 0;
	this.isBreaking
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
    
    this.myCar = new MyCar();
    this.myCar.z = segments[1].z + segsize/4;
    this.myCar.z = 0.75;
    this.draw = function(){
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
        var img = document.getElementById('track');
        var imgdark = document.getElementById('trackdark');
        var y = canvas.height - 1;
        y = parseInt(y);
        ctx.drawImage(img,0, 0, img.width, 1, 0, 0, canvas.width, canvas.height);
        for(i = 1; i < 20 ; i++){
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
        
        objy = canvas.height - ((yWorld/this.myCar.z) + (this.horizon));
        if(objy < this.horizon)
        {
            objy= this.horizon;
        }
        carimg = document.getElementById('car')
		
        ctx.drawImage(carimg, this.myCar.offsetX,this.myCar.offsetY,this.myCar.width,this.myCar.height,this.myCar.x - (this.myCar.width/2)/this.myCar.z , objy - (carimg.height/20)/this.myCar.z, (this.myCar.width)/this.myCar.z, (this.myCar.height)/this.myCar.z);
		if(this.myCar.isBreaking){
			ctx.fillStyle = "rgba(256,0,0,0.6)";
			ctx.fillRect (this.myCar.x - (this.myCar.width/2)/this.myCar.z + 20, objy - 15, 20, 7);
			ctx.fillRect (this.myCar.x + (this.myCar.width/2)/this.myCar.z - 34, objy - 15, 20 , 7);
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
        while(segments[(firstIndex + 1)%numsegs].z < 0){
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