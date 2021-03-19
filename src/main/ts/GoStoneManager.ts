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
 * 碁石、棋譜を管理するクラス
 * 
 */
export class GoStoneManager {
    readonly kifu: KifuPart[];



    readonly realtimePosition: GoMoveType[][];

    /**
     * このクラスが扱うカンバスのコンテキスト
     * 
     */
    readonly _context!: CanvasRenderingContext2D;

    /**
     * このクラスが扱うカンバスの横幅(縦幅)
     */

    private canvas!: HTMLCanvasElement;

    // 次の手番(アゲハマ作業などは無視)
    private _nextTurn: GoMoveType;

    public get nextTurn(): GoMoveType {
        return this._nextTurn;
    }


    // private _agehamaB: number = 0;
    // private _agehamaW: number = 0;


    // アゲハマ
    public get agehamaW(): number {

        const list = this.kifu.filter(x => (x.color == GoMoveType.AGEHAMA_W));
        return list.length;
    }

    public get agehamaB(): number {
        const list = this.kifu.filter(x => (x.color == GoMoveType.AGEHAMA_B));
        return list.length;
    }


    /**
     * Gets now count
     * 今の棋譜の位置
     */
    public get nowCount(): number {
        return this._nowCount;
    }


    private _nowCount: number = -1;

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
        this._nextTurn = GoMoveType.BLACK;

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
        this._context = canvas.getContext("2d")!;

        // 現在地の初期化
        this.realtimePosition = new Array();
        for (var i = 0; i < roCount; i++) {
            this.realtimePosition[i] = new Array();  // （2）
            for (var j = 0; j < roCount; j++) {
                this.realtimePosition[i][j] = GoMoveType.NONE;  // （3）
            }
        }

        //クラスを通して変わらないカンバス設定
        this._context.font = "bold 15px '游ゴシック'";
        this._context.textAlign = 'center';
        this._context.shadowBlur = 2;
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
                    this.addStoneFromKifu(kifuPart);
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
        this._context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * syncLoop
     * interval :number     
     */
    public startSyncLoop(interval: number, statusManager: GoPlayStatsuManager) {

        statusManager.syncLoop(interval, this);
    }
    public endSyncLoop(statusManager: GoPlayStatsuManager) {
        statusManager.isLoop = false;
    }
    /**
     * 指定した座標に石を描画する。
     * 棋譜操作なし
     * @param mouseX 
     * @param mouseY 
     * @param color 
     */
    private drawGoIshiByPosition(position: PointerPosition, color: GoishiColor): PositionOnGoBoad {
        const positionOnGoban = this.calcPositionOnGoban(position, this._goBoadInfo)
        const circleCenterPosition = this.calcCircleCenterPosition(this._goBoadInfo, positionOnGoban);
        const fillstyle: string = color;
        const radius = this._goBoadInfo.roHeight * 0.475; // 半径
        this.drawFillCircle(circleCenterPosition.x, circleCenterPosition.y, radius, this._context, fillstyle);

        return positionOnGoban;
    }

    /**
     * 重複チェック
     * @param mouseX 
     * @param mouseY 
     * @param goBoadInfo 
     * @returns true:重複している
     * 
     */
    private isDuplicatePosition(mouseX: number, mouseY: number, goBoadInfo: GoBoadInfo) {
        const positionOnGoban = this.calcPositionOnGoban(new PointerPosition(mouseX, mouseY), goBoadInfo);

        if (this.realtimePosition[positionOnGoban.roX][positionOnGoban.roY] != GoMoveType.NONE) {
            console.log("既に石がある。=>" + positionOnGoban.roX + ":" + positionOnGoban.roY)
            return true;
        }
        return false;
    }
    /**
     * 置き石を配置
     */
    public addHandicapStone(mouseX: number, mouseY: number) {
        console.info("click=" + mouseX + ":" + mouseY);

        if (this.isDuplicatePosition(mouseX, mouseY, this._goBoadInfo)) {
            return;
        }

        const positionOnBoad = this.drawGoIshiByPosition(new PointerPosition(mouseX, mouseY), GoishiColor.BLACK);

        // 棋譜の設定
        this.kifu.push(new KifuPart(GoMoveType.BLACK, positionOnBoad.roX, positionOnBoad.roY, false));

        // 次を白番にする
        this._nextTurn = GoMoveType.WHITE;
        this._nowCount += 1;

    }

    get kifuString() {
        return KifuController.convertToString(this.kifu);
    }
    /**
     * 待った
     */
    public matta() {


        console.log("before:kifu:" + this.kifuString);

        const targetNo = this._nowCount;

        // 待ったの対象となっている着手
        const targetChakushu = this.kifu[targetNo];

        const beforeNextTurn = this._nextTurn;

        var move;
        var afterNextTurn;
        // アゲハマの時だけ取った石を戻す必要がある
        if (targetChakushu.color == GoMoveType.AGEHAMA_B) {
            move = GoMoveType.BLACK;
            const position = targetChakushu.position;
            const kifu = new KifuPart(move, position.roX, position.roY);
            afterNextTurn = beforeNextTurn;
            this.drawStoneFromKifu(kifu);
        } else if (targetChakushu.color == GoMoveType.AGEHAMA_W) {
            move = GoMoveType.WHITE;
            const position = targetChakushu.position;
            const kifu = new KifuPart(move, position.roX, position.roY);

            // 次の着手は変えない
            afterNextTurn = beforeNextTurn;

            this.drawStoneFromKifu(kifu);

        } else {
            // アゲハマターンでなければ、次の着手を前着手の色に戻す。
            afterNextTurn = targetChakushu.color;
            // クリアする
            move = GoMoveType.NONE;
            this.clearStoneByRo(targetChakushu.position);
        }

        // 消す対象を次の手番として設定する。(1ターン戻す)
        this.kifu.pop();
        // 現在ターンを戻す
        this._nowCount = targetNo - 1;
        // 配置を登録
        this.realtimePosition[targetChakushu.position.roX][targetChakushu.position.roY] = move;

        this._nextTurn = afterNextTurn;

        console.log("after:kifu:" + this.kifuString);
        console.log("取り消し=>" + targetChakushu.position.roX + ":" + targetChakushu.position.roY);
    }
    /**
     * 碁石を消す
     * ※棋譜関連なし
     * @param positionOnGoban 路上の位置
     */
    private clearStoneByRo(positionOnGoban: PositionOnGoBoad) {
        // 碁石の中心位置を計算する。
        const circleCenterPosition = this.calcCircleCenterPosition(this._goBoadInfo, positionOnGoban);
        this.clearGoishi(circleCenterPosition.x - (this.roWidth / 2), circleCenterPosition.y - (this.roHeight / 2));

    }

    private addStoneFromKifu(kifuPart: KifuPart) {

        // 碁石の中心位置を計算する。
        const circleCenterPosition = this.calcCircleCenterPosition(this._goBoadInfo, kifuPart.position);
        this.addStone(kifuPart.color, circleCenterPosition, kifuPart.position);

    }

    private drawStoneFromKifu(kifuPart: KifuPart) {
        // 碁石の中心位置を計算する。
        const circleCenterPosition = this.calcCircleCenterPosition(this._goBoadInfo, kifuPart.position);
        this.drawStoneSub(kifuPart.color, circleCenterPosition);
    }

    /**
     * アゲハマをとる
     * @param mouseX 
     * @param mouseY 
     * @returns None:石がなかった場合. None以外:とった石 
     */
    public getAgehama(mouseX: number, mouseY: number) {

        // 碁盤上の位置
        const positionOnGoban = this.calcPositionOnGoban(new PointerPosition(mouseX, mouseY), this._goBoadInfo);

        var resultMove = GoMoveType.NONE;

        // 指定した場所に石がある場合のみ実行
        if (this.isDuplicatePosition(mouseX, mouseY, this._goBoadInfo)) {
            this.clearStoneByRo(positionOnGoban);

            // とった石
            resultMove = this.realtimePosition[positionOnGoban.roX][positionOnGoban.roY];

            // データ的に消す
            this.realtimePosition[positionOnGoban.roX][positionOnGoban.roY] = GoMoveType.NONE;

            // アゲハマを設定
            if (resultMove == GoMoveType.BLACK) {
                this.kifu.push(new KifuPart(GoMoveType.AGEHAMA_B, positionOnGoban.roX, positionOnGoban.roY, false));
                // this._agehamaB++;
            }
            if (resultMove == GoMoveType.WHITE) {
                this.kifu.push(new KifuPart(GoMoveType.AGEHAMA_W, positionOnGoban.roX, positionOnGoban.roY, false));
                // this._agehamaW++;
            }
            this._nowCount += 1;
        }
        return resultMove;
    }
    /**
     * 着手動作
     * @param mouseX 
     * @param mouseY 
     */
    public chakushu(mouseX: number, mouseY: number) {

        console.debug("click position=" + mouseX + ":" + mouseY);

        const nowTurn = this._nextTurn;

        const positionOnGoBoad = this.calcPositionOnGoban(new PointerPosition(mouseX, mouseY), this._goBoadInfo);

        const keisen = 1;
        // 碁石の中心位置を計算する。
        const circleCenterPosition = this.calcCircleCenterPosition(this._goBoadInfo, positionOnGoBoad);

        if (this.realtimePosition[positionOnGoBoad.roX][positionOnGoBoad.roY] != GoMoveType.NONE) {
            console.log("既に石がある。=>" + positionOnGoBoad.roX + ":" + positionOnGoBoad.roY)
            return;
        }


        this.addStone(nowTurn, circleCenterPosition, positionOnGoBoad);

        // // 石の描画
        // this.drawStone(nowTurn, circleCenterPosition);

        // // 棋譜の設定
        // this.registerKifu(nowTurn, positionOnGoBoad);

        // ターンを入れ替える
        this._nextTurn = (nowTurn == GoMoveType.BLACK) ? GoMoveType.WHITE : GoMoveType.BLACK;
        this._nowCount += 1;


    }


    /**
     * 指定された色の碁石を追加する
     */
    private addStone(nowTurn: GoMoveType, circleCenterPosition: PointerPosition, positionOnStone: PositionOnGoBoad) {
        this.drawStoneSub(nowTurn, circleCenterPosition);

        // 配置の設定
        this.realtimePosition[positionOnStone.roX][positionOnStone.roY] = nowTurn;


        // 棋譜の設定
        this.registerKifu(nowTurn, positionOnStone);

    }


    /**
     * Registers kifu
     * @param nowTurn 
     * @param positionOnGoban 
     */
    private registerKifu(nowTurn: GoMoveType, positionOnGoban: PositionOnGoBoad) {
        this.kifu.push(new KifuPart(nowTurn, positionOnGoban.roX, positionOnGoban.roY, false));

    }

    /**
     * only drawing stone.
     * @param nowTurn 
     * @param circleCenterPosition 
     */
    private drawStoneSub(nowTurn: GoMoveType, circleCenterPosition: PointerPosition) {
        const fillstyle = (nowTurn == GoMoveType.BLACK) ? "black" : "white";
        const radius = this._goBoadInfo.roHeight * 0.475; // 半径
        this.drawFillCircle(circleCenterPosition.x, circleCenterPosition.y, radius, this._context, fillstyle);
    }

    /**
     * Calcs circle center position
     * @param goBoadInfo 
     * @param positionOnGoban 
     * @returns  
     */
    private calcCircleCenterPosition(goBoadInfo: GoBoadInfo, positionOnGoban: PositionOnGoBoad) {
        const circleX = goBoadInfo.areaLeft + goBoadInfo.keisenWidth + (this.roWidth) * (positionOnGoban.roX);
        // 端の線は2px(格子ごとの線+1pxなので、足りない1pxだけ足す)
        const circleY = goBoadInfo.areaTop + goBoadInfo.keisenWidth + (this.roHeight) * (positionOnGoban.roY);
        const circleCenterPosition = new PointerPosition(circleX, circleY);
        return circleCenterPosition;
    }

    /**
     * 円形オブジェクトを消します。
     * ※棋譜関連なし
     * @param x 左端座標
     * @param y 上端座標
     * @param context 描画先のコンテキストを指定します。
     * @since 0.1
     */
    private clearGoishi(x: number, y: number) {
        this._context.clearRect(x, y, this.roWidth, this.roHeight);
        // 透明度

        console.log("color", "clear");
    }

    public UpdateAllGoishi() {
        const list = this.realtimePosition;

        for (let x = 0; x < list.length; x++) {
            const element = list[x];
            for (let y = 0; y < list.length; y++) {
                const move: GoMoveType = element[y];
                const kifuP = new KifuPart(move, x, y);
                this.addStoneFromKifu(kifuP);
            }
        }

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

function getAgehamaColor(targetChakushu: KifuPart): GoMoveType {
    return targetChakushu.color;
}
function isHandicapMove(targetChakushu: KifuPart) {
    return targetChakushu.color == GoMoveType.OKI || targetChakushu.color == GoMoveType.OKI_WHITE;
}