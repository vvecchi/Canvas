var COUNT = 0;
var NUMSEGS = 5;
var SEGSIZE = (240/2)/NUMSEGS;
var SECONDS_BETWEEN_FRAMES = 1/15;
var pos = 0;
var velocity = 50;
lastFrame = new Date().getTime();
var track = new Track();

function draw(){
   track.draw();
 }
 
 function update(){
    thisFrame = new Date().getTime();
    var dt = (thisFrame - this.lastFrame)/1000;
    this.lastFrame = thisFrame;
    pos = pos + velocity * dt;
    //pos = pos + 0.5;
    //pos = pos%SEGSIZE;
    track.pos = pos;
 }
 
 function init(){
    setInterval(function(){update();}, SECONDS_BETWEEN_FRAMES)
    setInterval(function(){draw();}, SECONDS_BETWEEN_FRAMES)
 }