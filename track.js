function Segment(){
    this.y = 0;
    this.z = 0;
    this.shaded = 0;
}
function Track(){
    this.pos = 0;
    this.horizon = 132;
    var numsegs = 10;
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
    for(i = 0;i < numsegs; i++){
        segment = new Segment();
        segment.z = i*segsize+1;
        segment.y = this.horizon - (yWorld/segment.z);
        segment.shaded = i%2;
        segments[i] = segment;
    }
    this.draw = function(){
        var canvas = document.getElementById('tutorial');
        var ctx = canvas.getContext('2d');
        var img = document.getElementById('track');
        ctx.drawImage(img,0, 0, canvas.width, this.horizon, 0, 0, canvas.width, this.horizon);
        for(i = 1; i <= this.horizon;  i++){
            ctx.drawImage(img,0, canvas.height - i, canvas.width,1, 0,canvas.height - i,canvas.width,1);
        }
        for(i = 0; i < numsegs;i++){
            ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
            if(segments[i].shaded == 1){
                ctx.fillRect (0,segment.y , canvas.width, 5);
//                alert("i="+i+" y="+segment.y+" z="+segment.z+" height on screnn ="+segsize/zs[segment.y - 132]);
            }
        }
        ctx.drawImage(img,0, 0, canvas.width, this.horizon, 0, 0, canvas.width, this.horizon);
        divzs = document.getElementById('zs');
        if(printz){
            printz = false;
            divzs.innerHTML = "";
            for(var i in segments){
                divzs.innerHTML += "segz = "+segments[i].z + " segy = "+segments[i].y +" height on screen ="+segsize/zs[parseInt(segment.y-132)] + "<br>"
            }
            for(var i in zs){
                divzs.innerHTML += zs[i]+"<br>";
            }
        }
     }
     this.update = function(){
        
     }
}