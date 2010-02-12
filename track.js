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
    this.horizon = 130;
    
    var lastPos = 0;
    var numsegs = 10;
    var totalDist = 0;
    var yWorld = - 500;
    var printz = true;
    var zs = new Array()
    for(i = 0; i < 240; i++){
        zs[i] = yWorld/(i - (240/2));
    }
    totalDist = - yWorld;
    var segsize = totalDist/(numsegs*12);
    var segments = new Array();
    for(i = 0;i < numsegs; i++){
        segment = new Segment();
        if(i == 0)segment.z = 0.01;
        else segment.z = i*segsize;
        segment.shaded = i%2;
        segments[i] = segment;
    }
    var firstIndex = 0;
    
    var trackObject = new TrackObject();
    trackObject.z = totalDist/16;
    this.draw = function(){
        var canvas = document.getElementById('tutorial');
        var ctx = canvas.getContext('2d');
        var img = document.getElementById('track');
        var imgdark = document.getElementById('trackdark');
        var y = 1;//(yWorld/segments[0].z) + (this.horizon);
        
        for(i = 0; i < numsegs -1 ;i++){
            var ynew = (yWorld/segments[i+1].z) + (this.horizon);
            var sizeOnScreen = ynew - y;
            segments[i].sizeOnScreen = sizeOnScreen;
            segments[i].y = y;
            
            var drawImg = img
            if(segments[i].shaded == 1){
                drawImg = imgdark;
            }
            for(j = 0; j <= segments[i].sizeOnScreen;  j++){
                ypos = canvas.height - j - y;
                ctx.drawImage(drawImg, 0, ypos, canvas.width,1, 0, ypos, canvas.width,1);
            }
            y = ynew;
        }
        
        ctx.drawImage(img,0, 0, canvas.width, this.horizon, 0, 0, canvas.width, this.horizon);
        objy = canvas.height - ((yWorld/trackObject.z) + (this.horizon));
        if(objy < this.horizon)
        {
            objy= this.horizon;
        }
        carimg = document.getElementById('car')
        ctx.drawImage(carimg,0,0,484,350,160 - 200/trackObject.z ,objy - 242/trackObject.z, 175/trackObject.z, 200/trackObject.z);
    }
     
    this.update = function(pos){
        dPos = lastPos - pos;
        lasPos = pos;
        trackObject.z -= totalDist/10000;
        if(trackObject.z < 1){
            trackObject.z = totalDist;
        }
    }
}