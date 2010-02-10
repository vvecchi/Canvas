var COUNT = 0;
var NUMSEGS = 5;
var SEGSIZE = (240/2)/NUMSEGS;
var SECONDS_BETWEEN_FRAMES = 1/15;
var pos = 0;
var velocity = 100;
lastFrame = new Date().getTime();

function draw(){
    var canvas = document.getElementById('tutorial');
    var ctx = canvas.getContext('2d');
    var img = document.getElementById('track');
    for(i = 132; i < canvas.height; i++){
        ctx.drawImage(img,0,i, canvas.width,1, 0,i,canvas.width,1);
    }
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    for( i = 0; i < NUMSEGS ;i++){
        ctx.fillRect (0, 116 + i*SEGSIZE + pos, canvas.width,10);
    }
      ctx.drawImage(img,0, 0, canvas.width, 132, 0, 0, canvas.width, 132);
 }
 
 function update(){
    thisFrame = new Date().getTime();
    var dt = (thisFrame - this.lastFrame)/1000;
    this.lastFrame = thisFrame;
 //   pos = velocity * dt;
    pos = pos + 0.5;
    pos = pos%SEGSIZE;
 }
 
 function init(){
    setInterval(function(){update();}, SECONDS_BETWEEN_FRAMES)
    setInterval(function(){draw();}, SECONDS_BETWEEN_FRAMES)
 }