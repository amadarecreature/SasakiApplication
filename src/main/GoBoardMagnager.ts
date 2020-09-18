import { GoBoadSetting } from "./GoSetting";
import { Logger } from "./GoLogger";
enum GoishiType {
    BLACK = "B",
    WHITE = "W",
    OKI = "O",
    NONE = "N"
}
class GoBoadInfo {
    readonly roWidth: number;
    readonly roHeight: number;
    readonly roCount: number;
    readonly width: number;
    readonly height: number;
    readonly areaWidth: number;
    readonly areaHeight: number;
    readonly areaLeft: number;
    readonly areaTop: number;
    constructor(roWidth: number, roHeight: number, left: number, top: number, roCount: number) {
        this.roWidth = roWidth;
        this.roHeight = roHeight;
        this.roCount = roCount;

        this.width = this.roWidth * (this.roCount + 1);
        this.height = this.roHeight * (this.roCount + 1);
        this.areaWidth = this.roWidth * (this.roCount - 1) + 2;
        this.areaHeight = this.roHeight * (this.roCount - 1) + 2;
        this.areaLeft = left + Math.floor((this.width - this.areaWidth) / 2);
        this.areaTop = top + Math.floor((this.height - this.areaHeight) / 2);
    }
}
class KifuPart {
    readonly color: GoishiType;
    readonly position: PositionXY;
    constructor(color: GoishiType, roX: number, roY: number) {
        this.color = color;
        this.position = new PositionXY(roX, roY);
    }
}
class PositionXY {

    readonly x: number;
    readonly y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
export class GoBoadManager {

    readonly kifu: KifuPart[];

    readonly realtimePosition: GoishiType[][];

    /**
     * このクラスが扱うカンバスのコンテキスト
     * 
     */
    readonly context!: CanvasRenderingContext2D;

    readonly ctxIshi!: CanvasRenderingContext2D;

    /**
     * このクラスが扱うカンバスの横幅(縦幅)
     */

    private canvas!: HTMLCanvasElement;

    private canvasIshi!: HTMLCanvasElement;

    private enable: boolean;

    private turn: GoishiType;

    private gobanTop: number;
    private gobanLeft: number;

    private goSetting: GoBoadSetting;

    readonly logger: Logger;


    // 一路の横
    private roWidth = 22;
    // 一路の縦
    private roHeight = 22;

    private roCount: number;

    /**
     * このクラスが扱うコンテキストと幅(縦も同義)を注入する
     * @param canvas 
     * @param goSetting
     * @param ro 
     */
    public constructor(canvas: HTMLCanvasElement, canvasIshi: HTMLCanvasElement, goSetting: GoBoadSetting, ro: number, logger: Logger) {

        this.turn = GoishiType.BLACK;
        this.logger = logger;
        this.goSetting = goSetting;

        //カンバスが使用できるかチェック
        if (!canvas.getContext) {
            console.log('[Roulette.constructor] カンバスが使用できません');
            this.enable = false;
            this.roCount = 0;
            this.gobanTop = 0;
            this.gobanLeft = 0;
            this.kifu = new Array();
            this.realtimePosition = new Array();
            return;
        }



        //カンバス・コンテキスト・大きさを注入する
        this.canvas = canvas;
        this.canvasIshi = canvasIshi;
        this.context = canvas.getContext('2d')!;
        this.ctxIshi = canvasIshi.getContext("2d")!;

        this.roCount = ro;

        this.goSetting = goSetting;

        this.gobanTop = goSetting.gobanTop;
        this.gobanLeft = goSetting.gobanLeft;

        this.kifu = new Array();


        this.realtimePosition = new Array();
        for (var i = 0; i < ro; i++) {
            this.realtimePosition[i] = new Array();  // （2）
            for (var j = 0; j < 19; j++) {
                this.realtimePosition[i][j] = GoishiType.NONE;  // （3）
            }
        }

        //enable を true にする
        this.enable = true;

        //クラスを通して変わらないカンバス設定
        this.context.font = "bold 15px '游ゴシック'";
        this.context.textAlign = 'center';
        this.context.shadowBlur = 2;
        this.drawBoard(5, this.canvas, this.canvasIshi, this.context);
    }

    /**
     * 碁盤を描画します。
     * @param shadow 影の長さ（高さ/2）
     * @param context 描画先のコンテキストを指定します。
     * @since 0.1
     */
    private drawBoard(shadow: number, canvas: HTMLCanvasElement, canvasIshi: HTMLCanvasElement, context: CanvasRenderingContext2D) {

        // 碁盤のサイズ
        const gobanWidth = this.roWidth * (this.roCount + 1);
        const gobanHeight = this.roHeight * (this.roCount + 1);
        const areaWidth = this.roWidth * (this.roCount - 1) + 2;
        const areaHeight = this.roHeight * (this.roCount - 1) + 2;
        const areaLeft = this.gobanLeft + Math.floor((gobanWidth - areaWidth) / 2);
        const areaTop = this.gobanTop + Math.floor((gobanHeight - areaHeight) / 2);

        // サイズ変更(サイズ変更すると描画内容が消えるので先に変更)
        canvas.width = gobanWidth + 20;
        canvas.height = gobanHeight + 20;

        canvasIshi.width = gobanWidth + 20;
        canvasIshi.height = gobanHeight + 20;

        console.log("canvas:", canvas.width, canvas.height);

        // 碁盤の影
        this.drowShadow(this.context, this.gobanLeft, this.gobanTop, gobanWidth, shadow, gobanHeight);
        // 碁盤
        this.drowGoban(this.context, this.gobanLeft, this.gobanTop, gobanWidth, gobanHeight);
        // 木目
        // drawWoodGrain(x, y, width, height, context);
        // 格子
        this.drowKoushi(this.context, areaLeft, this.roCount, areaTop, this.roHeight, areaWidth, this.roWidth, areaHeight);

        // TODO:変更の仕方調べる

    }

    private drowKoushi(context: CanvasRenderingContext2D, gx: number, ro: number, gy: number, dy: number, gwidth: number, dx: number, gheight: number) {
        context.fillStyle = "black";


        let y1, lwidth;
        // 横の格子線
        let x2;
        const y2 = gy;
        for (var col = 1; col <= ro; col++) {
            if (col == 1)
                x2 = gx + (col - 1) * dx;

            else
                x2 = gx + 1 + (col - 1) * dx;
            if (col == 1 || col == ro) {
                lwidth = 2;

            } else {
                lwidth = 1;
            }
            context.beginPath();
            context.rect(x2, y2, lwidth, gheight);
            context.fill();
            console.log("格子横:" + col, x2);
        }

        // （横の格子線）
        const x1 = gx;
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
    }

    private drowGoban(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
        context.beginPath();
        context.rect(x, y, width, height);
        context.fillStyle = "burlywood";
        context.globalAlpha = 1.0;
        context.fill();
    }

    private drowShadow(context: CanvasRenderingContext2D, left: number, top: number, width: number, shadow: number, height: number) {
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
    }

    // /**
    //  * 円形オブジェクトを描画します。
    //  * @param x 左端座標
    //  * @param y 上端座標
    //  * @param r 半径
    //  * @param shadow 影の長さ（高さ/2）
    //  * @param context 描画先のコンテキストを指定します。
    //  * @since 0.1
    //  */
    // private drawCircle(x: number, y: number, r: number, context: CanvasRenderingContext2D, fillStyle: string) {
    //     context.beginPath();
    //     context.arc(x + r, y + r, r, 0, 2 * Math.PI);
    //     context.fillStyle = fillStyle;
    //     // 透明度
    //     context.globalAlpha = 1;
    //     context.fill();

    //     console.log("color", fillStyle);
    // }


}
/**
 * 碁石を管理するクラス
 */
export class GoishiManager {
    readonly kifu: KifuPart[];

    readonly realtimePosition: GoishiType[][];

    /**
     * このクラスが扱うカンバスのコンテキスト
     * 
     */
    readonly ctx!: CanvasRenderingContext2D;

    /**
     * このクラスが扱うカンバスの横幅(縦幅)
     */

    private canvas!: HTMLCanvasElement;

    private _turn: GoishiType;

    public get turn(): string {
        return this._turn;
    }


    private gobanTop: number;
    private gobanLeft: number;

    readonly goSetting: GoBoadSetting;

    readonly logger: Logger;

    readonly goBoadInfo: GoBoadInfo;

    // 一路の横
    private roWidthX = 22;
    // 一路の縦
    private roHeight = 22;

    // 路数
    readonly roCount: number;
    /**
     * このクラスが扱うコンテキストと幅(縦も同義)を注入する
     * @param canvas 
     * @param goSetting
     * @param ro 
     * @param logger
     */
    public constructor(canvas: HTMLCanvasElement, goSetting: GoBoadSetting, ro: number, logger: Logger) {

        this._turn = GoishiType.BLACK;
        this.logger = logger;

        this.goSetting = goSetting;
        this.gobanTop = goSetting.gobanTop;
        this.gobanLeft = goSetting.gobanLeft;
        this.roCount = ro;

        this.goBoadInfo = new GoBoadInfo(22, 22, goSetting.gobanLeft, goSetting.gobanTop, ro);

        //カンバスが使用できるかチェック
        if (!canvas.getContext) {
            console.log('[Roulette.constructor] カンバスが使用できません');
            this.roCount = 0;
            this.gobanTop = 0;
            this.gobanLeft = 0;
            this.kifu = new Array();
            this.realtimePosition = new Array();
            return;
        }

        //カンバス・コンテキスト・大きさを注入する
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;

        this.kifu = new Array();

        // 現在地の初期化(最初から19路分用意しておく)
        this.realtimePosition = new Array();
        for (var i = 0; i < ro; i++) {
            this.realtimePosition[i] = new Array();  // （2）
            for (var j = 0; j < ro; j++) {
                this.realtimePosition[i][j] = GoishiType.NONE;  // （3）
            }
        }

        //クラスを通して変わらないカンバス設定
        this.ctx.font = "bold 15px '游ゴシック'";
        this.ctx.textAlign = 'center';
        this.ctx.shadowBlur = 2;
        this.initCanvas(this.canvas, this.goBoadInfo);
    }
    /**
     * 碁盤上での位置左上から数えた路数
     * @param x 
     * @param y 
     */
    private calcPositionOnGoban(x: number, y: number): PositionXY {
        const x0 = x - this.gobanLeft;
        const xRo = Math.floor((x0 + (this.roWidthX / 2)) / this.roWidthX);
        const y0 = y - this.gobanTop;
        const yRo = Math.floor((y0 + (this.roHeight / 2)) / this.roHeight);

        console.info("ro=" + xRo + ":" + yRo);


        return new PositionXY(xRo, yRo);
    }

    /**
     * 碁盤を描画します。
     * @param shadow 影の長さ（高さ/2）
     * @param context 描画先のコンテキストを指定します。
     * @since 0.1
     */
    private initCanvas(canvas: HTMLCanvasElement, goBoadInfo: GoBoadInfo) {

        // 碁盤のサイズ
        // const width = this.roWidthX * (this.roCount + 1);
        // const height = this.roHeight * (this.roCount + 1);
        // const gwidth = this.roWidthX * (this.roCount - 1) + 2;
        // const gheight = this.roHeight * (this.roCount - 1) + 2;
        // const gx = this.gobanLeft + Math.floor((width - gwidth) / 2);
        // const gy = this.gobanTop + Math.floor((height - gheight) / 2);

        // サイズ変更(サイズ変更すると描画内容が消えるので先に変更)
        canvas.width = goBoadInfo.width + 20;
        canvas.height = goBoadInfo.height + 20;

        console.log("initCanvas:", canvas.width, canvas.height);
    }

    public addOkiIshi(mouseX: number, mouseY: number) {
        console.info("click=" + mouseX + ":" + mouseY);

        const positionOnGoban = this.calcPositionOnGoban(mouseX, mouseY)

        const keisen = 1;
        // 碁石の中心位置を計算する。
        const circleCenterPosition = this.calcCircleCenterPosition(keisen, positionOnGoban);

        console.info("circle=" + circleCenterPosition.x + ":" + circleCenterPosition.y);

        if (this.realtimePosition[positionOnGoban.x - 1][positionOnGoban.y - 1] != GoishiType.NONE) {
            console.log("既に石がある。")
            this.clearGoishi(circleCenterPosition.x - (this.roWidthX / 2), circleCenterPosition.y - (this.roHeight / 2), this.ctx);
            this.realtimePosition[positionOnGoban.x - 1][positionOnGoban.y - 1] = GoishiType.NONE;
            return;
        }


        var tmp = this.newMethod(GoishiType.BLACK, circleCenterPosition, positionOnGoban);

        // 次を白番にする
        this._turn = GoishiType.WHITE;

        this.logger.log("kifu:" + tmp);


    }

    /**
     * 碁石を置きます。
     * @param mouseX 
     * @param mouseY 
     */
    public chakushu(mouseX: number, mouseY: number) {

        console.info("click=" + mouseX + ":" + mouseY);

        const nowTurn = this._turn;

        const positionOnGoban = this.calcPositionOnGoban(mouseX, mouseY)

        const keisen = 1;
        // 碁石の中心位置を計算する。
        const circleCenterPosition = this.calcCircleCenterPosition(keisen, positionOnGoban);

        console.info("circle=" + circleCenterPosition.x + ":" + circleCenterPosition.y);

        if (this.realtimePosition[positionOnGoban.x - 1][positionOnGoban.y - 1] != GoishiType.NONE) {
            console.log("既に石がある。")
            this.clearGoishi(circleCenterPosition.x - (this.roWidthX / 2), circleCenterPosition.y - (this.roHeight / 2), this.ctx);
            this.realtimePosition[positionOnGoban.x - 1][positionOnGoban.y - 1] = GoishiType.NONE;
            return;
        }


        var tmp = this.newMethod(nowTurn, circleCenterPosition, positionOnGoban);

        // ターンを入れ替える
        this._turn = (nowTurn == GoishiType.BLACK) ? GoishiType.WHITE : GoishiType.BLACK;

        this.logger.log("kifu:" + tmp);

        // auClick.play();
        // turn = 3 - turn;
    }
    private newMethod(nowTurn: GoishiType, circleCenterPosition: PositionXY, positionOnGoban: PositionXY) {
        const fillstyle = (nowTurn == GoishiType.BLACK) ? "black" : "white";
        this.drawCircle(circleCenterPosition.x - (this.roWidthX / 2), circleCenterPosition.y - (this.roHeight / 2), 10, this.ctx, fillstyle);



        // 棋譜の設定
        this.kifu.push(new KifuPart(nowTurn, positionOnGoban.x - 1, positionOnGoban.y - 1));

        // 配置の設定
        this.realtimePosition[positionOnGoban.x - 1][positionOnGoban.y - 1] = nowTurn;

        var tmp = "";
        this.kifu.forEach(kifu => {
            tmp += kifu.color + "(" + kifu.position.x + ":" + kifu.position.y + ")";
        });
        return tmp;
    }

    private calcCircleCenterPosition(keisen: number, positionOnGoban: PositionXY) {
        const circleX = this.goBoadInfo.areaLeft + 1 + keisen + (this.roWidthX) * (positionOnGoban.x - 1);
        // 端の線は2px(格子ごとの線+1px)
        const circleY = this.goBoadInfo.areaTop + 1 + keisen + (this.roHeight) * (positionOnGoban.y - 1);
        const circleCenterPosition = new PositionXY(circleX, circleY);
        return circleCenterPosition;
    }

    /**
     * 円形オブジェクトを消します。
     * @param x 左端座標
     * @param y 上端座標
     * @param context 描画先のコンテキストを指定します。
     * @since 0.1
     */
    private clearGoishi(x: number, y: number, context: CanvasRenderingContext2D) {
        context.clearRect(x, y, this.roWidthX, this.roHeight);
        // 透明度

        console.log("color", "clear");
    }

    /**
     * 円形オブジェクトを描画します。
     * @param x 左端座標
     * @param y 上端座標
     * @param r 半径
     * @param shadow 影の長さ（高さ/2）
     * @param context 描画先のコンテキストを指定します。
     * @since 0.1
     */
    private drawCircle(x: number, y: number, r: number, context: CanvasRenderingContext2D, fillStyle: string) {
        context.beginPath();
        context.arc(x + r, y + r, r, 0, 2 * Math.PI);
        context.fillStyle = fillStyle;
        // 透明度
        context.globalAlpha = this.goSetting.goishiGlobalAlpha;
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
    }

}