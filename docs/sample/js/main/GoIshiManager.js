import { GoBoadInfo } from "./GoSetting.js";
var GoishiType;
(function (GoishiType) {
    GoishiType["BLACK"] = "B";
    GoishiType["WHITE"] = "W";
    GoishiType["OKI"] = "O";
    GoishiType["NONE"] = "N";
})(GoishiType || (GoishiType = {}));
var KifuPart = /** @class */ (function () {
    function KifuPart(color, roX, roY, isPassed) {
        this.color = color;
        this.position = new PositionOnGoBoad(roX, roY);
        this.isPassed = isPassed;
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
var PositionOnGoBoad = /** @class */ (function () {
    /**
     * 路数で位置を指定
     * @param roX 0～18
     * @param roY 0～18
     */
    function PositionOnGoBoad(roX, roY) {
        if (roX < 0 || roY < 0) {
            throw new Error("ro must be greater than 0.");
        }
        this.roX = roX;
        this.roY = roY;
    }
    return PositionOnGoBoad;
}());
/**
 * 碁石を管理するクラス
 */
var GoishiManager = /** @class */ (function () {
    /**
     * このクラスが扱うコンテキストと幅(縦も同義)を注入する
     * @param canvas
     * @param goSetting
     * @param roCount
     * @param logger
     */
    function GoishiManager(canvas, goSetting, roCount, logger) {
        this.roWidth = goSetting.roHW;
        this.roHeight = goSetting.roHW;
        this._turn = GoishiType.BLACK;
        this.logger = logger;
        this.roCount = roCount;
        this.goBoadInfo = new GoBoadInfo(goSetting.roHW, goSetting.roHW, goSetting.gobanLeft, goSetting.gobanTop, roCount);
        this.kifu = new Array();
        //カンバスが使用できるかチェック
        if (!canvas.getContext) {
            console.log('[Roulette.constructor] カンバスが使用できません');
            this.roCount = 0;
            this.realtimePosition = new Array();
            return;
        }
        //カンバス・コンテキスト・大きさを注入する
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        // 現在地の初期化
        this.realtimePosition = new Array();
        for (var i = 0; i < roCount; i++) {
            this.realtimePosition[i] = new Array(); // （2）
            for (var j = 0; j < roCount; j++) {
                this.realtimePosition[i][j] = GoishiType.NONE; // （3）
            }
        }
        //クラスを通して変わらないカンバス設定
        this.context.font = "bold 15px '游ゴシック'";
        this.context.textAlign = 'center';
        this.context.shadowBlur = 2;
        this.initCanvas(this.canvas, this.goBoadInfo);
    }
    Object.defineProperty(GoishiManager.prototype, "turn", {
        get: function () {
            return this._turn;
        },
        enumerable: false,
        configurable: true
    });
    GoishiManager.prototype.viewFromKifu = function (kifuString) {
        var kifuList = KifuUtil.convertKifuListFromString(kifuString);
        var positions = new Array();
        for (var i = 0; i < this.roCount; i++) {
            positions[i] = new Array();
            for (var j = 0; j < this.roCount; j++) {
                positions[i][j] = GoishiType.NONE;
            }
        }
        for (var index = 0; index < kifuList.length; index++) {
            var element = this.kifu[index];
            var x = element.position.roX;
            var y = element.position.roY;
            positions[x][y] = element.color;
        }
        this.viewFromPosition(positions);
    };
    /**
     * 棋譜の内容をそのまま表示する。
     */
    GoishiManager.prototype.viewFromPosition = function (realtimePosition) {
        this.clearGoishiView();
        for (var x = 0; x < realtimePosition.length; x++) {
            var col = realtimePosition[x];
            for (var y = 0; y < col.length; y++) {
                var color = realtimePosition[x][y];
                var kifuPart = new KifuPart(color, x, y, false);
                if (kifuPart.color == GoishiType.NONE) {
                    // 何もしない
                }
                else {
                    this.addGoishi(kifuPart);
                }
            }
        }
    };
    /**
     * 碁盤上での位置左上から数えた路数
     * @param x
     * @param y
     */
    GoishiManager.prototype.calcPositionOnGoban = function (x, y) {
        var top = this.goBoadInfo.top;
        var left = this.goBoadInfo.left;
        console.log("boad:" + top + ":" + left);
        var x0 = x - left;
        // 1区画の半分先までは、手前の路数として判断する
        var xRo = Math.floor((x0 + (this.roWidth / 2)) / this.roWidth) - 1;
        var y0 = y - top;
        // 1区画の半分先までは、手前の路数として判断する
        var yRo = Math.floor((y0 + (this.roHeight / 2)) / this.roHeight) - 1;
        // console.info("ro=" + xRo + ":" + yRo);
        return new PositionOnGoBoad(xRo, yRo);
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
        // console.log("initCanvas:", canvas.width, canvas.height);
    };
    GoishiManager.prototype.clearGoishiView = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    GoishiManager.prototype.addOkiIshi = function (mouseX, mouseY) {
        console.info("click=" + mouseX + ":" + mouseY);
        var positionOnGoban = this.calcPositionOnGoban(mouseX, mouseY);
        var keisen = 1;
        // 碁石の中心位置を計算する。
        var circleCenterPosition = this.calcCircleCenterPosition(keisen, positionOnGoban);
        // console.info("circle=" + circleCenterPosition.x + ":" + circleCenterPosition.y);
        if (this.realtimePosition[positionOnGoban.roX][positionOnGoban.roY] != GoishiType.NONE) {
            console.log("既に石がある。");
            this.clearGoishi(circleCenterPosition.x - (this.roWidth / 2), circleCenterPosition.y - (this.roHeight / 2), this.context);
            this.realtimePosition[positionOnGoban.roX][positionOnGoban.roY] = GoishiType.NONE;
            return;
        }
        var tmp = this.drawGoishi(GoishiType.BLACK, circleCenterPosition, positionOnGoban);
        // 次を白番にする
        this._turn = GoishiType.WHITE;
        this.logger.log(tmp);
    };
    GoishiManager.prototype.chakushBack = function (count) {
        var now = this.kifu.length - 1;
        var targetNo = now - count;
        var targetChakushu = this.kifu[targetNo];
        this.clearGoishiByRo(targetChakushu.position);
    };
    GoishiManager.prototype.clearGoishiByRo = function (positionOnGoban) {
        var keisen = 1;
        // 碁石の中心位置を計算する。
        var circleCenterPosition = this.calcCircleCenterPosition(keisen, positionOnGoban);
        this.clearGoishi(circleCenterPosition.x - (this.roWidth / 2), circleCenterPosition.y - (this.roHeight / 2), this.context);
    };
    GoishiManager.prototype.addGoishi = function (kifuPart) {
        var keisen = 1;
        // 碁石の中心位置を計算する。
        var circleCenterPosition = this.calcCircleCenterPosition(keisen, kifuPart.position);
        var kifu = this.drawGoishi(kifuPart.color, circleCenterPosition, kifuPart.position);
        this.logger.log(kifu);
    };
    /**
     * 着手動作
     * @param mouseX
     * @param mouseY
     */
    GoishiManager.prototype.chakushu = function (mouseX, mouseY) {
        console.info("click position=" + mouseX + ":" + mouseY);
        var nowTurn = this._turn;
        var positionOnGoBoad = this.calcPositionOnGoban(mouseX, mouseY);
        var keisen = 1;
        // 碁石の中心位置を計算する。
        var circleCenterPosition = this.calcCircleCenterPosition(keisen, positionOnGoBoad);
        console.info("circle=" + circleCenterPosition.x + ":" + circleCenterPosition.y);
        console.info("positionOnGoBoad=" + positionOnGoBoad.roX + ":" + positionOnGoBoad.roY);
        if (this.realtimePosition[positionOnGoBoad.roX][positionOnGoBoad.roY] != GoishiType.NONE) {
            console.log("既に石がある。");
            this.clearGoishi(circleCenterPosition.x - (this.roWidth / 2), circleCenterPosition.y - (this.roHeight / 2), this.context);
            this.realtimePosition[positionOnGoBoad.roX][positionOnGoBoad.roY] = GoishiType.NONE;
            return;
        }
        var tmp = this.drawGoishi(nowTurn, circleCenterPosition, positionOnGoBoad);
        // ターンを入れ替える
        this._turn = (nowTurn == GoishiType.BLACK) ? GoishiType.WHITE : GoishiType.BLACK;
        this.logger.log(tmp);
        // auClick.play();
        // turn = 3 - turn;
    };
    GoishiManager.prototype.drawGoishi = function (nowTurn, circleCenterPosition, positionOnGoban) {
        var fillstyle = (nowTurn == GoishiType.BLACK) ? "black" : "white";
        var radius = this.goBoadInfo.roHeight * 0.5; // 半径
        this.drawCircle(circleCenterPosition.x - (this.roWidth / 2), circleCenterPosition.y - (this.roHeight / 2), radius, this.context, fillstyle);
        // 棋譜の設定
        this.kifu.push(new KifuPart(nowTurn, positionOnGoban.roX, positionOnGoban.roY, false));
        // 配置の設定
        this.realtimePosition[positionOnGoban.roX][positionOnGoban.roY] = nowTurn;
        var tmp = "";
        this.kifu.forEach(function (kifu) {
            tmp += kifu.color + "(" + kifu.position.roX + ":" + kifu.position.roY + ")";
        });
        return tmp;
    };
    GoishiManager.prototype.calcCircleCenterPosition = function (keisen, positionOnGoban) {
        var circleX = this.goBoadInfo.areaLeft + keisen + (this.roWidth) * (positionOnGoban.roX);
        // 端の線は2px(格子ごとの線+1pxなので、足りない1pxだけ足す)
        var circleY = this.goBoadInfo.areaTop + keisen + (this.roHeight) * (positionOnGoban.roY);
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
        context.clearRect(x, y, this.roWidth, this.roHeight);
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
        context.globalAlpha = 1;
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
var KifuUtil = /** @class */ (function () {
    function KifuUtil() {
    }
    KifuUtil.convertKifuListFromString = function (value) {
        // TODO:実装する
        return new Array();
    };
    return KifuUtil;
}());
