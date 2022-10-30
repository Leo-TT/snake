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

//食物对象（数组）
var foods = [];

// 手机宽高
var windowWidth = 0;
var windowHeight = 0;

// 是否移除碰撞块
var collideBol = true;

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

    // 碰撞函数
    function collide(obj1, obj2){
      var l1 = obj1.x;
      var r1 = l1+obj1.w;
      var t1 = obj1.y;
      var b1 = t1+obj1.h;

      var l2 = obj2.x;
      var r2 = l2+obj2.w;
      var t2 = obj2.y;
      var b2 = t2+obj2.h;

      if (r1 > l2 && l1 < r2 && b1 > t2 && t1 < b2){
        return true;
      }else{
        return false;
      }
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
          if (collideBol){
            snakeBodys.shift();
          }else{
            collideBol = true;
          }
        }
        
      }
      
      // 绘制蛇头
      draw(snakeHead);

      // 绘制蛇身
      for (var i=0; i<snakeBodys.length; i++){
        var snakeBody = snakeBodys[snakeBodys.length-i-1];
        draw(snakeBody);
      }

      // 绘制食物
      for (var i=0; i<foods.length; i++){
        var foodObj = foods[i];
        draw(foodObj);
        // 碰撞判断
        if (collide(snakeHead,foodObj)){
          console.log("撞上了");
          collideBol = false;
          foodObj.reset();
        }
      }

      wx.drawCanvas({
        canvasId: "snakeCanvas",
        actions: context.getActions()
      });
      // 微信小程序已不支持requestAnimationFrame,可使用setTimeoust代替使用,Leo唐唐备注
      // requestAnimationFrame(animate); 
      setTimeout(animate);
    }
    // 范围内随机
    function rand(min,max){
      return parseInt(Math.random()*(max-min)+min)
    }
    // 食物的构造函数
    function Food(){
      this.x = rand(0, windowWidth);
      this.y = rand(0, windowHeight);
      var w = rand(10,20);
      this.w = w;
      this.h = w;
      this.color = "rgb("+ rand(0,255) + ","+rand(0,255)+","+rand(0,255)+")";

      
      // 重置食物的方法
      this.reset = function (){
        this.x = rand(0, windowWidth);
        this.y = rand(0, windowHeight);
        this.color = "rgb("+ rand(0,255) + ","+rand(0,255)+","+rand(0,255)+")";
      }
    }
    wx.getSystemInfo({
      success: function(res){
        windowWidth = res.windowWidth;
        windowHeight = res.windowHeight;

        for (var i=0; i<20; i++){
          var foodObj = new Food();
          foods.push(foodObj);
        }

        animate();
      }
    })

  }
})