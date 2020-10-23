import { GoPlayStatsuManager } from "./GoPlayStatusManager";
import { GoBoadInfo, GoBoadSetting, KifuPart, GoMoveType } from "./GoSetting";
import { KifuController } from "./KifuController";

enum GoishiColor {
    BLACK = "black",
    WHITE = "white",
    NONE = "NONE"
}

class PointerPosition {
    readonly x: number;
    readonly y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class PositionOnGoBoad {
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
/**
 * 碁石を管理するクラス
 */
export class GoishiManager {
    readonly kifu: KifuPart[];

    readonly realtimePosition: GoMoveType[][];

    /**
     * このクラスが扱うカンバスのコンテキスト
     * 
     */
    readonly context!: CanvasRenderingContext2D;

    /**
     * このクラスが扱うカンバスの横幅(縦幅)
     */

    private canvas!: HTMLCanvasElement;

    private _turn: GoMoveType;

    public get turn(): GoMoveType {
        return this._turn;
    }

    private now: number = -1;

    readonly _goBoadInfo: GoBoadInfo;

    // 一路の横
    readonly roWidth;
    // 一路の縦
    readonly roHeight;

    // 路数
    readonly roCount: number;
    /**
     * このクラスが扱うコンテキストと幅(縦も同義)を注入する
     * @param canvas 
     * @param goBoadSetting
     * @param roCount 
     * @param logger
     */
    public constructor(canvas: HTMLCanvasElement, goBoadSetting: GoBoadSetting, roCount: number) {

        this.roWidth = goBoadSetting.roHW;
        this.roHeight = goBoadSetting.roHW;
        this._turn = GoMoveType.BLACK;

        this.roCount = roCount;

        this._goBoadInfo = new GoBoadInfo(goBoadSetting.roHW, goBoadSetting.roHW, goBoadSetting.gobanLeft, goBoadSetting.gobanTop, roCount);

        this.kifu = new Array();

        //カンバスが使用できるかチェック
        if (!canvas.getContext) {
            console.log('[Roulette.constructor] カンバスが使用できません');
            this.roCount = 0;
            this.realtimePosition = new Array();
            return;
        }

        //カンバス・コンテキスト・大きさを注入する
        this.canvas = canvas;
        this.context = canvas.getContext("2d")!;

        // 現在地の初期化
        this.realtimePosition = new Array();
        for (var i = 0; i < roCount; i++) {
            this.realtimePosition[i] = new Array();  // （2）
            for (var j = 0; j < roCount; j++) {
                this.realtimePosition[i][j] = GoMoveType.NONE;  // （3）
            }
        }

        //クラスを通して変わらないカンバス設定
        this.context.font = "bold 15px '游ゴシック'";
        this.context.textAlign = 'center';
        this.context.shadowBlur = 2;
        this.initCanvas(this.canvas, this._goBoadInfo);
    }



    public roadFromKifu(kifuString: string) {

        const kifuList = KifuController.convertFromString(kifuString);
        console.log(kifuString);


        // ポジションの初期化
        const positions: GoMoveType[][] = new Array();
        for (var i = 0; i < this.roCount; i++) {
            positions[i] = new Array();
            for (var j = 0; j < this.roCount; j++) {
                positions[i][j] = GoMoveType.NONE;
            }
        }
        for (let index = 0; index < kifuList.length; index++) {

            const element = kifuList[index];
            const x = element.position.roX - 1;
            const y = element.position.roY - 1;
            console.log("xxxxxxxx:" + element.color + ":" + x + ":" + y);
            positions[x][y] = element.color;
        }
        console.log("*****************:" + positions);
        this.viewFromPosition(positions);

    }


    /**
     * 棋譜の内容をそのまま表示する。
     */
    public viewFromPosition(realtimePosition: GoMoveType[][]) {

        this.clearAll();
        for (let x = 0; x < realtimePosition.length; x++) {
            const col = realtimePosition[x];
            for (let y = 0; y < col.length; y++) {
                const color = realtimePosition[x][y];
                const kifuPart = new KifuPart(color, x, y, false);
                if (kifuPart.color == GoMoveType.NONE) {
                    // 何もしない
                } else {
                    this.addGoishi(kifuPart);
                }
            }
        }

    }

    /**
     * 碁盤上での位置左上から数えた路数
     * @param x 
     * @param y 
     */
    private calcPositionOnGoban(position: PointerPosition, goBoadInfo: GoBoadInfo): PositionOnGoBoad {
        const top = goBoadInfo.top;
        const left = goBoadInfo.left;
        console.log(`boad:${top}:${left}`)

        const x0 = position.x - left;
        // 1区画の半分先までは、手前の路数として判断する
        const xRo = Math.floor((x0 + (goBoadInfo.roHeight / 2)) / goBoadInfo.roWidth) - 1;

        const y0 = position.y - top;
        // 1区画の半分先までは、手前の路数として判断する
        const yRo = Math.floor((y0 + (goBoadInfo.roHeight / 2)) / goBoadInfo.roHeight) - 1;

        // console.info("ro=" + xRo + ":" + yRo);


        return new PositionOnGoBoad(xRo, yRo);
    }

    /**
     * 碁盤を描画します。
     * @param shadow 影の長さ（高さ/2）
     * @param context 描画先のコンテキストを指定します。
     * @since 0.1
     */
    private initCanvas(canvas: HTMLCanvasElement, goBoadInfo: GoBoadInfo) {

        // サイズ変更(サイズ変更すると描画内容が消えるので先に変更)
        canvas.width = goBoadInfo.width + 20;
        canvas.height = goBoadInfo.height + 20;

        // console.log("initCanvas:", canvas.width, canvas.height);
    }
    public clearAll() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * syncLoop
interval :number     */
    public startSyncLoop(interval: number, statusManager: GoPlayStatsuManager) {
        
        statusManager.syncLoop(interval, this);
    }
    public endSyncLoop(statusManager: GoPlayStatsuManager) {
        statusManager.isLoop = false;
    }
    /**
     * 指定した座標に石を描画する。
     * @param mouseX 
     * @param mouseY 
     * @param color 
     */
    private drawGoIshiByPosition(position: PointerPosition, color: GoishiColor): PositionOnGoBoad {
        const positionOnGoban = this.calcPositionOnGoban(position, this._goBoadInfo)
        const circleCenterPosition = this.calcCircleCenterPosition(this._goBoadInfo, positionOnGoban);
        const fillstyle: string = color;
        const radius = this._goBoadInfo.roHeight * 0.475; // 半径
        this.drawFillCircle(circleCenterPosition.x, circleCenterPosition.y, radius, this.context, fillstyle);

        return positionOnGoban;
    }

    private isDuplicatePosition(mouseX: number, mouseY: number, goBoadInfo: GoBoadInfo) {
        const positionOnGoban = this.calcPositionOnGoban(new PointerPosition(mouseX, mouseY), goBoadInfo)

        if (this.realtimePosition[positionOnGoban.roX][positionOnGoban.roY] != GoMoveType.NONE) {
            console.log("既に石がある。")
            return true;
        }
        return false;

    }
    public addHandicapStone(mouseX: number, mouseY: number) {
        console.info("click=" + mouseX + ":" + mouseY);

        if (this.isDuplicatePosition(mouseX, mouseY, this._goBoadInfo)) {
            return;
        }

        const positionOnBoad = this.drawGoIshiByPosition(new PointerPosition(mouseX, mouseY), GoishiColor.BLACK);

        // 棋譜の設定
        this.kifu.push(new KifuPart(GoMoveType.BLACK, positionOnBoad.roX, positionOnBoad.roY, false));

        // 次を白番にする
        this._turn = GoMoveType.WHITE;
        this.now += 1;

    }

    get kifuString() {
        return KifuController.convertToString(this.kifu);
    }
    /**
     * 待った
     */
    public chakushBack() {
        const targetNo = this.now;
        const targetChakushu = this.kifu[targetNo];
        this.kifu.pop();
        // 消す対象を次の手番として設定する。
        this._turn = targetChakushu.color;
        this.now = targetNo - 1;
        this.clearGoishiByRo(targetChakushu.position);

    }
    private clearGoishiByRo(positionOnGoban: PositionOnGoBoad) {
        // 碁石の中心位置を計算する。
        const circleCenterPosition = this.calcCircleCenterPosition(this._goBoadInfo, positionOnGoban);
        this.clearGoishi(circleCenterPosition.x - (this.roWidth / 2), circleCenterPosition.y - (this.roHeight / 2), this.context);

    }

    private addGoishi(kifuPart: KifuPart) {

        // 碁石の中心位置を計算する。
        const circleCenterPosition = this.calcCircleCenterPosition(this._goBoadInfo, kifuPart.position);
        this.drawGoishi(kifuPart.color, circleCenterPosition, kifuPart.position);

    }

    /**
     * 着手動作
     * @param mouseX 
     * @param mouseY 
     */
    public chakushu(mouseX: number, mouseY: number) {

        console.info("click position=" + mouseX + ":" + mouseY);

        const nowTurn = this._turn;

        const positionOnGoBoad = this.calcPositionOnGoban(new PointerPosition(mouseX, mouseY), this._goBoadInfo);

        const keisen = 1;
        // 碁石の中心位置を計算する。
        const circleCenterPosition = this.calcCircleCenterPosition(this._goBoadInfo, positionOnGoBoad);

        // console.info("circle=" + circleCenterPosition.x + ":" + circleCenterPosition.y);
        // console.info("positionOnGoBoad=" + positionOnGoBoad.roX + ":" + positionOnGoBoad.roY);

        if (this.realtimePosition[positionOnGoBoad.roX][positionOnGoBoad.roY] != GoMoveType.NONE) {
            console.log("既に石がある。")
            this.clearGoishi(circleCenterPosition.x - (this.roWidth / 2), circleCenterPosition.y - (this.roHeight / 2), this.context);
            this.realtimePosition[positionOnGoBoad.roX][positionOnGoBoad.roY] = GoMoveType.NONE;
            return;
        }

        var tmp = this.drawGoishi(nowTurn, circleCenterPosition, positionOnGoBoad);

        // ターンを入れ替える
        this._turn = (nowTurn == GoMoveType.BLACK) ? GoMoveType.WHITE : GoMoveType.BLACK;
        this.now += 1;


        // auClick.play();
        // turn = 3 - turn;
    }
    private drawGoishi(nowTurn: GoMoveType, circleCenterPosition: PointerPosition, positionOnGoban: PositionOnGoBoad) {
        const fillstyle = (nowTurn == GoMoveType.BLACK) ? "black" : "white";
        const radius = this._goBoadInfo.roHeight * 0.475; // 半径
        this.drawFillCircle(circleCenterPosition.x, circleCenterPosition.y, radius, this.context, fillstyle);


        // 棋譜の設定
        this.kifu.push(new KifuPart(nowTurn, positionOnGoban.roX, positionOnGoban.roY, false));

        // 配置の設定
        this.realtimePosition[positionOnGoban.roX][positionOnGoban.roY] = nowTurn;

    }


    private calcCircleCenterPosition(goBoadInfo: GoBoadInfo, positionOnGoban: PositionOnGoBoad) {
        const circleX = goBoadInfo.areaLeft + goBoadInfo.keisenWidth + (this.roWidth) * (positionOnGoban.roX);
        // 端の線は2px(格子ごとの線+1pxなので、足りない1pxだけ足す)
        const circleY = goBoadInfo.areaTop + goBoadInfo.keisenWidth + (this.roHeight) * (positionOnGoban.roY);
        const circleCenterPosition = new PointerPosition(circleX, circleY);
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
        context.clearRect(x, y, this.roWidth, this.roHeight);
        // 透明度

        console.log("color", "clear");
    }


    /**
     * 円形オブジェクトを描画します。
     * @param x 左端座標
     * @param y 上端座標
     * @param r 半径
     * @param context 描画先のコンテキストを指定します。
     * @since 0.1
     */
    private drawFillCircle(x: number, y: number, r: number, context: CanvasRenderingContext2D, fillStyle: string) {
        context.beginPath();
        // context.arc(x + r, y + r, r, 0, 2 * Math.PI);
        context.arc(x, y, r, 0, 2 * Math.PI);
        context.fillStyle = fillStyle;
        // 透明度
        context.globalAlpha = 1;
        context.fill();

        // テカリ
        context.beginPath();
        context.arc(x, y, r * 0.8, 0, -0.25 * Math.PI, true);
        context.closePath;
        context.strokeStyle = (fillStyle == "black") ? "white" : "black";
        context.lineCap = "round";
        context.lineWidth = 0.5;
        context.stroke();


        console.log("color", fillStyle);
    }
    private drawCircle(x: number, y: number, r: number, globalAlpha: number, context: CanvasRenderingContext2D, fillStyle: string) {
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

    }
}
class KifuUtil {

    static convertFromString(value: string): KifuPart[] {
        // TODO:実装する
        return new Array();
    }
    /**
     * TODO 実装する
     * @param kifuList 
     */
    static convertToString(kifuList: KifuPart[]): string {
        return "";
    }

}
class GoishiUtil {
    static convertColor(chakushu: GoMoveType): GoishiColor {
        if (chakushu == GoMoveType.BLACK) {
            return GoishiColor.BLACK;
        }
        if (chakushu == GoMoveType.WHITE) {
            return GoishiColor.WHITE;
        }
        if (chakushu == GoMoveType.OKI) {
            return GoishiColor.BLACK;
        }
        return GoishiColor.NONE;

    }
}