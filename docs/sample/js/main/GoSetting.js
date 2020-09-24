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
    function GoBoadInfo(roWidth, roHeight, left, top, roCount) {
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
    }
    return GoBoadInfo;
}());
export { GoBoadInfo };
