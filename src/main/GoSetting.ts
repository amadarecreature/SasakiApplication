export class GoBoadSetting {
    readonly goishiGlobalAlpha: number;

    readonly gobanTop: number;
    readonly gobanLeft: number;

    constructor(gobanTop: number, gobanLeft: number, goishiGlobalAlpha: number) {
        this.goishiGlobalAlpha = goishiGlobalAlpha;
        this.gobanTop = gobanTop;
        this.gobanLeft = gobanLeft;

    }
} 