game_W = 0, game_H = 0;
size = 0;
xTT = yTT = 0;
xStart = yStart = -1;
rRadius = 0;
ch = -3;
cs = 0;
Data = [];

var bg_im = new Image();
bg_im.src = "images/bg.png";
var ball_im = [];
for (let i = 1; i <= 7; i++) {
    ball_im[i] = new Image();
    ball_im[i].src = "images/ball/" + i + ".png"; 
}

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

        this.creatMatrix();
        this.render();
        this.loop();

        this.listenMouse();
    }

    creatMatrix() {
        for (let  i = 0; i < 9; i++)
            Data[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let i = 0; i < 7; i++) {
            var I, J;
            do {
                I = Math.floor(Math.random() * 1000000) % 9;
                J = Math.floor(Math.random() * 1000000) % 9;
            } while (Data[I][J] != 0);
            Data[I][J] = Math.floor(Math.random() * 1000000) % 7 + 1;
        }
    }

    listenMouse() {
        document.addEventListener("mousedown", evt => {
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
            if (x >= xTT && x <= xTT + size && y >= yTT && y <= yTT + size) {
                let XX = Math.floor((y - yTT) / (size / 9));
                let YY = Math.floor((x - xTT) / (size / 9));
                if (Data[XX][YY] != 0) {
                    xStart = XX;
                    yStart = YY;
                }
                
            }
            
            // Data[Math.floor((y - yTT) / (size / 9))][Math.floor((x - xTT) / (size / 9))] = 1;
            // console.log(Data);
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
        setTimeout(() => this.loop(), 30);
    }

    update() {
        this.render();
        if (rRadius < (1 - 2/7) * (size / 9) / 2 || rRadius > (1 - 2/7) * (size / 9))
            ch *= -1;
        rRadius += ch;
        // console.log(rRadius, ' ', (1 - 2/7) * (size / 9));
    }

 
    render() {
        if (this.canvas.width / document.documentElement.clientWidth != cs) {
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
            rRadius = (1 - 2/7) * (size / 9);
            console.log("Render");
            cs = this.canvas.width / document.documentElement.clientWidth;
        }
    }

    draw() {
        this.clearScreen();
        this.drawBall();
    }

    drawBall() {
        let sizezz = size / 9;
        for (let i = 0; i < 9; i++)
            for (let j = 0; j < 9; j++)
                if (Data[i][j] != 0)
                    if (i != xStart || j != yStart)
                        this.context.drawImage(ball_im[Data[i][j]], xTT + j * sizezz + sizezz / 7, yTT + i * sizezz + sizezz / 7, (1 - 2/7) * sizezz, (1 - 2/7) * sizezz);
                    else
                        this.context.drawImage(ball_im[Data[i][j]], xTT + j * sizezz + sizezz / 2 - rRadius / 2, yTT + i * sizezz + sizezz / 2 - rRadius / 2, rRadius, rRadius);
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