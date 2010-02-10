
function draw(){
    var canvas = document.getElementById('tutorial');
    var ctx = canvas.getContext('2d');
    var img = document.getElementById('track');
    for(i = 0; i < canvas.height; i++){
        ctx.drawImage(img,0,i, canvas.width,1, 0,i,canvas.width,1);
    }
    /*ctx.drawImage(img,0,0);
    ctx.fillStyle = "rgb(200,0,0)";
    ctx.fillRect (10, 10, 55, 50);

    ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
    ctx.fillRect (30, 30, 55, 50);*/
 }