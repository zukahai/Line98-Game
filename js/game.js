game_W = 0, game_H = 0;
size = 0;
xTT = yTT = 0;

var bg_im = new Image();
bg_im.src = "images/bg.png";

class game {
    constructor() {
        this.canvas = null;
        this.context = null;
        this.init();
    }

    init() {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);

        this.render();
        this.loop();

        this.listenMouse();
    }

    listenMouse() {
        document.addEventListener("mousedown", evt => {
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
            console.log(x, ' ', y);
        })

        document.addEventListener("mousemove", evt => {
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
        })

        document.addEventListener("mouseup", evt => {
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
        })
    }


    loop() {
        this.update();
        this.draw();
        setTimeout(() => {
            this.loop();
        }, 30);
    }

    update() {
        this.render();
    }

 
    render() {
        if (game_W != document.documentElement.clientWidth || game_H != document.documentElement.clientHeight) {
            this.canvas.width = document.documentElement.clientWidth;
            this.canvas.height = document.documentElement.clientHeight;
            if (this.canvas.width > this.canvas.height)
                this.canvas.width = 9 * this.canvas.height / 10
            game_W = this.canvas.width;
            game_H = this.canvas.height;
            size = game_W;
            xTT = size / 20;
            size *= 0.9;
            yTT = (game_H - size) / 2;
        }
    }

    draw() {
        this.clearScreen();
    }

    clearScreen() {
        this.context.clearRect(0, 0, game_W, game_H);
        this.context.fillStyle = '#000000';
        this.context.fillRect(0 , 0, game_W, game_H); 
        this.context.drawImage(bg_im, xTT, yTT, size, size);
    }

    getWidth() {
        var area = game_W * game_H;
        return Math.sqrt(area / 300);
    }
}

var g = new game();