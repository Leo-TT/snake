//index.js贪吃蛇主程序

//手指的落点坐标
var startX = 0;
var startY = 0;

// 移动坐标
var moveX = 0;
var moveY = 0;

// 移动差值
var X = 0;
var Y = 0;

// 蛇头坐标，注意大小写区别，将蛇抽象为对象
var snakeHead = {
  x:0,
  y:0,
  // 颜色使用十六进制写法不要用red，编译器问题
  color:"#ff0000",
  w:20,
  h:20
};

//鼠标移动的方向
var direction = null;

//蛇头移动的方向
var snakeDirection = "right";

//蛇的身体对象（数组）
var snakeBodys = [];

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
      direction = "right";
    }
    else if ( Math.abs(X) > Math.abs(Y) && X < 0 ) {
      direction = "left";
    }
    else if ( Math.abs(Y) > Math.abs(X) && Y > 0) {
      direction = "bottom";
    }
    else if ( Math.abs(Y) > Math.abs(X) && Y < 0 ) {
      direction = "top";
    }
  },
  canvasEnd:function (e){ 
    snakeDirection  = direction;
  },
  onReady: function () {
    //使用wx.createContext获取绘图上下文context
    var context = wx.createContext();

    // 帧数
    var frameNum = 0;

    // 绘制函数
    function draw(obj){
      context.setFillStyle(obj.color);
      context.beginPath();
      context.rect(obj.x,obj.y,obj.w,obj.h);
      context.closePath();
      context.fill();
    }

    function animate(){
      frameNum++;
      // 根据帧率调整速度，这里可以实现随着时间加长速度变快的逻辑
      if (frameNum % 20 == 0){
        // 添加一个身体对象
        snakeBodys.push({
          x:snakeHead.x,
          y:snakeHead.y,
          w:20,
          h:20,
          color: "#00ff00"
        });

        switch (snakeDirection){
          case "left":
            snakeHead.x -= snakeHead.w;
            break;
          case "right":
            snakeHead.x += snakeHead.w;
            break;
          case "top":
            snakeHead.y -= snakeHead.h;
            break;
          case "bottom":
            snakeHead.y += snakeHead.h;
            break;
        }

        //如果超过4截身体就删除最老的那一截
        if (snakeBodys.length > 4){
          snakeBodys.shift();
        }
        
      }
      
      // 绘制蛇头
      draw(snakeHead)

      // 绘制蛇身
      for (var i=0; i<snakeBodys.length; i++){
        var snakeBody = snakeBodys[snakeBodys.length-i-1];
        draw(snakeBody)
      }

      wx.drawCanvas({
        canvasId: "snakeCanvas",
        actions: context.getActions()
      });
      // 微信小程序已不支持requestAnimationFrame,可使用setTimeoust代替使用,Leo唐唐备注
      // requestAnimationFrame(animate); 
      setTimeout(animate);
    }
    animate();
  }
})