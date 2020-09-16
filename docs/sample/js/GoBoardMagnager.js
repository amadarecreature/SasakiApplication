var GoishiType;
(function (GoishiType) {
    GoishiType["BLACK"] = "B";
    GoishiType["WHITE"] = "W";
    GoishiType["NONE"] = "N";
})(GoishiType || (GoishiType = {}));
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
    function GoBoadManager(canvas, canvasIshi, goSetting, ro, logger) {
        // 一路の横
        this.dx = 22;
        // 一路の縦
        this.dy = 24;
        this.turn = GoishiType.BLACK;
        this.logger = logger;
        this.goSetting = goSetting;
        //カンバスが使用できるかチェック
        if (!canvas.getContext) {
            console.log('[Roulette.constructor] カンバスが使用できません');
            this.enable = false;
            this.ro = 0;
            this.gobanTop = 0;
            this.gobanLeft = 0;
            this.kifu = new Array();
            this.realtimePosition = new Array();
            return;
        }
        //カンバス・コンテキスト・大きさを注入する
        this.canvas = canvas;
        this.canvasIshi = canvasIshi;
        this.ctx = canvas.getContext('2d');
        this.ctxIshi = canvasIshi.getContext("2d");
        this.ro = ro;
        this.goSetting = goSetting;
        this.gobanTop = goSetting.gobanTop;
        this.gobanLeft = goSetting.gobanLeft;
        this.kifu = new Array();
        this.realtimePosition = new Array();
        for (var i = 0; i < ro; i++) {
            this.realtimePosition[i] = new Array(); // （2）
            for (var j = 0; j < 9; j++) {
                this.realtimePosition[i][j] = GoishiType.NONE; // （3）
            }
        }
        //enable を true にする
        this.enable = true;
        //クラスを通して変わらないカンバス設定
        this.ctx.font = "bold 15px '游ゴシック'";
        this.ctx.textAlign = 'center';
        this.ctx.shadowBlur = 2;
        this.drawBoard(5, this.canvas, this.canvasIshi, this.ctx);
    }
    /**
     * 碁盤上での位置左上から数えた路数
     * @param x
     * @param y
     */
    GoBoadManager.prototype.calcPositionOnGoban = function (x, y) {
        var x0 = x - this.gobanLeft;
        var xRo = Math.floor((x0 + (this.dx / 2)) / this.dx);
        var y0 = y - this.gobanTop;
        var yRo = Math.floor((y0 + (this.dy / 2)) / this.dy);
        console.info("ro=" + xRo + ":" + yRo);
        return new PositionXY(xRo, yRo);
    };
    GoBoadManager.prototype.renew = function (ro) {
        this.ro = ro;
        this.drawBoard(5, this.canvas, this.canvasIshi, this.ctx);
    };
    /**
     * 碁盤を描画します。
     * @param shadow 影の長さ（高さ/2）
     * @param context 描画先のコンテキストを指定します。
     * @since 0.1
     */
    GoBoadManager.prototype.drawBoard = function (shadow, canvas, canvasIshi, context) {
        // 碁盤のサイズ
        var width = this.dx * (this.ro + 1);
        var height = this.dy * (this.ro + 1);
        var gwidth = this.dx * (this.ro - 1) + 2;
        var gheight = this.dy * (this.ro - 1) + 2;
        var gx = this.gobanLeft + Math.floor((width - gwidth) / 2);
        var gy = this.gobanTop + Math.floor((height - gheight) / 2);
        // サイズ変更(サイズ変更すると描画内容が消えるので先に変更)
        canvas.width = width + 20;
        canvas.height = height + 20;
        canvasIshi.width = width + 20;
        canvasIshi.height = height + 20;
        console.log("canvas:", canvas.width, canvas.height);
        // 碁盤の影
        this.drowShadow(this.ctx, this.gobanLeft, this.gobanTop, width, shadow, height);
        // 碁盤
        this.drowGoban(this.ctx, this.gobanLeft, this.gobanTop, width, height);
        // 木目
        // drawWoodGrain(x, y, width, height, context);
        // 格子
        this.drowKoushi(this.ctx, gx, this.ro, gy, this.dy, gwidth, this.dx, gheight);
        // TODO:変更の仕方調べる
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
            if (col == 1 || col == ro)
                lwidth = 2;
            else
                lwidth = 1;
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
    };
    GoBoadManager.prototype.drowGoban = function (context, x, y, width, height) {
        context.beginPath();
        context.rect(x, y, width, height);
        context.fillStyle = "burlywood";
        context.globalAlpha = 1.0;
        context.fill();
    };
    GoBoadManager.prototype.drowShadow = function (context, x, y, width, shadow, height) {
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x + width, y);
        context.lineTo(x + width + shadow, y + shadow);
        context.lineTo(x + width + shadow, y + height + shadow);
        context.lineTo(x + shadow, y + height + shadow);
        context.lineTo(x, y + height);
        context.closePath();
        context.fillStyle = "black";
        context.globalAlpha = 0.5;
        context.fill();
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
    GoBoadManager.prototype.drawCircle = function (x, y, r, shadow, context, fillStyle) {
        context.beginPath();
        context.arc(x + r + shadow, y + r + shadow, r, 0, 2 * Math.PI);
        context.fillStyle = fillStyle;
        // 透明度
        context.globalAlpha = this.goSetting.goishiGlobalAlpha;
        context.fill();
        console.log("color", fillStyle);
    };
    /**
     * 碁石を置きます。
     * @param mouseX
     * @param mouseY
     */
    GoBoadManager.prototype.addGoishi = function (mouseX, mouseY) {
        // const mouseX = event.offsetX;
        // const mouseY = event.offsetY;
        console.info("click=" + mouseX + ":" + mouseY);
        var width = this.dx * (this.ro + 1);
        var height = this.dy * (this.ro + 1);
        var gwidth = this.dx * (this.ro - 1) + 2;
        var gheight = this.dy * (this.ro - 1) + 2;
        var gx = this.gobanLeft + Math.floor((width - gwidth) / 2);
        var gy = this.gobanTop + Math.floor((height - gheight) / 2);
        var nowTurn = this.turn;
        // TODO:値を受け取る
        var positionOnGoban = this.calcPositionOnGoban(mouseX, mouseY);
        var keisen = 1;
        var circleX = gx + 1 + keisen + (this.dx) * (positionOnGoban.x - 1);
        // TODO:なぜ２を足さないといけないのか?
        // 端の線は2px
        var circleY = gy + 2 + keisen + (this.dy) * (positionOnGoban.y - 1);
        console.info("circle=" + circleX + ":" + circleY);
        if (this.realtimePosition[positionOnGoban.x - 1][positionOnGoban.y - 1] != GoishiType.NONE) {
            console.log("既に石がある。");
            return;
        }
        var fillstyle = (nowTurn == GoishiType.BLACK) ? "black" : "white";
        this.drawCircle(circleX - (this.dx / 2), circleY - (this.dy / 2), 10, 0, this.ctxIshi, fillstyle);
        // 棋譜の設定
        this.kifu.push(new KifuPart(nowTurn, positionOnGoban.x - 1, positionOnGoban.y - 1));
        // 配置の設定
        this.realtimePosition[positionOnGoban.x - 1][positionOnGoban.y - 1] = nowTurn;
        // ターンを入れ替える
        this.turn = (nowTurn == GoishiType.BLACK) ? GoishiType.WHITE : GoishiType.BLACK;
        var tmp = "";
        this.kifu.forEach(function (kifu) {
            tmp += kifu.color + "(" + kifu.position.x + ":" + kifu.position.y + ")";
        });
        this.logger.log("kifu:" + tmp);
        // auClick.play();
        // turn = 3 - turn;
    };
    return GoBoadManager;
}());
export { GoBoadManager };
