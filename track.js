function Segment(){
    this.y = 0;
    this.z = 0;
    this.shaded = 0;
}
function Track(){
    this.pos = 0;
    this.horizon = 132;
    var numsegs = 6;
    var totalDist = 0;
    var yWorld = - 50;
    printz = true;
    var zs = new Array()
    for(i = 0; i < this.horizon; i++){
        zs[i] = yWorld/(i - this.horizon);
    }
    totalDist = zs[this.horizon - 1];
    var segsize = totalDist/numsegs;
    var segments = new Array();
    var nexty = 239;
    for(i = 0;i < numsegs*2; i++){
        segment = new Segment();
        segment.z = i*segsize+0.001;
        segment.y = nexty;
        nexty -= segsize/zs[parseInt(240 - segment.y)];
        segment.shaded = i%2;
        segments[i] = segment;
    }
    alert(totalDist);
    alert(segsize);
    alert(nexty);
    this.draw = function(){
        var canvas = document.getElementById('tutorial');
        var ctx = canvas.getContext('2d');
        var img = document.getElementById('track');
        ctx.drawImage(img,0, 0, canvas.width, this.horizon, 0, 0, canvas.width, this.horizon);
        for(i = 1; i <= this.horizon;  i++){
            ctx.drawImage(img,0, canvas.height - i, canvas.width,1, 0,canvas.height - i,canvas.width,1);
        }
        for(i = 0; i < numsegs*2;i++){
            ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
            if(segments[i].shaded == 0){
                var sizeOnScreen = segsize/zs[parseInt(240 - segments[i].y)];
                if(sizeOnScreen < 1)sizeOnScreen = 1;
                ctx.fillRect (0, segments[i].y - sizeOnScreen, canvas.width, sizeOnScreen);
             //   alert(""+0+","+ (segments[i].y - sizeOnScreen)+","+canvas.width+","+sizeOnScreen);
            }
        }
        ctx.drawImage(img,0, 0, canvas.width, this.horizon, 0, 0, canvas.width, this.horizon);
        divzs = document.getElementById('zs');
        if(printz){
            printz = false;
            divzs.innerHTML = "totaldist = " + totalDist + "<br>";
            for(var i in segments){
                divzs.innerHTML += "segz = "+segments[i].z + " segy = "+ (segments[i].y) +"<br>";
                divzs.innerHTML += "yWorld/segment.z = " + (yWorld/segments[i].z) + "<br>";
                divzs.innerHTML += "segsize = " + segsize + " height on screen ="+segsize/zs[parseInt(240 - segments[i].y)] + "<br>";
            }
            for(var i in zs){
                divzs.innerHTML += zs[i]+"<br>";
            }
        }
    }
     
    this.update = function(){
        
    }
}