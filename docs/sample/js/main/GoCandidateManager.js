import { GoBoadInfo, PositionOnGoBoad, PositionXY } from "./GoSetting.js";
/**
 * 碁石を管理するクラス
 */
var GoCandidateManager = /** @class */ (function () {
    /**
     * このクラスが扱うコンテキストと幅(縦も同義)を注入する
     * @param canvas
     * @param goSetting
     * @param roCount
     * @param logger
     */
    function GoCandidateManager(canvas, goSetting, roCount) {
        // 候補番号(カウントアップ用)
        this.candidateNumber = 0;
        this.roWidth = goSetting.roHW;
        this.roHeight = goSetting.roHW;
        this.roCount = roCount;
        this.goBoadInfo = new GoBoadInfo(goSetting.roHW, goSetting.roHW, goSetting.gobanLeft, goSetting.gobanTop, roCount);
        //カンバスが使用できるかチェック
        if (!canvas.getContext) {
            console.log('[Roulette.constructor] カンバスが使用できません');
            this.roCount = 0;
            return;
        }
        //カンバス・コンテキスト・大きさを注入する
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        //クラスを通して変わらないカンバス設定
        this.initCanvas(this.canvas, this.goBoadInfo);
    }
    /**
     * 碁盤上での位置左上から数えた路数
     * @param x
     * @param y
     */
    GoCandidateManager.prototype.calcPositionOnGoban = function (x, y) {
        var top = this.goBoadInfo.top;
        var left = this.goBoadInfo.left;
        console.log("boad:" + top + ":" + left);
        var x0 = x - left;
        // 1区画の半分先までは、手前の路数として判断する
        var xRo = Math.floor((x0 + (this.roWidth / 2)) / this.roWidth) - 1;
        var y0 = y - top;
        // 1区画の半分先までは、手前の路数として判断する
        var yRo = Math.floor((y0 + (this.roHeight / 2)) / this.roHeight) - 1;
        return new PositionOnGoBoad(xRo, yRo);
    };
    /**
     * 碁盤を描画します。
     * @param shadow 影の長さ（高さ/2）
     * @param context 描画先のコンテキストを指定します。
     * @since 0.1
     */
    GoCandidateManager.prototype.initCanvas = function (canvas, goBoadInfo) {
        // サイズ変更(サイズ変更すると描画内容が消えるので先に変更)
        canvas.width = goBoadInfo.width + 20;
        canvas.height = goBoadInfo.height + 20;
        this.candidateNumber = 0;
    };
    GoCandidateManager.prototype.clearAll = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.candidateNumber = 0;
    };
    /**
     * 候補手を打つ
     * @param mouseX
     * @param mouseY
     * @param word
     */
    GoCandidateManager.prototype.addCandidate = function (mouseX, mouseY) {
        var positionOnGoban = this.calcPositionOnGoban(mouseX, mouseY);
        var keisen = 1;
        // 碁石の中心位置を計算する。
        var circleCenterPosition = this.calcCircleCenterPosition(keisen, positionOnGoban);
        var radius = this.goBoadInfo.roHeight * 0.475; // 半径
        var caondidateWord = String(this.candidateNumber + 1);
        this.drawCircle(circleCenterPosition.x, circleCenterPosition.y, radius, 0.6, this.context, "green");
        this.drawWord(circleCenterPosition.x, circleCenterPosition.y, caondidateWord, this.context, radius);
        this.candidateNumber += 1;
        console.log("candidateNumber:" + this.candidateNumber);
    };
    GoCandidateManager.prototype.clearGoishiByRo = function (positionOnGoban) {
        var keisen = 1;
        // 碁石の中心位置を計算する。
        var circleCenterPosition = this.calcCircleCenterPosition(keisen, positionOnGoban);
        this.clearGoishi(circleCenterPosition.x - (this.roWidth / 2), circleCenterPosition.y - (this.roHeight / 2), this.context);
    };
    GoCandidateManager.prototype.drawWord = function (x, y, word, context, maxwidth) {
        context.beginPath();
        context.fillStyle = "white";
        context.font = "20px 'ＭＳ ゴシック'";
        context.fillText(word, x - 5, y + 7, maxwidth);
        context.closePath;
        context.stroke();
    };
    GoCandidateManager.prototype.calcCircleCenterPosition = function (keisen, positionOnGoban) {
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
    GoCandidateManager.prototype.clearGoishi = function (x, y, context) {
        context.clearRect(x, y, this.roWidth, this.roHeight);
        // 透明度
        console.log("color", "clear");
    };
    GoCandidateManager.prototype.drawCircle = function (x, y, r, globalAlpha, context, fillStyle) {
        context.beginPath();
        context.arc(x, y, r, 0, 2 * Math.PI);
        context.globalAlpha = globalAlpha;
        context.fillStyle = fillStyle;
        context.fill();
        // 透明度
        context.lineWidth = 3;
        context.strokeStyle = "white";
        context.stroke();
        context.closePath();
    };
    return GoCandidateManager;
}());
export { GoCandidateManager };
