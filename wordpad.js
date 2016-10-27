var canvasWidth=Math.min(800,$(window).width()-20);
var canvasHeight=canvasWidth;

var strokeColor="black";
var isMouseDown=false;
var lastLocation={x:0,y:0};
var lastTimeStamp=0;
var lastLineWidth=-1;

var canvas=document.querySelector("#canvas");
var context=canvas.getContext("2d");

canvas.width=canvasWidth;
canvas.height=canvasHeight;

$("#controller").css("width",canvasWidth+"px");
drawGrid();
$("#clear_btn").click(function(e){
    context.clearRect(0,0,canvasWidth,canvasHeight);
    drawGrid();
});
$(".color_btn").click(function(e){
    $(".color_btn").removeClass("color_btn_selected");
    $(this).addClass("color_btn_selected");
    strokeColor=$(this).css("background-color");
});

function beginStroke(point){
    isMouseDown=true;
    lastLocation=windowToCanvas(point.x,point.y);
    lastTimeStamp=new Date().getTime();
}
function endStroke(){
    isMouseDown=false;;
}
function moveStroke(point){
    var currentLocation=windowToCanvas(point.x,point.y);
    var currentTimeStamp=new Date().getTime();
    var s=calculateDistance(currentLocation,lastLocation);
    var t=currentTimeStamp-lastTimeStamp;

    var lineWidth=calculateLineWidth(t,s);

    context.beginPath();
    context.moveTo(lastLocation.x,lastLocation.y);
    context.lineTo(currentLocation.x,currentLocation.y);

    context.lineWidth=lineWidth;
    context.lineCap="round";
    context.lineJoin="round";

    context.strokeStyle=strokeColor;
    context.stroke();

    lastLocation=currentLocation;
    lastTimeStamp=currentTimeStamp;
    lastLineWidth=lineWidth;
}
canvas.onmousedown=function(e){
    e.preventDefault();
    beginStroke({x:e.clientX,y:e.clientY});
}
canvas.onmouseup=function(e){
    e.preventDefault();
    endStroke();
}
canvas.onmouseout=function(e){
    e.preventDefault();
    endStroke();
}
canvas.onmousemove=function(e){
    e.preventDefault();
    if(isMouseDown){
        moveStroke({x:e.clientX,y:e.clientY});
    }
}

canvas.addEventListener("touchstart",function(e){
    e.preventDefault();
    touch=e.touches[0];
    beginStroke({x:touch.pageX,y:touch.pageY});
});
canvas.addEventListener("touchmove",function(e){
    e.preventDefault();
    if(isMouseDown){
        touch=e.touches[0];
        moveStroke({x:touch.pageX,y:touch.pageY});
    }
});
canvas.addEventListener("touchend",function(e){
    e.preventDefault();
    endStroke();
});

var maxLineWidth=10;
var minLineWidth=1;
var maxStrokeV=10;
var minStrokeV=0.1;
function calculateLineWidth(t,s){
    var v=s/t;

    var resultLineWidth;
    if(v<=minStrokeV){
        resultLineWidth=maxLineWidth;
    }
    else if(v>=maxStrokeV){
        resultLineWidth=minLineWidth;
    }
    else{
        resultLineWidth=maxLineWidth-(v-minStrokeV)/(maxStrokeV-minStrokeV)*(maxLineWidth-minLineWidth);
    }

    if(lastLineWidth==-1){
        return resultLineWidth;
    }

    return lastLineWidth*2/3+resultLineWidth*1/3;
}

function calculateDistance(firstLocation,secondLocation){
    return Math.sqrt((firstLocation.x-secondLocation.x)*(firstLocation.x-secondLocation.x)+(firstLocation.y-secondLocation.y)*(firstLocation.y-secondLocation.y));
}

function windowToCanvas(x,y){
    var boundBox=canvas.getBoundingClientRect();
    return {x:Math.round(x-boundBox.left),y:Math.round(y-boundBox.top)};
}

function drawGrid(){
    context.save();

    context.strokeStyle="rgb(230,11,9)";

    context.beginPath();
    context.moveTo(3,3);
    context.lineTo(canvasWidth-3,3);
    context.lineTo(canvasWidth-3,canvasHeight-3);
    context.lineTo(3,canvasHeight-3);
    context.closePath();

    context.lineWidth=6;
    context.stroke();

    context.beginPath();
    context.moveTo(0,0);
    context.lineTo(canvasWidth,canvasHeight);

    context.moveTo(canvasWidth,0);
    context.lineTo(0,canvasHeight);

    context.moveTo(canvasWidth/2,0);
    context.lineTo(canvasWidth/2,canvasHeight);

    context.moveTo(0,canvasHeight/2);
    context.lineTo(canvasWidth,canvasHeight/2);

    context.lineWidth=1;
    context.stroke();

    context.restore();
}
