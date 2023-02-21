window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 100000000 / 60);
        };
})();

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function setupCanvas(canvas) {
    // Get the device pixel ratio, falling back to 1.
    var dpr = window.devicePixelRatio || 1;
    // Get the size of the canvas in CSS pixels.
    var rect = canvas.getBoundingClientRect();
    // Give the canvas pixel dimensions of their CSS
    // size * the device pixel ratio.
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    var ctx = canvas.getContext('2d');
    // Scale all drawing operations by the dpr, so you
    // don't have to worry about the difference.
    ctx.scale(dpr, dpr);
    return ctx;
}

var canvas = document.getElementById("myCanvas"),
    ctx = setupCanvas(canvas),
    w = canvas.clientWidth,
    h = canvas.clientHeight,
    // 旋转的中心点
    centerX = w * 2 / 3,
    centerY = h * 2 / 3,
    // 
    starCount = 720,//星星数量
    stars = [];

function Star(x, y, cx, cy) {
    this.x = x;
    this.y = y;
    this.cx = cx;
    this.cy = cy;

    var angle = - 1;
    var dx = cx - x,
        dy = cy - y;
    
    // 计算初始旋转半径
    this.radius = Math.sqrt(dx * dx + dy * dy);
    
    // 色值控制
    this.hue = random(0, 1) > .5 ? random(0, 80) : random(160, 260);

    // 透明度控制
    this.alpha = - 1;
    this.alphaDecay = random(0.001, 0.015);
    this.alphaMax = random(0, 1)
    
    // 跟踪每个星星的过去坐标以创建轨迹效果，增加坐标计数以创建更明显的轨迹
    this.coordinates = [];
    this.coordinateCount = 15;
    while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }

    this.draw = function () {
        ctx.strokeStyle = 'hsla(' + this.hue + ', 80%, ' + random(80, 100) + '%, ' + this.alpha + ')';
        ctx.lineWidth = 0.5
        
        // 画出高光轨迹
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        
        // 画出八角芒星
        /*if (this.radius > 100) {
            this.createPolygonalStar(this.x, this.y, 8, 1, 12, 45, 0, this.hue, this.alpha);
        }*/
    }

    // x : 中心坐标 x 值
    // y : 中心坐标 y 值
    // n : 星角数
    // r : 中心到凹点距离
    // R : 中心到顶点距离
    // rotation : 预先旋转角度
    // borderWidth : 边宽
    // hue: 色值
    // alpha: 透明度
    // isFilled: 是否填充
    this.createPolygonalStar = function (x, y, n, r, R, rotation, borderWidth, hue, alpha, isFilled = true) {
        ctx.save();
        ctx.fillStyle = 'hsla(' + hue + ', 80%, 60%, ' + alpha + ')';
        ctx.lineWidth = borderWidth;


        ctx.beginPath();
        for (var i = 0; i < n; i++) {
            var perDeg = 360 / n;
            var degA = perDeg / 2 / 2;
            var degB = 360 / (n - 1) / 2 - degA / 2 + degA;
            ctx.lineTo(Math.cos((degA + perDeg * i - rotation) / 180 * Math.PI) * R + (x - R) + borderWidth + R * Math.cos(degA / 180 * Math.PI),
                -Math.sin((degA + perDeg * i - rotation) / 180 * Math.PI) * R + (y - R) + borderWidth + R);
            ctx.lineTo(Math.cos((degB + perDeg * i - rotation) / 180 * Math.PI) * r + (x - R) + borderWidth + R * Math.cos(degA / 180 * Math.PI),
                -Math.sin((degB + perDeg * i - rotation) / 180 * Math.PI) * r + (y - R) + borderWidth + R);
        }
        ctx.closePath();

        if (!!isFilled) {
            ctx.fill();
        } else {
            ctx.stroke();
        }

        ctx.restore();
    }

    this.update = function () {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        
        // 旋转后的坐标计算
        this.x = this.cx + Math.sin(angle) * this.radius;
        this.y = this.cy + Math.cos(angle) * this.radius;
        
        // 递增旋转半径
        this.radius += 0.05;
        
        // 将透明度停在随机位置
        if (this.alpha <= this.alphaMax) {
            this.alpha += this.alphaDecay;
        }
        
        // 递增旋转角度
        angle += 0.01;
    }
}

function loop() {
    requestAnimFrame(loop);

    ctx.save();
    ctx.globalCompositeOperation = "destination-in";
    ctx.fillStyle = 'rgba(0,0,0,0.9)';
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    if (stars.length < starCount) {
        stars.push(new Star(random(0, w), centerY, centerX, centerY));
    }

    var i = stars.length;

    while (i--) {
        stars[i].draw();
        stars[i].update();
        if (stars[i].radius > 400) {
            stars.splice(i, 1);
        }
    }
}

loop();