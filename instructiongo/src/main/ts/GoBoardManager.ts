import { GoBoadSetting, GoBoadInfo, PointerPosition, PositionOnGoBoad } from "./GoSetting";
import { GoBoardCanvasUtil, KifuUtil, CommonCanvasUtil } from "./GoUtils"

export class GoBoadManager {

    /**
     * このクラスが扱うカンバスのコンテキスト
     * 
     */
    private canvas!: HTMLCanvasElement;

    private scaleFontSize: number = 0;

    /**
     * このクラスが扱うコンテキストと幅(縦も同義)を注入する
     * @param canvas 
     * @param goSetting
     * @param ro 
     */
    public constructor(canvas: HTMLCanvasElement, goSetting: GoBoadSetting, ro: number) {

        const goBoadInfo = new GoBoadInfo(goSetting.roHW, goSetting.roHW, goSetting.gobanLeft, goSetting.gobanTop, ro);

        //カンバスが使用できるかチェック
        /* istanbul ignore next */
        if (!canvas.getContext) {
            console.log('カンバスが使用できません');
            return;
        }

        //カンバス・コンテキスト・大きさを注入する
        this.canvas = canvas;

        this.scaleFontSize = 15;

        this.drawBoard(5, this.canvas, goBoadInfo);

    }

    /**
     * 碁盤を描画します。
     * @param shadow 影の長さ（高さ/2）
     * @param context 描画先のコンテキストを指定します。
     * @since 0.1
     */
    private drawBoard(shadow: number, canvas: HTMLCanvasElement, goBoadInfo: GoBoadInfo) {

        const context: CanvasRenderingContext2D = canvas.getContext("2d")!;

        // canvasのサイズ変更(サイズ変更すると描画内容が消えるので先に変更)
        canvas.width = goBoadInfo.width + 20;
        canvas.height = goBoadInfo.height + 20;

        const left = goBoadInfo.left;
        const top = goBoadInfo.top;
        const width = goBoadInfo.width;
        const height = goBoadInfo.height;

        // 碁盤の影
        this.drawShadow(context, left, top, width, shadow, height);
        // 碁盤
        this.drawBoad(context, left, top, width, height);
        // 木目
        // drawWood(x, y, width, height, context);
        // 格子
        this.drowKoushi(context, goBoadInfo);

        // 目盛りを設定
        this.drawScaleXYLine(context, goBoadInfo, this.scaleFontSize);

    }

    private drowKoushi(context: CanvasRenderingContext2D, goBoadInfo: GoBoadInfo) {

        // 線の色
        const keisenColor = goBoadInfo.keisenColor;

        // 路の幅には線の太さ1本分が含まれる。
        // 罫線の太さ(端以外)
        const lineWidth = goBoadInfo.keisenWidth;

        // 格子
        // 横
        GoBoardCanvasUtil.drawKeisenH(context, goBoadInfo, lineWidth, keisenColor);
        GoBoardCanvasUtil.drawKeisenOutsideH(goBoadInfo, context);

        // 縦
        GoBoardCanvasUtil.drawKeisenV(context, keisenColor, goBoadInfo, lineWidth);
        GoBoardCanvasUtil.drawKeisenOutsideV(context, goBoadInfo, lineWidth);
        // 星の点
        // drawCircle
    }

    private drawBoad(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
        context.beginPath();
        context.rect(x, y, width, height);
        context.fillStyle = "burlywood";
        context.globalAlpha = 1.0;
        context.fill();
    }

    private drawShadow(context: CanvasRenderingContext2D, left: number, top: number, width: number, shadow: number, height: number) {

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

    private drawScaleXYLine(context: CanvasRenderingContext2D, goBoadInfo: GoBoadInfo, fontSize: number) {

        const font = "bold " + fontSize + "px " + "'游ゴシック'"
        context.font = font;
        context.textAlign = 'center';
        context.shadowBlur = 2;

        const koushiTop = goBoadInfo.areaTop;
        const koushiLeft = goBoadInfo.areaLeft;
        const ro = goBoadInfo.roCount;
        const perY = goBoadInfo.roHeight;
        const perX = goBoadInfo.roWidth;

        // vertical
        for (var col = 0; col <= ro - 1; col++) {
            const y = koushiTop + (perY * col);
            CommonCanvasUtil.drawText(context, KifuUtil.toAlphabet(col + 1).toString(), goBoadInfo.left + (fontSize * 0.8), y);
        }
        // horizontal
        for (var col = 0; col <= ro - 1; col++) {
            const x = koushiLeft + (perX * col);
            CommonCanvasUtil.drawText(context, Number(col + 1).toString(), x, goBoadInfo.top + (fontSize));
        }
    }


}
