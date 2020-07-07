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

    function position(val) {
        return {
            x: getRandomInt(val + 1),
            y: getRandomInt(val + 1)
        };
    }

    function getRandonColor(alpha) {
        if (alpha) return rgb2hex('rgba(' + getRandomInt(256) + ',' + getRandomInt(256) + ',' + getRandomInt(256) + ',' + alpha + ')');
        
        return rgb2hex('rgb(' + getRandomInt(256) + ',' + getRandomInt(256) + ',' + getRandomInt(256) + ')');
    }

    console.log(getRandonColor(50));

    var scene = document.querySelector('#scene'),
        app = new PIXI.Application({
            view: scene,
            antialias: true,
            backgroundColor: rgb2hex('rgb(255, 255, 255)')
        }),
        graphic = new PIXI.Graphics(),
        ticker = new PIXI.Ticker(),
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
        w = window,
        w_w = w.innerWidth,
        w_h = w.innerHeight,
        animatedShapesArr = [],
        gravityValue = 1;
    
    app.stage.addChild(graphic);

    gravityAmountBox.innerText = gravityValue;

    graphic.interactive = true;
    graphic.buttonMode = true;

    var shapeClickEvent = new CustomEvent('shapeClick', {
        detail:
            {
                x: null,
                y: null
            }
    });

    var changeStateShapeEvent = new CustomEvent('changeStateShapeEvent', {
        detail:
            {
                typeShape: null,
                fillColor: null,
                lineStyleColor: null
            }
    });

    graphic.click = function (e) {
        shapeClickEvent.detail.x = e.data.global.x;
        shapeClickEvent.detail.y = e.data.global.y;
        document.dispatchEvent(shapeClickEvent);

        //console.log(e);
    };

    function BaseShape(animatedIndex, lineStyleWidth, lineStyleColor, fillColor, x, y) {
        this.lineStyleWidth = lineStyleWidth || 2;
        this.lineStyleColor = lineStyleColor || getRandonColor();
        this.fillColor = fillColor || getRandonColor();
        this.x = x || 100;
        this.y = y || 100;
        this.animatedIndex = animatedIndex;
        this.triggerShapeEvent = false;
    }

    var Shapes = {
        Circle: function (animatedIndex, lineStyleWidth, lineStyleColor, fillColor, x, y, radius) {
            BaseShape.call(this, animatedIndex, lineStyleWidth, lineStyleColor, fillColor, x, y);

            this.radius = radius || 50;
            this.typeShape = 'Circle';
        },
        Ellipse: function (animatedIndex, lineStyleWidth, lineStyleColor, fillColor, x, y, width, height) {
            BaseShape.call(this, animatedIndex, lineStyleWidth, lineStyleColor, fillColor, x, y);

            this.width = width || 50;
            this.height = height || 100;
            this.typeShape = 'Ellipse';
        },
        Rectangle: function (animatedIndex, lineStyleWidth, lineStyleColor, fillColor, x, y, width, height) {
            BaseShape.call(this, animatedIndex, lineStyleWidth, lineStyleColor, fillColor, x, y);

            this.width = width || 100;
            this.height = height || 100;
            this.typeShape = 'Rectangle';
        },
        Triangle: function (animatedIndex, lineStyleWidth, lineStyleColor, fillColor, x, y) {
            BaseShape.call(this, animatedIndex, lineStyleWidth, lineStyleColor, fillColor, x, y);

            this.B_X = this.x - 75;
            this.B_Y = this.y + 100;
            this.C_X = this.x + 75;
            this.C_Y = this.y + 100;
            this.typeShape = 'Triangle';
        },
        Pentagon: function (animatedIndex, lineStyleWidth, lineStyleColor, fillColor, x, y) {
            BaseShape.call(this, animatedIndex, lineStyleWidth, lineStyleColor, fillColor, x, y);

            this.B_X = this.x + 50;
            this.B_Y = this.y + 50;
            this.C_X = this.B_X;
            this.C_Y = this.B_Y + 100;
            this.E_X = this.x - 50;
            this.E_Y = this.y + 50;
            this.D_X = this.E_X;
            this.D_Y = this.E_Y + 100;
            this.typeShape = 'Pentagon';
        },
        Hexagon: function (animatedIndex, lineStyleWidth, lineStyleColor, fillColor, x, y) {
            BaseShape.call(this, animatedIndex, lineStyleWidth, lineStyleColor, fillColor, x, y);

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
            this.typeShape = 'Hexagon';
        }
    };

    var typeShapesArr = Object.values(Shapes);

    Shapes.Circle.prototype = {
        constructor: this,
        initCircle: function () {
            return new PIXI.Circle(this.x, this.y, this.radius);
        },
        draw: function () {
            graphic.lineStyle(this.lineStyleWidth, this.lineStyleColor);
            graphic.beginFill(this.fillColor);
            graphic.drawShape(this.initCircle());
            graphic.endFill();

            if (!this.triggerShapeEvent) {
                document.addEventListener('shapeClick', e => {
                    if (this.initCircle().contains(e.detail.x, e.detail.y)) {
                        animatedShapesArr.splice(this.animatedIndex, 1, null);

                        changeStateShapeEvent.detail.typeShape = this.typeShape;
                        changeStateShapeEvent.detail.fillColor = this.fillColor;
                        changeStateShapeEvent.detail.lineStyleColor = this.lineStyleColor;

                        document.dispatchEvent(changeStateShapeEvent);
                    }
                });

                document.addEventListener('changeStateShapeEvent', e => {
                    if (this.typeShape == e.detail.typeShape) {
                        this.fillColor = e.detail.fillColor;
                        this.lineStyleColor = e.detail.lineStyleColor;
                    }
                });

                this.triggerShapeEvent = true;
            }
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
        initEllipse: function () {
            return new PIXI.Ellipse(this.x, this.y, this.width, this.height);
        },
        draw: function() {
            graphic.lineStyle(this.lineStyleWidth, this.lineStyleColor);
            graphic.beginFill(this.fillColor);
            graphic.drawShape(this.initEllipse());
            graphic.endFill();

            if (!this.triggerShapeEvent) {
                document.addEventListener('shapeClick', e => {
                    if (this.initEllipse().contains(e.detail.x, e.detail.y)) {
                        animatedShapesArr.splice(this.animatedIndex, 1, null);

                        changeStateShapeEvent.detail.typeShape = this.typeShape;
                        changeStateShapeEvent.detail.fillColor = this.fillColor;
                        changeStateShapeEvent.detail.lineStyleColor = this.lineStyleColor;

                        document.dispatchEvent(changeStateShapeEvent);
                    }
                });

                document.addEventListener('changeStateShapeEvent', e => {
                    if (this.typeShape == e.detail.typeShape) {
                        this.fillColor = e.detail.fillColor;
                        this.lineStyleColor = e.detail.lineStyleColor;
                    }
                });

                this.triggerShapeEvent = true;
            }
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
        initRectangle: function () {
            return new PIXI.Rectangle(this.x, this.y, this.width, this.height);
        },
        draw: function () {
            graphic.lineStyle(this.lineStyleWidth, this.lineStyleColor);
            graphic.beginFill(this.fillColor);
            graphic.drawShape(this.initRectangle());
            graphic.endFill();

            if (!this.triggerShapeEvent) {
                document.addEventListener('shapeClick', e => {
                    if (this.initRectangle().contains(e.detail.x, e.detail.y)) {
                        animatedShapesArr.splice(this.animatedIndex, 1, null);

                        changeStateShapeEvent.detail.typeShape = this.typeShape;
                        changeStateShapeEvent.detail.fillColor = this.fillColor;
                        changeStateShapeEvent.detail.lineStyleColor = this.lineStyleColor;

                        document.dispatchEvent(changeStateShapeEvent);
                    }
                });

                document.addEventListener('changeStateShapeEvent', e => {
                    if (this.typeShape == e.detail.typeShape) {
                        this.fillColor = e.detail.fillColor;
                        this.lineStyleColor = e.detail.lineStyleColor;
                    }
                });

                this.triggerShapeEvent = true;
            }
        },
        update: function () {
            if (this.y > sceneHeight) {
                this.y = -(this.height + this.lineStyleWidth);
            }

            this.y += gravityValue;

            this.draw();
        },
    };

    Shapes.Triangle.prototype = {
        constructor: this,
        initTriangle: function () {
            return new PIXI.Polygon([
                new PIXI.Point(this.x, this.y),
                new PIXI.Point(this.B_X, this.B_Y),
                new PIXI.Point(this.C_X, this.C_Y),
            ]);
        },
        draw: function () {
            graphic.lineStyle(this.lineStyleWidth, this.lineStyleColor);
            graphic.beginFill(this.fillColor);
            graphic.drawShape(this.initTriangle());
            graphic.closePath();
            graphic.endFill();

            if (!this.triggerShapeEvent) {
                document.addEventListener('shapeClick', e => {
                    if (this.initTriangle().contains(e.detail.x, e.detail.y)) {
                        animatedShapesArr.splice(this.animatedIndex, 1, null);

                        changeStateShapeEvent.detail.typeShape = this.typeShape;
                        changeStateShapeEvent.detail.fillColor = this.fillColor;
                        changeStateShapeEvent.detail.lineStyleColor = this.lineStyleColor;

                        document.dispatchEvent(changeStateShapeEvent);
                    }
                });

                document.addEventListener('changeStateShapeEvent', e => {
                    if (this.typeShape == e.detail.typeShape) {
                        this.fillColor = e.detail.fillColor;
                        this.lineStyleColor = e.detail.lineStyleColor;
                    }
                });

                this.triggerShapeEvent = true;
            }
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
        initPentagon: function () {
            return new PIXI.Polygon([
                new PIXI.Point(this.x, this.y),
                new PIXI.Point(this.B_X, this.B_Y),
                new PIXI.Point(this.C_X, this.C_Y),
                new PIXI.Point(this.D_X, this.D_Y),
                new PIXI.Point(this.E_X, this.E_Y),
            ]);
        },
        draw: function () {
            graphic.lineStyle(this.lineStyleWidth, this.lineStyleColor);
            graphic.beginFill(this.fillColor);
            graphic.drawShape(this.initPentagon());
            graphic.closePath();
            graphic.endFill();

            if (!this.triggerShapeEvent) {
                document.addEventListener('shapeClick', e => {
                    if (this.initPentagon().contains(e.detail.x, e.detail.y)) {
                        animatedShapesArr.splice(this.animatedIndex, 1, null);

                        changeStateShapeEvent.detail.typeShape = this.typeShape;
                        changeStateShapeEvent.detail.fillColor = this.fillColor;
                        changeStateShapeEvent.detail.lineStyleColor = this.lineStyleColor;

                        document.dispatchEvent(changeStateShapeEvent);
                    }
                });

                document.addEventListener('changeStateShapeEvent', e => {
                    if (this.typeShape == e.detail.typeShape) {
                        this.fillColor = e.detail.fillColor;
                        this.lineStyleColor = e.detail.lineStyleColor;
                    }
                });

                this.triggerShapeEvent = true;
            }
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
        initHexagon: function () {
            return new PIXI.Polygon([
                new PIXI.Point(this.x, this.y),
                new PIXI.Point(this.B_X, this.B_Y),
                new PIXI.Point(this.C_X, this.C_Y),
                new PIXI.Point(this.D_X, this.D_Y),
                new PIXI.Point(this.E_X, this.E_Y),
                new PIXI.Point(this.F_X, this.F_Y),
            ]);
        },
        draw: function () {
            graphic.lineStyle(this.lineStyleWidth, this.lineStyleColor);
            graphic.beginFill(this.fillColor);
            graphic.drawShape(this.initHexagon());
            graphic.closePath();
            graphic.endFill();

            if (!this.triggerShapeEvent) {
                document.addEventListener('shapeClick', e => {
                    if (this.initHexagon().contains(e.detail.x, e.detail.y)) {
                        animatedShapesArr.splice(this.animatedIndex, 1, null);

                        changeStateShapeEvent.detail.typeShape = this.typeShape;
                        changeStateShapeEvent.detail.fillColor = this.fillColor;
                        changeStateShapeEvent.detail.lineStyleColor = this.lineStyleColor;

                        document.dispatchEvent(changeStateShapeEvent);
                    }
                });

                document.addEventListener('changeStateShapeEvent', e => {
                    if (this.typeShape == e.detail.typeShape) {
                        this.fillColor = e.detail.fillColor;
                        this.lineStyleColor = e.detail.lineStyleColor;
                    }
                });

                this.triggerShapeEvent = true;
            }
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
            new Shapes.Circle(0, 2, getRandonColor(), getRandonColor(), 50, 50, 30),
            new Shapes.Ellipse(1, 2, getRandonColor(), getRandonColor(), 200, 50, 70, 30),
            new Shapes.Rectangle(2, 2, getRandonColor(), getRandonColor(), 200, 30, 100, 70),
            new Shapes.Triangle(3, 2, getRandonColor(), getRandonColor(), 200, 200),
            new Shapes.Pentagon(4),
            new Shapes.Hexagon(5),
        ];
    }

    function handlerOfShapes(arr, methodName) {
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i]) arr[i][methodName]();
        }
    }

    function addShapes(x, y) {

        console.log(x, y);

        var randomShape = new typeShapesArr[getRandomInt(typeShapesArr.length)](animatedShapesArr.length, 2, getRandonColor(), getRandonColor(), x, y);

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
        graphic.drawRect(0, 0, sceneWidth, sceneHeight);
        graphic.endFill();

        handlerOfShapes(animatedShapesArr, 'update');

        //console.log(animatedShapesArr);
    }

    /* window.addEventListener('click', function(event) {
        if (event.target.id == 'scene') {
            addShapes(event.x - startXAxis, event.y - startYAxis);
        }
        
    }); */

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