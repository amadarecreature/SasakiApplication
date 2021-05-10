export enum GoStoneColor {
    BLACK = "black",
    WHITE = "white",
    NONE = ""
}
export class PointerPosition {
    readonly x: number;
    readonly y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
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

export class GoBoadInfo {
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
    // 罫線の幅
    readonly keisenWidth: number;

    /**
     * 碁盤の構成情報
     * @param roWidth 
     * @param roHeight 
     * @param left 
     * @param top 
     * @param roCount 
     */
    constructor(roWidth: number, roHeight: number, left: number, top: number, roCount: number, keisenWidth: number = 1) {
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
}

export enum GoMoveType {
    BLACK = "B",
    WHITE = "W",
    OKI_BLACK = "AB",
    OKI_WHITE = "AE",
    AGEHAMA_B = "XAGB",
    AGEHAMA_W = "XAGW",
    NONE = "NONE"
}
export class KifuPart {
    readonly color: GoMoveType;
    readonly position: PositionOnGoBoad;
    readonly isPassed: boolean;
    /**
     * 
     * @param moveType 着手内容
     * @param roX 左端からの路数(0～)
     * @param roY 上端からの路数(0～)
     * @param isPassed true:パス
     */
    constructor(moveType: GoMoveType, roX: number, roY: number, isPassed: boolean = false) {
        this.color = moveType;
        this.position = new PositionOnGoBoad(roX, roY);
        this.isPassed = isPassed;
    }
}
export class PositionXY {
    readonly x: number;
    readonly y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class PositionOnGoBoad {
    readonly roX: number;
    readonly roY: number;
    /**
     * 路数で位置を指定
     * @param roX 0～18 
     * @param roY 0～18
     */
    constructor(roX: number, roY: number) {
        if (roX < 0 || roY < 0) {
            throw new Error("ro must be greater than 0.");
        }
        this.roX = roX;
        this.roY = roY;
    }
}