var GoishiType;
(function (GoishiType) {
    GoishiType["BLACK"] = "B";
    GoishiType["WHITE"] = "W";
    GoishiType["OKI"] = "O";
    GoishiType["NONE"] = "N";
})(GoishiType || (GoishiType = {}));
var GoBoadInfo = /** @class */ (function () {
    function GoBoadInfo(roWidth, roHeight, left, top, roCount) {
        this.roWidth = roWidth;
        this.roHeight = roHeight;
        this.roCount = roCount;
        this.width = this.roWidth * (this.roCount + 1);
        this.height = this.roHeight * (this.roCount + 1);
        this.areaWidth = this.roWidth * (this.roCount - 1) + 2;
        this.areaHeight = this.roHeight * (this.roCount - 1) + 2;
        this.areaLeft = left + Math.floor((this.width - this.areaWidth) / 2);
        this.areaTop = top + Math.floor((this.height - this.areaHeight) / 2);
    }
    return GoBoadInfo;
}());
var KifuPart = /** @class */ (function () {
    function KifuPart(color, roX, roY) {
        this.color = color;
        this.position = new PositionXY(roX, roY);
    }
    return KifuPart;
}());
var PositionXY = /** @class */ (function () {
    function PositionXY(x, y) {
        this.x = x;
        this.y = y;
    }
    return PositionXY;
}());
var GoBoadManager = /** @class */ (function () {
    /**
     * このクラスが扱うコンテキストと幅(縦も同義)を注入する
     * @param canvas
     * @param goSetting
     * @param ro
     */
    function GoBoadManager(canvas, goSetting, ro, logger) {
        this.turn = GoishiType.BLACK;
        this.logger = logger;
        this.goSetting = goSetting;
        //カンバスが使用できるかチェック
        if (!canvas.getContext) {
            console.log('[Roulette.constructor] カンバスが使用できません');
            this.enable = false;
            this.roCount = 0;
            this.gobanTop = 0;
            this.gobanLeft = 0;
            this.kifu = new Array();
            this.realtimePosition = new Array();
            return;
        }
        //カンバス・コンテキスト・大きさを注入する
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.roCount = ro;
        this.goSetting = goSetting;
        this.gobanTop = goSetting.gobanTop;
        this.gobanLeft = goSetting.gobanLeft;
        this.kifu = new Array();
        this.realtimePosition = new Array();
        for (var i = 0; i < ro; i++) {
            this.realtimePosition[i] = new Array(); // （2）
            for (var j = 0; j < 19; j++) {
                this.realtimePosition[i][j] = GoishiType.NONE; // （3）
            }
        }
        //enable を true にする
        this.enable = true;
        //クラスを通して変わらないカンバス設定
        this.context.font = "bold 15px '游ゴシック'";
        this.context.textAlign = 'center';
        this.context.shadowBlur = 2;
        this.drawBoard(5, this.canvas, this.context);
    }
    /**
     * 碁盤を描画します。
     * @param shadow 影の長さ（高さ/2）
     * @param context 描画先のコンテキストを指定します。
     * @since 0.1
     */
    GoBoadManager.prototype.drawBoard = function (shadow, canvas, context) {
        // 碁盤のサイズ
        var gobanWidth = this.goSetting.roHW * (this.roCount + 1);
        var gobanHeight = this.goSetting.roHW * (this.roCount + 1);
        var areaWidth = this.goSetting.roHW * (this.roCount - 1) + 2;
        var areaHeight = this.goSetting.roHW * (this.roCount - 1) + 2;
        var areaLeft = this.gobanLeft + Math.floor((gobanWidth - areaWidth) / 2);
        var areaTop = this.gobanTop + Math.floor((gobanHeight - areaHeight) / 2);
        // サイズ変更(サイズ変更すると描画内容が消えるので先に変更)
        canvas.width = gobanWidth + 20;
        canvas.height = gobanHeight + 20;
        console.log("canvas:", canvas.width, canvas.height);
        // 碁盤の影
        this.drowShadow(this.context, this.gobanLeft, this.gobanTop, gobanWidth, shadow, gobanHeight);
        // 碁盤
        this.drowGoban(this.context, this.gobanLeft, this.gobanTop, gobanWidth, gobanHeight);
        // 木目
        // drawWoodGrain(x, y, width, height, context);
        // 格子
        this.drowKoushi(this.context, areaLeft, this.roCount, areaTop, this.goSetting.roHW, areaWidth, this.goSetting.roHW, areaHeight);
    };
    GoBoadManager.prototype.drowKoushi = function (context, gx, ro, gy, dy, gwidth, dx, gheight) {
        context.fillStyle = "black";
        var y1, lwidth;
        // 横の格子線
        var x2;
        var y2 = gy;
        for (var col = 1; col <= ro; col++) {
            if (col == 1)
                x2 = gx + (col - 1) * dx;
            else
                x2 = gx + 1 + (col - 1) * dx;
            if (col == 1 || col == ro) {
                lwidth = 2;
            }
            else {
                lwidth = 1;
            }
            context.beginPath();
            context.rect(x2, y2, lwidth, gheight);
            context.fill();
            console.log("格子横:" + col, x2);
        }
        // （横の格子線）
        var x1 = gx;
        for (var row = 1; row <= ro; row++) {
            if (row == 1)
                y1 = gy + (row - 1) * dy;
            else
                y1 = gy + 1 + (row - 1) * dy;
            if (row == 1 || row == ro)
                lwidth = 2;
            else
                lwidth = 1;
            context.beginPath();
            context.rect(x1, y1, gwidth, lwidth);
            context.fill();
            console.log("格子縦:" + row, y1);
        }
        // 星の点
        // drawCircle
    };
    GoBoadManager.prototype.drowGoban = function (context, x, y, width, height) {
        context.beginPath();
        context.rect(x, y, width, height);
        context.fillStyle = "burlywood";
        context.globalAlpha = 1.0;
        context.fill();
    };
    GoBoadManager.prototype.drowShadow = function (context, left, top, width, shadow, height) {
        context.beginPath();
        context.moveTo(left, top);
        context.lineTo(left + width, top);
        context.lineTo(left + width + shadow, top + shadow);
        context.lineTo(left + width + shadow, top + height + shadow);
        context.lineTo(left + shadow, top + height + shadow);
        context.lineTo(left, top + height);
        context.closePath();
        context.fillStyle = "black";
        context.globalAlpha = 0.4;
        context.fill();
    };
    return GoBoadManager;
}());
export { GoBoadManager };
/**
 * 碁石を管理するクラス
 */
var GoishiManager = /** @class */ (function () {
    /**
     * このクラスが扱うコンテキストと幅(縦も同義)を注入する
     * @param canvas
     * @param goSetting
     * @param ro
     * @param logger
     */
    function GoishiManager(canvas, goSetting, ro, logger) {
        // 一路の横
        this.roWidthX = 22;
        // 一路の縦
        this.roHeight = 22;
        this._turn = GoishiType.BLACK;
        this.logger = logger;
        this.goSetting = goSetting;
        this.gobanTop = goSetting.gobanTop;
        this.gobanLeft = goSetting.gobanLeft;
        this.roCount = ro;
        this.goBoadInfo = new GoBoadInfo(22, 22, goSetting.gobanLeft, goSetting.gobanTop, ro);
        //カンバスが使用できるかチェック
        if (!canvas.getContext) {
            console.log('[Roulette.constructor] カンバスが使用できません');
            this.roCount = 0;
            this.gobanTop = 0;
            this.gobanLeft = 0;
            this.kifu = new Array();
            this.realtimePosition = new Array();
            return;
        }
        //カンバス・コンテキスト・大きさを注入する
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.kifu = new Array();
        // 現在地の初期化(最初から19路分用意しておく)
        this.realtimePosition = new Array();
        for (var i = 0; i < ro; i++) {
            this.realtimePosition[i] = new Array(); // （2）
            for (var j = 0; j < ro; j++) {
                this.realtimePosition[i][j] = GoishiType.NONE; // （3）
            }
        }
        //クラスを通して変わらないカンバス設定
        this.ctx.font = "bold 15px '游ゴシック'";
        this.ctx.textAlign = 'center';
        this.ctx.shadowBlur = 2;
        this.initCanvas(this.canvas, this.goBoadInfo);
    }
    Object.defineProperty(GoishiManager.prototype, "turn", {
        get: function () {
            return this._turn;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 碁盤上での位置左上から数えた路数
     * @param x
     * @param y
     */
    GoishiManager.prototype.calcPositionOnGoban = function (x, y) {
        var x0 = x - this.gobanLeft;
        var xRo = Math.floor((x0 + (this.roWidthX / 2)) / this.roWidthX);
        var y0 = y - this.gobanTop;
        var yRo = Math.floor((y0 + (this.roHeight / 2)) / this.roHeight);
        console.info("ro=" + xRo + ":" + yRo);
        return new PositionXY(xRo, yRo);
    };
    /**
     * 碁盤を描画します。
     * @param shadow 影の長さ（高さ/2）
     * @param context 描画先のコンテキストを指定します。
     * @since 0.1
     */
    GoishiManager.prototype.initCanvas = function (canvas, goBoadInfo) {
        // サイズ変更(サイズ変更すると描画内容が消えるので先に変更)
        canvas.width = goBoadInfo.width + 20;
        canvas.height = goBoadInfo.height + 20;
        console.log("initCanvas:", canvas.width, canvas.height);
    };
    GoishiManager.prototype.addOkiIshi = function (mouseX, mouseY) {
        console.info("click=" + mouseX + ":" + mouseY);
        var positionOnGoban = this.calcPositionOnGoban(mouseX, mouseY);
        var keisen = 1;
        // 碁石の中心位置を計算する。
        var circleCenterPosition = this.calcCircleCenterPosition(keisen, positionOnGoban);
        console.info("circle=" + circleCenterPosition.x + ":" + circleCenterPosition.y);
        if (this.realtimePosition[positionOnGoban.x - 1][positionOnGoban.y - 1] != GoishiType.NONE) {
            console.log("既に石がある。");
            this.clearGoishi(circleCenterPosition.x - (this.roWidthX / 2), circleCenterPosition.y - (this.roHeight / 2), this.ctx);
            this.realtimePosition[positionOnGoban.x - 1][positionOnGoban.y - 1] = GoishiType.NONE;
            return;
        }
        var tmp = this.newMethod(GoishiType.BLACK, circleCenterPosition, positionOnGoban);
        // 次を白番にする
        this._turn = GoishiType.WHITE;
        this.logger.log("kifu:" + tmp);
    };
    GoishiManager.prototype.chakushBack = function (count) {
        var now = this.kifu.length - 1;
        var targetNo = now - count;
        var targetChakushu = this.kifu[targetNo];
        this.clearGoishiByRo(new PositionXY(targetChakushu.position.x + 1, targetChakushu.position.y + 1));
    };
    GoishiManager.prototype.clearGoishiByRo = function (positionOnGoban) {
        var keisen = 1;
        // 碁石の中心位置を計算する。
        var circleCenterPosition = this.calcCircleCenterPosition(keisen, positionOnGoban);
        this.clearGoishi(circleCenterPosition.x - (this.roWidthX / 2), circleCenterPosition.y - (this.roHeight / 2), this.ctx);
    };
    /**
     * 碁石を置きます。
     * @param mouseX
     * @param mouseY
     */
    GoishiManager.prototype.chakushu = function (mouseX, mouseY) {
        console.info("click=" + mouseX + ":" + mouseY);
        var nowTurn = this._turn;
        var positionOnGoban = this.calcPositionOnGoban(mouseX, mouseY);
        var keisen = 1;
        // 碁石の中心位置を計算する。
        var circleCenterPosition = this.calcCircleCenterPosition(keisen, positionOnGoban);
        console.info("circle=" + circleCenterPosition.x + ":" + circleCenterPosition.y);
        if (this.realtimePosition[positionOnGoban.x - 1][positionOnGoban.y - 1] != GoishiType.NONE) {
            console.log("既に石がある。");
            this.clearGoishi(circleCenterPosition.x - (this.roWidthX / 2), circleCenterPosition.y - (this.roHeight / 2), this.ctx);
            this.realtimePosition[positionOnGoban.x - 1][positionOnGoban.y - 1] = GoishiType.NONE;
            return;
        }
        var tmp = this.newMethod(nowTurn, circleCenterPosition, positionOnGoban);
        // ターンを入れ替える
        this._turn = (nowTurn == GoishiType.BLACK) ? GoishiType.WHITE : GoishiType.BLACK;
        this.logger.log("kifu:" + tmp);
        // auClick.play();
        // turn = 3 - turn;
    };
    GoishiManager.prototype.newMethod = function (nowTurn, circleCenterPosition, positionOnGoban) {
        var fillstyle = (nowTurn == GoishiType.BLACK) ? "black" : "white";
        this.drawCircle(circleCenterPosition.x - (this.roWidthX / 2), circleCenterPosition.y - (this.roHeight / 2), 10, this.ctx, fillstyle);
        // 棋譜の設定
        this.kifu.push(new KifuPart(nowTurn, positionOnGoban.x - 1, positionOnGoban.y - 1));
        // 配置の設定
        this.realtimePosition[positionOnGoban.x - 1][positionOnGoban.y - 1] = nowTurn;
        var tmp = "";
        this.kifu.forEach(function (kifu) {
            tmp += kifu.color + "(" + kifu.position.x + ":" + kifu.position.y + ")";
        });
        return tmp;
    };
    GoishiManager.prototype.calcCircleCenterPosition = function (keisen, positionOnGoban) {
        var circleX = this.goBoadInfo.areaLeft + keisen + (this.roWidthX) * (positionOnGoban.x - 1);
        // 端の線は2px(格子ごとの線+1pxなので、足りない1pxだけ足す)
        var circleY = this.goBoadInfo.areaTop + keisen + (this.roHeight) * (positionOnGoban.y - 1);
        var circleCenterPosition = new PositionXY(circleX, circleY);
        return circleCenterPosition;
    };
    /**
     * 円形オブジェクトを消します。
     * @param x 左端座標
     * @param y 上端座標
     * @param context 描画先のコンテキストを指定します。
     * @since 0.1
     */
    GoishiManager.prototype.clearGoishi = function (x, y, context) {
        context.clearRect(x, y, this.roWidthX, this.roHeight);
        // 透明度
        console.log("color", "clear");
    };
    /**
     * 円形オブジェクトを描画します。
     * @param x 左端座標
     * @param y 上端座標
     * @param r 半径
     * @param shadow 影の長さ（高さ/2）
     * @param context 描画先のコンテキストを指定します。
     * @since 0.1
     */
    GoishiManager.prototype.drawCircle = function (x, y, r, context, fillStyle) {
        context.beginPath();
        context.arc(x + r, y + r, r, 0, 2 * Math.PI);
        context.fillStyle = fillStyle;
        // 透明度
        context.globalAlpha = this.goSetting.goishiGlobalAlpha;
        context.fill();
        // テカリ
        context.beginPath();
        context.arc(x + r, y + r, r * 0.8, 0, -0.25 * Math.PI, true);
        context.closePath;
        context.strokeStyle = (fillStyle == "black") ? "white" : "black";
        context.lineCap = "round";
        context.lineWidth = 0.5;
        context.stroke();
        console.log("color", fillStyle);
    };
    return GoishiManager;
}());
export { GoishiManager };
