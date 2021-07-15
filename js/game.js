game_W = 0, game_H = 0;
size = 0;
xTT = yTT = 0;
Data = [];

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

        for (let  i = 0; i < 9; i++)
            Data[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0];

        this.render();
        this.loop();

        this.listenMouse();
    }

    listenMouse() {
        document.addEventListener("mousedown", evt => {
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
            if (x >= xTT && x <= xTT + size && y >= yTT && y <= yTT + size)
                console.log(x, ' ', y);
            Data[Math.floor((y - yTT) / (size / 9))][Math.floor((x - xTT) / (size / 9))] = 1;
            console.log(Data);
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