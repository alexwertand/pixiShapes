function init() {
    function rgb2hex(rgb) {
        var rgbm = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?((?:[0-9]*[.])?[0-9]+)[\s+]?\)/i);

        if (rgbm && rgbm.length === 5) {
            return "0x" +
                ('0' + Math.round(parseFloat(rgbm[4], 10) * 255).toString(16).toUpperCase()).slice(-2) +
                ("0" + parseInt(rgbm[1], 10).toString(16).toUpperCase()).slice(-2) +
                ("0" + parseInt(rgbm[2], 10).toString(16).toUpperCase()).slice(-2) +
                ("0" + parseInt(rgbm[3], 10).toString(16).toUpperCase()).slice(-2);
        } else {
            rgbm = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);

            if (rgbm && rgbm.length === 4) {
                return "0x" +
                    ("0" + parseInt(rgbm[1], 10).toString(16).toUpperCase()).slice(-2) +
                    ("0" + parseInt(rgbm[2], 10).toString(16).toUpperCase()).slice(-2) +
                    ("0" + parseInt(rgbm[3], 10).toString(16).toUpperCase()).slice(-2);
            } else {
                return "can't parse that";
            }
        }
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    var scene = document.querySelector('#scene'),
        app = new PIXI.Application({
            view: scene,
            antialias: true,
            backgroundColor: rgb2hex('rgb(255, 255, 255)')
        }),
        graphic = new PIXI.Graphics(),
        ticker = new PIXI.Ticker(),
        sceneWidth = scene.offsetWidth,
        sceneHeight = scene.offsetHeight,
        zero_X_Axis = Math.ceil(scene.getBoundingClientRect().left),
        zero_Y_Axis = Math.ceil(scene.getBoundingClientRect().top),
        w = window,
        w_w = w.innerWidth,
        w_h = w.innerHeight,
        shapesArr = [],
        gravityValue = 1;

    //console.log(sceneWidth, sceneHeight);

    function position(val) {
        return {
            x: getRandomInt(val + 1),
            y: getRandomInt(val + 1)
        };
    }

    function getRandonColor(alpha) {
        if (alpha) {
            return;
        }

        return rgb2hex('rgb(' + getRandomInt(256) + ',' + getRandomInt(256) + ',' + getRandomInt(256) + ')');
    }

    function BaseShape(lineStyleWidth, lineStyleColor, fillColor, x, y, dx, dy) {
        this.lineStyleWidth = lineStyleWidth;
        this.lineStyleColor = lineStyleColor;
        this.fillColor = fillColor;
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }

    function Circle(lineStyleWidth, lineStyleColor, fillColor, x, y, dx, dy, radius) {
        BaseShape.call(this, lineStyleWidth, lineStyleColor, fillColor, x, y, dx, dy);

        this.radius = radius;
    }

    Circle.prototype = {
        constructor: Circle,
        draw: function () {
            graphic.lineStyle(this.lineStyleWidth, this.lineStyleColor);
            graphic.beginFill(this.fillColor);
            graphic.drawCircle(this.x, this.y, this.radius);
            graphic.endFill();
        },
        update: function() {
            if (this.y > sceneHeight) {
                this.y = -(this.radius + this.lineStyleWidth);
            }

            this.y += this.dy;

            this.draw();
        },
    };

    //graphic.lineStyle(2, rgb2hex('rgb(0, 200, 255)'));
    //graphic.beginFill(rgb2hex('rgb(255, 0, 0)'));
    //graphic.drawEllipse(202, 102, 200, 100);
    //graphic.endFill();

    function Ellipse(lineStyleWidth, lineStyleColor, fillColor, x, y, dx, dy, width, height) {
        BaseShape.call(this, lineStyleWidth, lineStyleColor, fillColor, x, y, dx, dy);

        this.width = width;
        this.height = height;
    }

    Ellipse.prototype = {
        constructor: Ellipse,
        draw: function () {
            graphic.lineStyle(this.lineStyleWidth, this.lineStyleColor);
            graphic.beginFill(this.fillColor);
            graphic.drawEllipse(this.x, this.y, this.width, this.height);
            graphic.endFill();
        },
        update: function () {
            if (this.y > sceneHeight) {
                this.y = -(this.height + this.lineStyleWidth);
            }

            this.y += this.dy;

            this.draw();
        },
    };

    function Rectangle(lineStyleWidth, lineStyleColor, fillColor, x, y, dx, dy, width, height) {
        BaseShape.call(this, lineStyleWidth, lineStyleColor, fillColor, x, y, dx, dy);

        this.width = width;
        this.height = height;
    }

    Rectangle.prototype = {
        constructor: Rectangle,
        draw: function () {
            graphic.lineStyle(this.lineStyleWidth, this.lineStyleColor);
            graphic.beginFill(this.fillColor);
            graphic.drawRect(this.x, this.y, this.width, this.height);
            graphic.endFill();
        },
        update: function () {
            if (this.y > sceneHeight) {
                this.y = -(this.height + this.lineStyleWidth);
            }

            this.y += this.dy;

            this.draw();
        },
    };

    // graphic.drawPolygon([
    //     new PIXI.Point(100, 100), 
    //     new PIXI.Point(100, 200), 
    //     new PIXI.Point(200, 200)
    // ]);


    function drawShapes() {
        shapesArr = [
            new Circle(
                2,
                getRandonColor(),
                getRandonColor(),
                (52 + position(sceneWidth - 50 - 50 - 2).x),
                (52 + position(sceneHeight - 50 - 50 - 2).y),
                1, 1, 50),
            new Ellipse(
                2,
                getRandonColor(),
                getRandonColor(),
                (102 + position(sceneWidth - 100 - 100 - 2).x),
                (52 + position(sceneHeight - 50 - 50 - 2).y),
                1, 1, 100, 50),
            new Rectangle(
                2,
                getRandonColor(),
                getRandonColor(),
                (2 + position(sceneWidth - 100 - 2).x),
                (2 + position(sceneHeight - 70 - 2).y),
                1, 1, 100, 70),
        ];
    }

    function handlerOfShapes(shapesArr, methodName) {
        for (var i = 0, len = shapesArr.length; i < len; i++) {
            shapesArr[i][methodName]();
        }
    }

    app.stage.addChild(graphic);

    drawShapes(shapesArr);

    console.log(shapesArr);
    
    handlerOfShapes(shapesArr, 'draw');

    ticker.add(animate);
    ticker.start();

    function animate() {
        graphic.clear();

        handlerOfShapes(shapesArr, 'update');
    }

    window.addEventListener('click', function(event) {
        if (event.target.id == 'scene') {
            
        }
        console.log();
    });
}






window.onload = init();