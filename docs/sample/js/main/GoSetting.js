var GoBoadSetting = /** @class */ (function () {
    function GoBoadSetting(gobanTop, gobanLeft, goishiGlobalAlpha, roHW) {
        this.goishiGlobalAlpha = goishiGlobalAlpha;
        this.gobanTop = gobanTop;
        this.gobanLeft = gobanLeft;
        this.roHW = roHW;
    }
    return GoBoadSetting;
}());
export { GoBoadSetting };
var GoBoadInfo = /** @class */ (function () {
    /**
     * 碁盤の構成情報
     * @param roWidth
     * @param roHeight
     * @param left
     * @param top
     * @param roCount
     */
    function GoBoadInfo(roWidth, roHeight, left, top, roCount, keisenWidth) {
        if (keisenWidth === void 0) { keisenWidth = 1; }
        this.roWidth = roWidth;
        this.roHeight = roHeight;
        this.roCount = roCount;
        this.left = left;
        this.top = top;
        this.width = this.roWidth * (this.roCount + 1);
        this.height = this.roHeight * (this.roCount + 1);
        this.areaWidth = this.roWidth * (this.roCount - 1) + 2;
        this.areaHeight = this.roHeight * (this.roCount - 1) + 2;
        this.areaLeft = left + Math.floor((this.width - this.areaWidth) / 2);
        this.areaTop = top + Math.floor((this.height - this.areaHeight) / 2);
        this.keisenWidth = keisenWidth;
    }
    return GoBoadInfo;
}());
export { GoBoadInfo };
export var GoTebanType;
(function (GoTebanType) {
    GoTebanType["BLACK"] = "B";
    GoTebanType["WHITE"] = "W";
    GoTebanType["OKI"] = "AB";
    GoTebanType["OKI_WHITE"] = "AE";
    GoTebanType["NONE"] = "NONE";
})(GoTebanType || (GoTebanType = {}));
var KifuPart = /** @class */ (function () {
    function KifuPart(color, roX, roY, isPassed) {
        if (isPassed === void 0) { isPassed = false; }
        this.color = color;
        this.position = new PositionOnGoBoad(roX, roY);
        this.isPassed = isPassed;
    }
    return KifuPart;
}());
export { KifuPart };
var PositionXY = /** @class */ (function () {
    function PositionXY(x, y) {
        this.x = x;
        this.y = y;
    }
    return PositionXY;
}());
export { PositionXY };
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
export { PositionOnGoBoad };
