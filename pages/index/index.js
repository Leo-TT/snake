// //index.js贪吃蛇主程序

//手指的落点坐标
var startX = 0;
var startY = 0;

// 移动坐标
var moveX = 0;
var moveY = 0;

// 移动差值
var X = 0;
var Y = 0;

Page({
  canvasStart:function (e){
    startX = e.touches[0].x;
    startY = e.touches[0].y;
  },
  canvasMove:function (e){
    moveX = e.touches[0].x;
    moveY = e.touches[0].y;
    X = moveX - startX;
    Y = moveY - startY;

    if ( Math.abs(X) > Math.abs(Y) && X > 0 ) {
      console.log("right");
    }
    else if ( Math.abs(X) > Math.abs(Y) && X < 0 ) {
      console.log("left");  
    }
    else if ( Math.abs(Y) > Math.abs(X) && Y > 0) {
      console.log("bottom");  
    }
    else if ( Math.abs(Y) > Math.abs(X) && Y < 0 ) {
      console.log("top");  
    }
  },
})
