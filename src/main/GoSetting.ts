export class GoBoadSetting {
    readonly goishiGlobalAlpha: number;

    readonly gobanTop: number;
    readonly gobanLeft: number;

    // 路のサイズ(正方形)
    readonly roHW: number;

    constructor(gobanTop: number, gobanLeft: number, goishiGlobalAlpha: number, roHW: number) {
        this.goishiGlobalAlpha = goishiGlobalAlpha;
        this.gobanTop = gobanTop;
        this.gobanLeft = gobanLeft;
        this.roHW = roHW;
    }
}

export 
class GoBoadInfo {
    // 一路の幅
    readonly roWidth: number;
    // 一路の高さ
    readonly roHeight: number;
    // 路数
    readonly roCount: number;

    // 碁盤全体の幅
    readonly width: number;
    // 碁盤全体の高さ
    readonly height: number;
    // 碁盤全体の左端
    readonly left: number;
    // 碁盤全体の上端
    readonly top: number;

    // 格子全体の幅
    readonly areaWidth: number;
    // 格子全体の高さ
    readonly areaHeight: number;
    // 格子全体の左端位置
    readonly areaLeft: number;
    // 格子全体の上端位置
    readonly areaTop: number;

    /**
     * 碁盤の構成情報
     * @param roWidth 
     * @param roHeight 
     * @param left 
     * @param top 
     * @param roCount 
     */
    constructor(roWidth: number, roHeight: number, left: number, top: number, roCount: number) {
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
}
