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

    var W = window,
        W_w = W.innerWidth,
        W_h = W.innerHeight,
        scene = document.querySelector('#scene'),
        app = new PIXI.Application({
            view: scene,
            antialias: true,
            backgroundColor: rgb2hex('rgb(255, 255, 255)'),
            // resizeTo: W
        }),
        graphic = new PIXI.Graphics(),
        ticker = new PIXI.Ticker(),
        pixiEventEmitter =  new PIXI.utils.EventEmitter();
        decreaseShapesBtn = document.querySelector('#decrease-amount'),
        increaseShapesBtn = document.querySelector('#increase-amount'),
        increaseGravityBtn = document.querySelector('#increase-gravity'),
        descreaseGravityBtn = document.querySelector('#decrease-gravity'),
        shapesAmountBox = document.querySelector('.shapes-amount-box'),
        gravityAmountBox = document.querySelector('.gravity-amount-box'),
        sceneWidth = scene.offsetWidth,
        sceneHeight = scene.offsetHeight,
        startXAxis = Math.ceil(scene.getBoundingClientRect().left),
        startYAxis = Math.ceil(scene.getBoundingClientRect().top),
        animatedShapesArr = [],
        gravityValue = 1;

    app.stage.addChild(graphic);

    gravityAmountBox.innerText = gravityValue;

    graphic.interactive = true;
    graphic.buttonMode = true;
    
    graphic.on('click', e => {
        pixiEventEmitter.emit('clicked', {});
        console.log('graphic', e);
    });

    graphic.drawRect(0, 0, 800, 600);

    console.log(graphic);

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
        Pentagon: function (lineStyleWidth, lineStyleColor, fillColor, x, y) {
            BaseShape.call(this, lineStyleWidth, lineStyleColor, fillColor, x, y);

            this.B_X = this.x + 50;
            this.B_Y = this.y + 50;
            this.C_X = this.B_X;
            this.C_Y = this.B_Y + 100;
            this.E_X = this.x - 50;
            this.E_Y = this.y + 50;
            this.D_X = this.E_X;
            this.D_Y = this.E_Y + 100;
        },
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

    Shapes.Pentagon.prototype = {
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
            ]);
            graphic.closePath();
            graphic.endFill();
        },
        update: function () {
            if (this.D_Y + this.lineStyleWidth > sceneHeight) {
                this.y = this.y - sceneHeight;
                this.B_Y = this.y + 50;
                this.C_Y = this.B_Y + 100;
                this.E_Y = this.y + 50;
                this.D_Y = this.E_Y + 100;
            }

            this.y += gravityValue;
            this.B_Y += gravityValue;
            this.C_Y += gravityValue;
            this.D_Y += gravityValue;
            this.E_Y += gravityValue;

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
                50,
                50,
                30),
            new Shapes.Ellipse(
                2,
                getRandonColor(),
                getRandonColor(),
                200,
                50,
                70, 30),
            new Shapes.Rectangle(
                2,
                getRandonColor(),
                getRandonColor(),
                300,
                50,
                100, 70),
            new Shapes.Triangle(),
            new Shapes.Pentagon(),
            new Shapes.Hexagon(),
        ];
    }

    function handlerOfShapes(arr, methodName) {
        for (var i = 0, len = arr.length; i < len; i++) {
            arr[i][methodName]();
        }
    }

    function addShapes(x, y) {

        console.log(x, y);

        var randomShape = new ShapesValuesArr[getRandomInt(ShapesValuesArr.length)](null, null, null, x || 200, y || 400);

        animatedShapesArr.push(randomShape);

        shapesAmountBox.innerText = animatedShapesArr.length;

        console.log(animatedShapesArr);

        handlerOfShapes([randomShape], 'draw');
    }

    initShapes();

    shapesAmountBox.innerText = animatedShapesArr.length;
    
    handlerOfShapes(animatedShapesArr, 'draw');

    ticker.add(animate);
    ticker.start();

    function animate() {
        graphic.clear();

        graphic.beginFill(0xFFFFFF);
        graphic.drawShape(new PIXI.Rectangle(0, 0, sceneWidth, sceneHeight));
        graphic.endFill();

        handlerOfShapes(animatedShapesArr, 'update');

        //console.log(animatedShapesArr);
    }

    W.addEventListener('click', function(event) {
        if (event.target.id == 'scene') {
            addShapes(event.x - startXAxis, event.y - startYAxis);

            //console.log(event.x, startXAxis);
        }
        
    });

    increaseGravityBtn.addEventListener('click', function (event) {
        if (gravityValue == 1) descreaseGravityBtn.classList.remove('event-none', 'muted');

        gravityValue += 1;
        gravityAmountBox.innerText = gravityValue;
    });

    descreaseGravityBtn.addEventListener('click', function (event) {
        if (gravityValue > 1) {
            gravityValue -= 1;
            gravityAmountBox.innerText = gravityValue;
        }

        if (gravityValue == 1) event.target.classList.add('event-none', 'muted');
    });

    function incrementShapes(event) {
        if (animatedShapesArr.length == 0) decreaseShapesBtn.classList.remove('event-none', 'muted');

        addShapes();
    }

    function decrementShapes(event) {
        if (animatedShapesArr.length) {
            animatedShapesArr.splice(getRandomInt(animatedShapesArr.length), 1);
            shapesAmountBox.innerText = animatedShapesArr.length;
        }

        if (animatedShapesArr.length == 0) event.target.classList.add('event-none', 'muted');
    }

    increaseShapesBtn.addEventListener('click', incrementShapes);
    decreaseShapesBtn.addEventListener('click', decrementShapes);
}






window.onload = init();