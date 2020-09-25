import { GoBoadInfo, GoBoadSetting } from "./GoSetting.js";
import { Logger } from "./GoLogger";
enum GoishiType {
    BLACK = "B",
    WHITE = "W",
    OKI = "O",
    NONE = "N"
}
class KifuPart {
    readonly color: GoishiType;
    readonly position: PositionOnGoBoad;
    readonly isPassed: boolean;
    constructor(color: GoishiType, roX: number, roY: number, isPassed: boolean) {
        this.color = color;
        this.position = new PositionOnGoBoad(roX, roY);
        this.isPassed = isPassed;
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

    readonly realtimePosition: GoishiType[][];

    /**
     * このクラスが扱うカンバスのコンテキスト
     * 
     */
    readonly context!: CanvasRenderingContext2D;

    /**
     * このクラスが扱うカンバスの横幅(縦幅)
     */

    private canvas!: HTMLCanvasElement;

    private _turn: GoishiType;

    public get turn(): GoishiType {
        return this._turn;
    }

    private now: number = -1;

    readonly logger: Logger;

    readonly goBoadInfo: GoBoadInfo;

    // 一路の横
    readonly roWidth;
    // 一路の縦
    readonly roHeight;

    // 路数
    readonly roCount: number;
    /**
     * このクラスが扱うコンテキストと幅(縦も同義)を注入する
     * @param canvas 
     * @param goSetting
     * @param roCount 
     * @param logger
     */
    public constructor(canvas: HTMLCanvasElement, goSetting: GoBoadSetting, roCount: number, logger: Logger) {

        this.roWidth = goSetting.roHW;
        this.roHeight = goSetting.roHW;
        this._turn = GoishiType.BLACK;
        this.logger = logger;

        this.roCount = roCount;

        this.goBoadInfo = new GoBoadInfo(goSetting.roHW, goSetting.roHW, goSetting.gobanLeft, goSetting.gobanTop, roCount);

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
                this.realtimePosition[i][j] = GoishiType.NONE;  // （3）
            }
        }

        //クラスを通して変わらないカンバス設定
        this.context.font = "bold 15px '游ゴシック'";
        this.context.textAlign = 'center';
        this.context.shadowBlur = 2;
        this.initCanvas(this.canvas, this.goBoadInfo);
    }



    public viewFromKifu(kifuString: string) {

        const kifuList = KifuUtil.convertKifuListFromString(kifuString);

        const positions: GoishiType[][] = new Array();
        for (var i = 0; i < this.roCount; i++) {
            positions[i] = new Array();
            for (var j = 0; j < this.roCount; j++) {
                positions[i][j] = GoishiType.NONE;
            }
        }
        for (let index = 0; index < kifuList.length; index++) {
            const element = this.kifu[index];
            const x = element.position.roX;
            const y = element.position.roY;
            positions[x][y] = element.color;
        }
        this.viewFromPosition(positions);

    }


    /**
     * 棋譜の内容をそのまま表示する。
     */
    public viewFromPosition(realtimePosition: GoishiType[][]) {

        this.clearAll();
        for (let x = 0; x < realtimePosition.length; x++) {
            const col = realtimePosition[x];
            for (let y = 0; y < col.length; y++) {
                const color = realtimePosition[x][y];
                const kifuPart = new KifuPart(color, x, y, false);
                if (kifuPart.color == GoishiType.NONE) {
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
    private calcPositionOnGoban(x: number, y: number): PositionOnGoBoad {
        const top = this.goBoadInfo.top;
        const left = this.goBoadInfo.left;
        console.log(`boad:${top}:${left}`)

        const x0 = x - left;
        // 1区画の半分先までは、手前の路数として判断する
        const xRo = Math.floor((x0 + (this.roWidth / 2)) / this.roWidth) - 1;

        const y0 = y - top;
        // 1区画の半分先までは、手前の路数として判断する
        const yRo = Math.floor((y0 + (this.roHeight / 2)) / this.roHeight) - 1;

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
     * 
     * @param mouseX 候補手を打つ
     * @param mouseY 
     * @param word 
     */
    public addCandidate(mouseX: number, mouseY: number, word: string) {

        const positionOnGoban = this.calcPositionOnGoban(mouseX, mouseY)

        const keisen = 1;
        // 碁石の中心位置を計算する。
        const circleCenterPosition = this.calcCircleCenterPosition(keisen, positionOnGoban);

        if (this.realtimePosition[positionOnGoban.roX][positionOnGoban.roY] != GoishiType.NONE) {
            console.log("既に候補がある。")
            this.clearGoishi(circleCenterPosition.x - (this.roWidth / 2), circleCenterPosition.y - (this.roHeight / 2), this.context);
            this.realtimePosition[positionOnGoban.roX][positionOnGoban.roY] = GoishiType.NONE;
            return;
        }

        const radius = this.goBoadInfo.roHeight * 0.475; // 半径

        // var tmp = this.drawGoishi(GoishiType.BLACK, circleCenterPosition, positionOnGoban);
        this.drawCircle(circleCenterPosition.x, circleCenterPosition.y, radius, 0.7, this.context, "green");
        this.drawWord(circleCenterPosition.x, circleCenterPosition.y, word, this.context, radius);
    }


    public addOkiIshi(mouseX: number, mouseY: number) {
        console.info("click=" + mouseX + ":" + mouseY);

        const positionOnGoban = this.calcPositionOnGoban(mouseX, mouseY)

        const keisen = 1;
        // 碁石の中心位置を計算する。
        const circleCenterPosition = this.calcCircleCenterPosition(keisen, positionOnGoban);

        // console.info("circle=" + circleCenterPosition.x + ":" + circleCenterPosition.y);

        if (this.realtimePosition[positionOnGoban.roX][positionOnGoban.roY] != GoishiType.NONE) {
            console.log("既に石がある。")
            // this.clearGoishi(circleCenterPosition.x - (this.roWidth / 2), circleCenterPosition.y - (this.roHeight / 2), this.context);
            // this.realtimePosition[positionOnGoban.roX][positionOnGoban.roY] = GoishiType.NONE;
            return;
        }


        var tmp = this.drawGoishi(GoishiType.BLACK, circleCenterPosition, positionOnGoban);

        // 次を白番にする
        this._turn = GoishiType.WHITE;

        this.logger.log(tmp);


    }
    /**
     * 待った
     */
    public chakushBack() {
        // const now = this.kifu.length - 1;
        const targetNo = this.now;
        const targetChakushu = this.kifu[targetNo];
        // 消す対象を次の手番として設定する。
        this._turn = targetChakushu.color;
        this.now = targetNo - 1;
        this.clearGoishiByRo(targetChakushu.position);
    }
    private clearGoishiByRo(positionOnGoban: PositionOnGoBoad) {
        const keisen = 1;
        // 碁石の中心位置を計算する。
        const circleCenterPosition = this.calcCircleCenterPosition(keisen, positionOnGoban);
        this.clearGoishi(circleCenterPosition.x - (this.roWidth / 2), circleCenterPosition.y - (this.roHeight / 2), this.context);

    }

    private addGoishi(kifuPart: KifuPart) {

        const keisen = 1;
        // 碁石の中心位置を計算する。
        const circleCenterPosition = this.calcCircleCenterPosition(keisen, kifuPart.position);
        var kifu = this.drawGoishi(kifuPart.color, circleCenterPosition, kifuPart.position);
        this.logger.log(kifu);

    }

    /**
     * 着手動作
     * @param mouseX 
     * @param mouseY 
     */
    public chakushu(mouseX: number, mouseY: number) {

        console.info("click position=" + mouseX + ":" + mouseY);

        const nowTurn = this._turn;

        const positionOnGoBoad = this.calcPositionOnGoban(mouseX, mouseY)

        const keisen = 1;
        // 碁石の中心位置を計算する。
        const circleCenterPosition = this.calcCircleCenterPosition(keisen, positionOnGoBoad);

        // console.info("circle=" + circleCenterPosition.x + ":" + circleCenterPosition.y);
        // console.info("positionOnGoBoad=" + positionOnGoBoad.roX + ":" + positionOnGoBoad.roY);

        if (this.realtimePosition[positionOnGoBoad.roX][positionOnGoBoad.roY] != GoishiType.NONE) {
            console.log("既に石がある。")
            this.clearGoishi(circleCenterPosition.x - (this.roWidth / 2), circleCenterPosition.y - (this.roHeight / 2), this.context);
            this.realtimePosition[positionOnGoBoad.roX][positionOnGoBoad.roY] = GoishiType.NONE;
            return;
        }


        var tmp = this.drawGoishi(nowTurn, circleCenterPosition, positionOnGoBoad);

        // ターンを入れ替える
        this._turn = (nowTurn == GoishiType.BLACK) ? GoishiType.WHITE : GoishiType.BLACK;
        this.now += 1;

        this.logger.log(tmp);

        // auClick.play();
        // turn = 3 - turn;
    }
    private drawGoishi(nowTurn: GoishiType, circleCenterPosition: PositionXY, positionOnGoban: PositionOnGoBoad) {
        const fillstyle = (nowTurn == GoishiType.BLACK) ? "black" : "white";
        const radius = this.goBoadInfo.roHeight * 0.475; // 半径
        this.drawFillCircle(circleCenterPosition.x, circleCenterPosition.y, radius, this.context, fillstyle);


        // 棋譜の設定
        this.kifu.push(new KifuPart(nowTurn, positionOnGoban.roX, positionOnGoban.roY, false));

        // 配置の設定
        this.realtimePosition[positionOnGoban.roX][positionOnGoban.roY] = nowTurn;

        var tmp = "";
        this.kifu.forEach(kifu => {
            tmp += kifu.color + "(" + kifu.position.roX + ":" + kifu.position.roY + ")";
        });
        return tmp;
    }

    private drawWord(x: number, y: number, word: string, context: CanvasRenderingContext2D, maxwidth: number) {

        context.beginPath();
        context.fillStyle = "white";
        context.font = "20px 'ＭＳ ゴシック'";
        context.fillText(word, x - 5, y + 7, maxwidth);
        context.closePath;
        context.stroke();

    }

    private calcCircleCenterPosition(keisen: number, positionOnGoban: PositionOnGoBoad) {
        const circleX = this.goBoadInfo.areaLeft + keisen + (this.roWidth) * (positionOnGoban.roX);
        // 端の線は2px(格子ごとの線+1pxなので、足りない1pxだけ足す)
        const circleY = this.goBoadInfo.areaTop + keisen + (this.roHeight) * (positionOnGoban.roY);
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

    static convertKifuListFromString(value: string): KifuPart[] {
        // TODO:実装する
        return new Array();
    }
}