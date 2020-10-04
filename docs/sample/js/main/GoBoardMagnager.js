import { GoBoadInfo } from "./GoSetting.js";
var GoBoadManager = /** @class */ (function () {
    /**
     * このクラスが扱うコンテキストと幅(縦も同義)を注入する
     * @param canvas
     * @param goSetting
     * @param ro
     */
    function GoBoadManager(canvas, goSetting, ro) {
        var goBoadInfo = new GoBoadInfo(goSetting.roHW, goSetting.roHW, goSetting.gobanLeft, goSetting.gobanTop, ro);
        //カンバスが使用できるかチェック
        if (!canvas.getContext) {
            console.log('[Roulette.constructor] カンバスが使用できません');
            // this.roCount = 0;
            return;
        }
        //カンバス・コンテキスト・大きさを注入する
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        //クラスを通して変わらないカンバス設定
        this.context.font = "bold 15px '游ゴシック'";
        this.context.textAlign = 'center';
        this.context.shadowBlur = 2;
        this.drawBoard(5, this.canvas, this.context, goBoadInfo);
    }
    /**
     * 碁盤を描画します。
     * @param shadow 影の長さ（高さ/2）
     * @param context 描画先のコンテキストを指定します。
     * @since 0.1
     */
    GoBoadManager.prototype.drawBoard = function (shadow, canvas, context, goBoadInfo) {
        // canvasのサイズ変更(サイズ変更すると描画内容が消えるので先に変更)
        canvas.width = goBoadInfo.width + 20;
        canvas.height = goBoadInfo.height + 20;
        // console.log("canvas:", canvas.width, canvas.height);
        // 碁盤の影
        this.drowShadow(this.context, goBoadInfo.left, goBoadInfo.top, goBoadInfo.width, shadow, goBoadInfo.height);
        // 碁盤
        this.drowGoban(this.context, goBoadInfo.left, goBoadInfo.top, goBoadInfo.width, goBoadInfo.height);
        // 木目
        // drawWood(x, y, width, height, context);
        // 格子
        this.drowKoushi(this.context, goBoadInfo, goBoadInfo.areaLeft, goBoadInfo.roWidth, goBoadInfo.areaWidth, goBoadInfo.roHeight, goBoadInfo.areaHeight);
    };
    GoBoadManager.prototype.drowKoushi = function (context, goBoadInfo, gx, dy, gwidth, dx, gheight) {
        context.fillStyle = "black";
        var y1, lwidth;
        var lineBaseWidth = goBoadInfo.keisenWidth;
        // 横の格子線
        var x2;
        var y2 = goBoadInfo.areaTop;
        var gy = goBoadInfo.areaTop;
        var ro = goBoadInfo.roCount;
        for (var col = 1; col <= ro; col++) {
            if (col == 1)
                x2 = gx + (col - 1) * dx;
            else
                x2 = gx + 1 + (col - 1) * dx;
            if (col == 1 || col == ro) {
                lwidth = lineBaseWidth * 2;
            }
            else {
                lwidth = lineBaseWidth;
            }
            context.beginPath();
            context.rect(x2, y2, lwidth, gheight);
            context.fill();
            console.log("格子横:" + col, x2);
        }
        // （横の格子線）
        var x1 = goBoadInfo.areaLeft;
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
