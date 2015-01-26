;(function(){
    var Game = function(canvas){
        this.HEIGHT = 300;
        this.WIDTH = 300;
        this.canvas = document.getElementById(canvas);
        this.canvas.height = this.HEIGHT;
        this.canvas.width = this.WIDTH;
        this.drawContext = this.canvas.getContext("2d");
        //this.drawContext.fillRect(150,150,10,10);
        this.createObjects();
        var self = this;
        var tick = function(){
            self.update();
            self.draw();
            requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        
    };
    Game.prototype = {
        update:function(){
            this.base.update();
            for(var i=0;i<this.bullets.length;i++){
                this.bullets[i].update();
            }
            for(var i=0;i<this.tops.length;i++){
                this.tops[i].update();
            }
        },
        draw:function(){
            this.drawContext.clearRect(0,0,this.WIDTH,this.HEIGHT);
            this.base.draw(this.drawContext);
            for(var i=0;i<this.bullets.length;i++){
                this.bullets[i].draw(this.drawContext);
            }
            for(var i=0;i<this.tops.length;i++){
                this.tops[i].draw(this.drawContext);
            }
            for (var i = 0; i < this.bullets.length; i++) {
                if (entitiesColliding(this.base, this.bullets[i])) {
                  this.base.color = "#f00";
                }
              }
        },
        createObjects:function(){
            this.base = new Base(this);
            this.bullets = [];
            this.tops = [];
            for(var i=0;i<24;i++){
                this.tops.push(new Top(this,{
                    x:20 + 20*(i%8),
                    y:20 + 20*(i%3)
                }));
            }
        },
        shoot:function(center){
            this.bullets.push(new Bullet(this,center));
        }
    };
    
    var Base = function(game){
        this.game = game;
        this.size = {x:10,y:10};
        this.color = '#000';
        this.center = {x:game.WIDTH/2,y:game.HEIGHT/2};
        this.LEFT = 37;
        this.UP = 38;
        this.RIGHT = 39;
        this.inputter = new Input();
    };
    Base.prototype = {
        
        update:function(){
            if(this.inputter.isKeyDown(this.LEFT)){
                this.center.x--;
            }else if(this.inputter.isKeyDown(this.RIGHT)){
                this.center.x++;
            }
//            else if(this.inputter.isKeyDown(this.UP)){
//                this.game.shoot(this.center);
//            }
        },
        draw:function(drawContext){
            drawRectangle(this,drawContext);
        }
    };
    var Top = function(game,center){
        this.game = game;
        this.center = center;
        this.size = {x:10,y:10};
        this.color = '#000';
    };
    Top.prototype = {
        speedX:0,
        positionX:0,
        update: function(){
            if(this.positionX <=0)
                this.speedX = 0.5;
            else if(this.positionX >=20)
                this.speedX = -0.5;
            this.positionX += this.speedX;
            this.center.x += this.speedX;
            if(Math.random() < 0.005)
                this.game.shoot({x:this.center.x,y:this.center.y});
        },
        draw: function(drawContext){
            drawRectangle(this,drawContext);
        }
    };
    var Input = function(){
        var keyset = {};
        window.onkeydown = function(event){
            keyset[event.keyCode] = true;
        };
        window.onkeyup = function(event){
            keyset[event.keyCode] = false;
        };
        this.isKeyDown = function(keyCode){
            return keyset[keyCode] === true;
        }
    };
    var Bullet = function(game,center){
        this.game = game;
        this.center = {x:center.x,y:center.y};
        this.size = {x:4,y:4};
        this.color = '#000';
        this.velocity = {x:Math.random() - 0.5,y:Math.random()};
    };
    Bullet.prototype = {
        update:function(){
            this.center.x += this.velocity.x;
            this.center.y += this.velocity.y;
        },
        draw:function(drawContext){
            drawRectangle(this,drawContext);
        }
    };
    var drawRectangle = function(object,drawContext){
        drawContext.fillStyle = object.color;
        drawContext.fillRect(object.center.x,object.center.y,object.size.x,object.size.y);
    }
    var entitiesColliding = function(e1, e2) {
    return !(e1.center.x + e1.size.x / 2 < e2.center.x - e2.size.x / 2 ||
             e1.center.y + e1.size.y / 2 < e2.center.y - e2.size.y / 2 ||
             e1.center.x - e1.size.x / 2 > e2.center.x + e2.size.x / 2 ||
             e1.center.y - e1.size.y / 2 > e2.center.y + e2.size.y / 2);
  };
    window.onload = function(){
        new Game('myCanvas');
    }
})(this);