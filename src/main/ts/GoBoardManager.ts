import { GoBoadSetting, GoBoadInfo } from "./GoSetting";


export class GoBoadManager {

    /**
     * このクラスが扱うカンバスのコンテキスト
     * 
     */
    readonly context!: CanvasRenderingContext2D;

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
        // テストができない
        /* istanbul ignore next */
        if (!canvas.getContext) {
            console.log('カンバスが使用できません');
            return;
        }


        //カンバス・コンテキスト・大きさを注入する
        this.canvas = canvas;
        this.context = canvas.getContext('2d')!;

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

        // 碁盤の影
        this.drowShadow(context, goBoadInfo.left, goBoadInfo.top, goBoadInfo.width, shadow, goBoadInfo.height);
        // 碁盤
        this.drowGoban(context, goBoadInfo.left, goBoadInfo.top, goBoadInfo.width, goBoadInfo.height);
        // 木目
        // drawWood(x, y, width, height, context);
        // 格子
        this.drowKoushi(context, goBoadInfo, goBoadInfo.roWidth, goBoadInfo.roHeight);

        // 目盛りを設定
        this.drawScaleXY(context, goBoadInfo, this.scaleFontSize);

    }

    private drowKoushi(context: CanvasRenderingContext2D, goBoadInfo: GoBoadInfo, cellHeight: number, cellWidth: number) {

        // 路の幅には線の太さ1本分が含まれる。

        // 線の色
        context.fillStyle = "black";

        // 路の数
        const ro = goBoadInfo.roCount;

        // 格子の外側(太線の1ピクセルまで含む)
        const outOfAreaLength = goBoadInfo.areaLeft - goBoadInfo.left;

        // 罫線の太さ(端以外)
        const lineWidth = goBoadInfo.keisenWidth;
        // 横の格子線
        const koushiLeft = goBoadInfo.areaLeft;
        const verticalStartY = goBoadInfo.areaTop;
        const verticalLength = goBoadInfo.areaHeight;

        context.beginPath();
        // 基本の縦線
        for (var col = 0; col < ro; col++) {
            // 外枠の太い部分の半分から計算を始める。
            const startX1 = koushiLeft + lineWidth + (col * cellWidth);
            context.rect(startX1, verticalStartY, lineWidth, verticalLength);
        }

        // 外枠の太線を追加する
        // 左端
        context.rect(koushiLeft, verticalStartY, lineWidth, verticalLength);
        // 右端
        context.rect(goBoadInfo.left + (goBoadInfo.width - outOfAreaLength), verticalStartY, lineWidth, verticalLength);
        context.fill();


        const koushiTop = goBoadInfo.areaTop;
        const horizontalStartX = goBoadInfo.areaLeft;
        const horizontalLength = goBoadInfo.areaWidth;
        context.beginPath();
        // 基本の横線
        for (var row = 0; row < ro; row++) {
            // 外枠の太い部分の半分から計算を始める。
            const y1 = koushiTop + lineWidth + (row * cellHeight);
            context.rect(horizontalStartX, y1, horizontalLength, lineWidth);
        }

        // 外枠の太線を追加する
        // 上端
        context.rect(horizontalStartX, koushiTop, horizontalLength, lineWidth);
        // 下端
        context.rect(horizontalStartX, goBoadInfo.top + (goBoadInfo.height - outOfAreaLength), horizontalLength, lineWidth);
        context.fill();


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

    private drawScaleXY(context: CanvasRenderingContext2D, goBoadInfo: GoBoadInfo, fontSize: number) {

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
            CanvasCotroller.drawText(context, KifuUtil.toAlphabet(col + 1).toString(), goBoadInfo.left + (fontSize * 0.8), y);
        }
        // horizontal
        for (var col = 0; col <= ro - 1; col++) {
            const x = koushiLeft + (perX * col);
            CanvasCotroller.drawText(context, Number(col + 1).toString(), x, goBoadInfo.top + (fontSize));
        }
    }


}
export class KifuUtil {
    static toAlphabet(index: number): string {
        const alphabet = "abcdefghijklmnopqrstuvwxyz";
        if (index >= 1 && index <= 26) {
            return alphabet.charAt(index - 1);
        } else {
            return "";
        }
    }

}

export class CanvasCotroller {
    public static drawText(context: CanvasRenderingContext2D, text: string, baseX: number, baseY: number) {
        //座標を指定して文字を描く（座標は画像の中心に）
        context.fillText(text, baseX, baseY);
    }
}