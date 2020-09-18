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