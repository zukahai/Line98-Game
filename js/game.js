game_W = 0, game_H = 0;
size = 0;
xTT = yTT = 0;
xStart = yStart = -1;
xEnd = yEnd = -1;
rRadius = 0;
ch = -3;
cs = 0;
Data = [];
SmallData = [];
bfs = [];
ans = [];
auto = false;
index = 1;
NballSmall = 3;
Ncolor = 6;
score = timeDelay = 0;

var bg_im = new Image();
bg_im.src = "images/bg.png";
var ball_im = [];
for (let i = 1; i <= Ncolor; i++) {
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
        SmallData = this.initSmallData();
        this.render();
        this.loop();

        this.listenMouse();
    }

    creatMatrix() {
        for (let i = 0; i < 9; i++)
            Data[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let i = 0; i < 7; i++) {
            var I, J;
            do {
                I = Math.floor(Math.random() * 1000000) % 9;
                J = Math.floor(Math.random() * 1000000) % 9;
            } while (Data[I][J] != 0);
            Data[I][J] = Math.floor(Math.random() * 1000000) % Ncolor + 1;
        }
    }

    countBall() {
        let count = 0;
        for (let i = 0; i < 9; i++)
            for (let j = 0; j < 9; j++)
                if (Data[i][j] != 0)
                    count++;
        return count;
    }

    initSmallData() {
        let ans = [];
        let data0 = [];

        for (let i = 0; i < 9; i++)
            for (let j = 0; j < 9; j++)
                if (Data[i][j] == 0)
                    data0.push({ x: i, y: j, value: Math.floor(Math.random() * 1000000) })

        for (let i = data0.length - 1; i >= 1; i--)
            for (let j = 0; j < i; j++)
                if (data0[i].value > data0[j].value) {
                    let t = data0[i];
                    data0[i] = data0[j];
                    data0[j] = t;
                }

        NballSmall = (data0.length > 3) ? 3 : data0.length;
        for (let i = 0; i < NballSmall; i++)
            ans.push({ x: data0[i].x, y: data0[i].y, value: data0[i].value % Ncolor + 1 });
        return ans;
    }

    randomOneBallSmall() {
        let ans = [];
        let data0 = [];

        for (let i = 0; i < 9; i++)
            for (let j = 0; j < 9; j++)
                if (Data[i][j] == 0)
                    data0.push({ x: i, y: j, value: Math.floor(Math.random() * 1000000) })

        for (let i = data0.length - 1; i >= 1; i--)
            for (let j = 0; j < i; j++)
                if (data0[i].value > data0[j].value) {
                    let t = data0[i];
                    data0[i] = data0[j];
                    data0[j] = t;
                }
        Data[data0[0].x][data0[0].y] = Math.floor(Math.random() * 1000000) % Ncolor + 1;
    }

    listenMouse() {
        document.addEventListener("mousedown", evt => {
            if (auto)
                return;
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
            if (x >= xTT && x <= xTT + size && y >= yTT && y <= yTT + size) {
                let XX = Math.floor((y - yTT) / (size / 9));
                let YY = Math.floor((x - xTT) / (size / 9));
                if (Data[XX][YY] != 0) {
                    xStart = XX;
                    yStart = YY;
                } else if (xStart != -1) {
                    xEnd = XX;
                    yEnd = YY;
                    bfs = this.solve(xStart, yStart, xEnd, yEnd);
                    if (bfs.length > 0) {
                        auto = true;
                        index = 1;
                    }
                    xStart = yStart = xEnd = yEnd = -1;
                }
            }
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

    solve(xStart, yStart, xEnd, yEnd) {
        let t = [];
        for (let i = 0; i < 9; i++)
            t[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        let queue = [{ x: xStart, y: yStart }];
        let index = 0;
        while (index < queue.length) {
            let X = queue[index].x;
            let Y = queue[index++].y;
            for (let i = X - 1; i <= X + 1; i++)
                for (let j = Y - 1; j <= Y + 1; j++)
                    if (this.isPoint(i, j) && t[i][j] == 0 && Math.abs(i - X) + Math.abs(j - Y) == 1 && Data[i][j] == 0) {
                        queue.push({ x: i, y: j });
                        t[i][j] = { x: X, y: Y };
                    }
        }
        let ans = [];
        if (t[xEnd][yEnd] != 0) {
            ans.push({ x: xEnd, y: yEnd });
            let X = xEnd;
            let Y = yEnd;
            while (X != xStart || Y != yStart) {
                let Xt = t[X][Y].x;
                Y = t[X][Y].y;
                X = Xt;
                ans.push({ x: X, y: Y });
            }
        }
        return ans.reverse();
    }

    isPoint(x, y) {
        if (x < 0 || x > 8 || y < 0 || y > 8)
            return false;
        return true;
    }

    loop() {
        this.update();
        this.draw();
        setTimeout(() => this.loop(), 40);
    }

    update() {
        if (timeDelay-- > 0) {
            return;
        } else if (ans.length > 0) {
            for (let i = 0; i < ans.length; i++)
                Data[ans[i].x][ans[i].y] = 0;
            score = Math.floor(score) + ans.length * 10;
            ans = [];
            console.log(score);
        }

        if (NballSmall == 1 || NballSmall == 0) {
            window.alert("You loss!\n" + "Your Score: " + score);
            NballSmall = -1000;
        }
        if (NballSmall < 0)
            return;
        this.render();
        if (rRadius < (1 - 2 / 7) * (size / 9) / 2 || rRadius > (1 - 2 / 7) * (size / 9))
            ch *= -1;
        rRadius += ch;
        if (auto) {
            Data[bfs[index].x][bfs[index].y] = Data[bfs[index - 1].x][bfs[index - 1].y];
            Data[bfs[index - 1].x][bfs[index - 1].y] = 0;
            index++;
            if (index >= bfs.length) {
                auto = false;
                ans = this.check();
                if (ans.length == 0) {
                    for (let i = 0; i < NballSmall; i++)
                        if (Data[SmallData[i].x][SmallData[i].y] == 0)
                            Data[SmallData[i].x][SmallData[i].y] = SmallData[i].value;
                        else
                            this.randomOneBallSmall();
                    ans = this.check();
                    SmallData = this.initSmallData();
                } else {
                    timeDelay = 10;
                }
            }

        }
    }

    check() {
        let ans = [];
        for (let i = 0; i < 9; i++) {
            let ans2 = [{ x: i, y: 0 }];
            for (let j = 1; j < 10; j++)
                if (this.isPoint(i, j) && Data[i][j] == Data[i][j - 1] && Data[i][j - 1] != 0)
                    ans2.push({ x: i, y: j });
                else {
                    if (ans2.length >= 5)
                        ans = ans.concat(ans2);
                    ans2 = [{ x: i, y: j }];
                }
        }

        for (let j = 0; j < 9; j++) {
            let ans2 = [{ x: 0, y: j }];
            for (let i = 1; i < 10; i++)
                if (this.isPoint(i, j) && Data[i][j] == Data[i - 1][j] && Data[i - 1][j] != 0)
                    ans2.push({ x: i, y: j });
                else {
                    if (ans2.length >= 5)
                        ans = ans.concat(ans2);
                    ans2 = [{ x: i, y: j }];
                }
        }

        for (let j = 0; j < 9; j++) {
            let ans2 = [{ x: 0, y: j }];
            let J = j;
            let I = 0;
            do {
                I++;
                J++;
                if (this.isPoint(I, J) && Data[I][J] == Data[I - 1][J - 1] && Data[I - 1][J - 1] != 0)
                    ans2.push({ x: I, y: J });
                else {
                    if (ans2.length >= 5) {
                        ans = ans.concat(ans2);
                    }
                    ans2 = [{ x: I, y: J }];
                }
            } while (this.isPoint(I, J));

            ans2 = [{ x: j, y: 0 }];
            J = 0;
            I = j;
            do {
                I++;
                J++;
                if (this.isPoint(I, J) && Data[I][J] == Data[I - 1][J - 1] && Data[I - 1][J - 1] != 0)
                    ans2.push({ x: I, y: J });
                else {
                    if (ans2.length >= 5) {
                        console.log(ans2);
                        ans = ans.concat(ans2);
                    }
                    ans2 = [{ x: I, y: J }];
                }
            } while (this.isPoint(I, J));
        }

        for (let j = 0; j < 9; j++) {
            let ans2 = [{ x: 0, y: j }];
            let J = j;
            let I = 0;
            do {
                I++;
                J--;
                if (this.isPoint(I, J) && Data[I][J] == Data[I - 1][J + 1] && Data[I - 1][J + 1] != 0)
                    ans2.push({ x: I, y: J });
                else {
                    if (ans2.length >= 5) {
                        ans = ans.concat(ans2);
                    }
                    ans2 = [{ x: I, y: J }];
                }
            } while (this.isPoint(I, J));

            ans2 = [{ x: j, y: 8 }];
            J = 8;
            I = j;
            do {
                I++;
                J--;
                if (this.isPoint(I, J) && Data[I][J] == Data[I - 1][J + 1] && Data[I - 1][J + 1] != 0)
                    ans2.push({ x: I, y: J });
                else {
                    if (ans2.length >= 5) {
                        console.log(ans2);
                        ans = ans.concat(ans2);
                    }
                    ans2 = [{ x: I, y: J }];
                }
            } while (this.isPoint(I, J));
        }

        return ans;
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
            rRadius = (1 - 2 / 7) * (size / 9);
            console.log("Render");
            cs = this.canvas.width / document.documentElement.clientWidth;
        }
    }

    draw() {
        this.clearScreen();
        this.drawBall();
        this.drawScore();
    }

    drawScore() {
        this.context.font = this.getWidth() / 1.5 + 'px Arial Black';
        this.context.fillStyle = "#FF00CC";
        this.context.fillText("Ball: " + this.countBall(), size / 9, size / 15);
        this.context.fillText("Score: " + score, game_W / 2 - size / 7, size / 15);
    }

    drawBall() {
        let sizezz = size / 9;
        for (let i = 0; i < 9; i++)
            for (let j = 0; j < 9; j++)
                if (Data[i][j] != 0)
                    if (i != xStart || j != yStart)
                        this.context.drawImage(ball_im[Data[i][j]], xTT + j * sizezz + sizezz / 7, yTT + i * sizezz + sizezz / 7, (1 - 2 / 7) * sizezz, (1 - 2 / 7) * sizezz);
                    else
                        this.context.drawImage(ball_im[Data[i][j]], xTT + j * sizezz + sizezz / 2 - rRadius / 2, yTT + i * sizezz + sizezz / 2 - rRadius / 2, rRadius, rRadius);

        for (let k = 0; k < NballSmall; k++) {
            let i = SmallData[k].x;
            let j = SmallData[k].y;
            this.context.drawImage(ball_im[SmallData[k].value], xTT + j * sizezz + sizezz / 2 - sizezz / 6, yTT + i * sizezz + sizezz / 2 - sizezz / 6, sizezz / 3, sizezz / 3);
        }

    }

    clearScreen() {
        this.context.clearRect(0, 0, game_W, game_H);
        this.context.fillStyle = '#000000';
        this.context.fillRect(0, 0, game_W, game_H);
        this.context.drawImage(bg_im, xTT, yTT, size, size);
    }

    getWidth() {
        var area = game_W * game_H;
        return Math.sqrt(area / 300);
    }
}

var g = new game();