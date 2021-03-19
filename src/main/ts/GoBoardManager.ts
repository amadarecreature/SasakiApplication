import { GoBoadSetting, GoBoadInfo } from "./GoSetting";


export class GoBoadManager {

    /**
     * このクラスが扱うカンバスのコンテキスト
     * 
     */
    readonly context!: CanvasRenderingContext2D;

    private canvas!: HTMLCanvasElement;

    /**
     * このクラスが扱うコンテキストと幅(縦も同義)を注入する
     * @param canvas 
     * @param goSetting
     * @param ro 
     */
    public constructor(canvas: HTMLCanvasElement, goSetting: GoBoadSetting, ro: number) {

        const goBoadInfo = new GoBoadInfo(goSetting.roHW, goSetting.roHW, goSetting.gobanLeft, goSetting.gobanTop, ro);

        //カンバスが使用できるかチェック
        if (!canvas.getContext) {
            console.log('カンバスが使用できません');
            return;
        }

        //カンバス・コンテキスト・大きさを注入する
        this.canvas = canvas;
        this.context = canvas.getContext('2d')!;

        //クラスを通して変わらないカンバス設定
        this.context.font = "bold 15px '游ゴシック'";
        this.context.textAlign = 'center';
        this.context.shadowBlur = 2;
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
        this.drowKoushi(context, goBoadInfo, goBoadInfo.areaLeft, goBoadInfo.roWidth, goBoadInfo.areaWidth, goBoadInfo.roHeight, goBoadInfo.areaHeight);

    }

    private drowKoushi(context: CanvasRenderingContext2D, goBoadInfo: GoBoadInfo, koushiLeft: number, cellHeight: number, gwidth: number, cellWidth: number, gheight: number) {
        context.fillStyle = "black";

        const koushiTop = goBoadInfo.areaTop;
        const ro = goBoadInfo.roCount;

        let lineWidth;
        // 罫線の太さ(端以外)
        const lineBaseWidth = goBoadInfo.keisenWidth;
        // 横の格子線
        let startX1;
        const startY2 = goBoadInfo.areaTop;

        for (var col = 1; col <= ro; col++) {
            if (col == 1) {
                startX1 = koushiLeft + (col - 1) * cellWidth;

            } else {
                startX1 = koushiLeft + lineBaseWidth + (col - 1) * cellWidth;
            }

            if (col == 1 || col == ro) {
                lineWidth = lineBaseWidth * 2;
            } else {
                lineWidth = lineBaseWidth;
            }
            context.beginPath();
            context.rect(startX1, startY2, lineWidth, gheight);
            context.fill();
        }

        // （横の格子線）
        let y1, lineWidth2;
        const x1 = goBoadInfo.areaLeft;
        for (var row = 1; row <= ro; row++) {
            if (row == 1)
                y1 = koushiTop + (row - 1) * cellHeight;
            else
                y1 = koushiTop + lineBaseWidth + (row - 1) * cellHeight;
            if (row == 1 || row == ro) {
                lineWidth2 = lineBaseWidth * 2;
            }
            else {
                lineWidth2 = lineBaseWidth;
            }
            context.beginPath();
            context.rect(x1, y1, gwidth, lineWidth2);
            context.fill();
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

}


