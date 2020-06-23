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
        startXAxis = Math.ceil(scene.getBoundingClientRect().left),
        startYAxis = Math.ceil(scene.getBoundingClientRect().top),
        w = window,
        w_w = w.innerWidth,
        w_h = w.innerHeight,
        animatedShapesArr = [],
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

    function BaseShape(lineStyleWidth, lineStyleColor, fillColor, x, y) {
        this.lineStyleWidth = lineStyleWidth || 2;
        this.lineStyleColor = lineStyleColor || getRandonColor();
        this.fillColor = fillColor || getRandonColor();
        this.x = x || 100;
        this.y = y || 100;
        this.trackArr = [];
    }

    const Shapes = {
        Circle: function (lineStyleWidth, lineStyleColor, fillColor, x, y, radius) {
            BaseShape.call(this, lineStyleWidth, lineStyleColor, fillColor, x, y);

            this.radius = radius || 50;
        },
        Ellipse: function (lineStyleWidth, lineStyleColor, fillColor, x, y, width, height) {
            BaseShape.call(this, lineStyleWidth, lineStyleColor, fillColor, x, y);

            this.width = width || 50;
            this.height = height || 100;
        },
        Rectangle: function (lineStyleWidth, lineStyleColor, fillColor, x, y, width, height) {
            BaseShape.call(this, lineStyleWidth, lineStyleColor, fillColor, x, y);

            this.width = width || 100;
            this.height = height || 100;
        },
        Triangle: function (lineStyleWidth, lineStyleColor, fillColor, x, y) {
            BaseShape.call(this, lineStyleWidth, lineStyleColor, fillColor, x, y);

            this.B_X = this.x - 75;
            this.B_Y = this.y + 150;
            this.C_X = this.x + 75;
            this.C_Y = this.y + 150;
        },
        /* Pentagon: function (lineStyleWidth, lineStyleColor, fillColor, x, y) {
            BaseShape.call(this, lineStyleWidth, lineStyleColor, fillColor, x, y);

            this.B_X = this.x + 25;
            this.B_Y = this.y + 25;
            this.C_X = this.x + 75;
            this.C_Y = this.y + 150;
        }, */
        Hexagon: function (lineStyleWidth, lineStyleColor, fillColor, x, y) {
            BaseShape.call(this, lineStyleWidth, lineStyleColor, fillColor, x, y);

            //this.height = 70

            this.B_X = this.x + 15;
            this.B_Y = this.y + 15;
            this.C_X = this.B_X + 15;
            this.C_Y = this.B_Y + 35;
            this.D_X = this.B_X;
            this.D_Y = this.B_Y + 70;
            this.E_X = this.x;
            this.E_Y = this.y + 70;
            this.F_X = this.x - 15;
            this.F_Y = this.y + 35;
        }
    };

    const ShapesValuesArr = Object.values(Shapes);

    Shapes.Circle.prototype = {
        constructor: this,
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

            this.y += gravityValue;

            this.draw();
        },
    };

    Shapes.Ellipse.prototype = {
        constructor: this,
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

            this.y += gravityValue;

            this.draw();
        },
    };

    Shapes.Rectangle.prototype = {
        constructor: this,
        draw: function () {
            graphic.lineStyle(this.lineStyleWidth, this.lineStyleColor);
            graphic.beginFill(this.fillColor);
            graphic.drawRect(this.x, this.y, this.width, this.height);
            graphic.endFill();
        },
        update: function () {
            if (this.y > sceneHeight) {
                this.y = -(this.height + this.lineStyleWidth);

                this.trackArr = [];
            }

            this.y += gravityValue;

            this.trackArr.push(this.y);

            //console.log(this.trackArr);

            this.draw();
        },
    };

    Shapes.Triangle.prototype = {
        constructor: this,
        draw: function () {
            graphic.lineStyle(this.lineStyleWidth, this.lineStyleColor);
            graphic.beginFill(this.fillColor);
            graphic.drawPolygon([
                new PIXI.Point(this.x, this.y),
                new PIXI.Point(this.B_X, this.B_Y),
                new PIXI.Point(this.C_X, this.C_Y),
            ]);
            graphic.closePath();
            graphic.endFill();
        },
        update: function () {
            if (this.B_Y + this.lineStyleWidth > sceneHeight) {
                this.y = this.y - sceneHeight;
                this.B_Y = -this.lineStyleWidth;
                this.C_Y = -this.lineStyleWidth;
            }

            this.y += gravityValue;
            this.B_Y += gravityValue;
            this.C_Y += gravityValue;

            this.draw();
        },
    };

    Shapes.Hexagon.prototype = {
        constructor: this,
        draw: function () {
            graphic.lineStyle(this.lineStyleWidth, this.lineStyleColor);
            graphic.beginFill(this.fillColor);
            graphic.drawPolygon([
                new PIXI.Point(this.x, this.y),
                new PIXI.Point(this.B_X, this.B_Y),
                new PIXI.Point(this.C_X, this.C_Y),
                new PIXI.Point(this.D_X, this.D_Y),
                new PIXI.Point(this.E_X, this.E_Y),
                new PIXI.Point(this.F_X, this.F_Y),
            ]);
            graphic.closePath();
            graphic.endFill();
        },
        update: function () {
            if (this.D_Y + this.lineStyleWidth > sceneHeight) {
                this.y = this.y - sceneHeight;
                this.B_Y = this.y + 15;
                this.C_Y = this.B_Y + 35;
                this.D_Y = this.B_Y + 70;
                this.E_Y = this.y + 70;
                this.F_Y = this.y + 35;
            }

            this.y += gravityValue;
            this.B_Y += gravityValue;
            this.C_Y += gravityValue;
            this.D_Y += gravityValue;
            this.E_Y += gravityValue;
            this.F_Y += gravityValue;

            this.draw();
        },
    };

    function initShapes() {
        animatedShapesArr = [
            new Shapes.Circle(
                2,
                getRandonColor(),
                getRandonColor(),
                (32 + position(sceneWidth - 30 - 30 - 2).x),
                (32 + position(sceneHeight - 30 - 30 - 2).y),
                30),
            new Shapes.Ellipse(
                2,
                getRandonColor(),
                getRandonColor(),
                (102 + position(sceneWidth - 70 - 70 - 2).x),
                (32 + position(sceneHeight - 30 - 30 - 2).y),
                30, 70),
            new Shapes.Rectangle(
                2,
                getRandonColor(),
                getRandonColor(),
                (2 + position(sceneWidth - 100 - 2).x),
                (2 + position(sceneHeight - 70 - 2).y),
                100, 70),
            new Shapes.Triangle(),
            new Shapes.Hexagon(),
        ];
    }

    function handlerOfShapes(arr, methodName) {
        for (var i = 0, len = arr.length; i < len; i++) {
            arr[i][methodName]();
        }
    }

    function addShapes(x, y) {
        var randomShape = new ShapesValuesArr[getRandomInt(ShapesValuesArr.length)](null, null, null, x, y);

        animatedShapesArr.push(randomShape);

        console.log(animatedShapesArr);

        handlerOfShapes([randomShape], 'draw');
    }

    app.stage.addChild(graphic);

    initShapes();
    
    handlerOfShapes(animatedShapesArr, 'draw');

    ticker.add(animate);
    ticker.start();

    function animate() {
        graphic.clear();

        handlerOfShapes(animatedShapesArr, 'update');

        //console.log(animatedShapesArr);
    }

    window.addEventListener('click', function(event) {
        if (event.target.id == 'scene') {
            addShapes(event.x - startXAxis, event.y - startYAxis);

            //console.log(event.x, startXAxis);
        }
        
    });

    document.getElementById('increase-gravity').addEventListener('click', function (event) {
        gravityValue += 1;
    });

    document.getElementById('decrease-gravity').addEventListener('click', function (event) {
        if (gravityValue > 1) {
            gravityValue -= 1;
        }
    });
}






window.onload = init();