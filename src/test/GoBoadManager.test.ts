import { GoBoadInfo, GoBoadSetting } from "../main/GoSetting";
import { GoBoadManager } from "../main/GoBoardMagnager";
import { JSDOM } from "jsdom";


describe('GoBoadManager', () => {
    it('初期配置', () => {
        const goSetting = new GoBoadSetting(10, 20, 1, 5);
        const goBoadInfo = new GoBoadInfo(goSetting.roHW, goSetting.roHW, goSetting.gobanLeft, goSetting.gobanTop, 19);

        // 結果
        const dummyJsdom = new JSDOM("<html><canvas id='cv1' style='width:20px,height:20px'></canvas></html>");
        const dummyCanvas: HTMLCanvasElement = <HTMLCanvasElement>dummyJsdom.window.document.getElementById('cv1');
        const dummyContext = dummyCanvas.getContext("2d")!;
        const dummy = new DummyGoBoadManager(dummyCanvas, goSetting, 19);
        const expected = dummyContext.getImageData(dummyCanvas.offsetLeft, dummyCanvas.offsetTop, dummyCanvas.width, dummyCanvas.height);

        // テスト
        const jsdom = new JSDOM("<html><canvas id='cv1' style='width:20px,height:20px'></canvas></html>");
        const canvas: HTMLCanvasElement = <HTMLCanvasElement>jsdom.window.document.getElementById('cv1');
        const context = canvas.getContext("2d")!;
        const gbm = new GoBoadManager(canvas, goSetting, 19);
        
        const actual = context.getImageData(dummyCanvas.offsetLeft, dummyCanvas.offsetTop, dummyCanvas.width, dummyCanvas.height);
        

        expect(actual).toEqual(expected);

    });
});

// ある時点のクラスを基にした結果比較用のダミー
class DummyGoBoadManager {

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
            console.log('[Roulette.constructor] カンバスが使用できません');
            // this.roCount = 0;
            return;
        }

        //カンバス・コンテキスト・大きさを注入する
        this.canvas = canvas;
        this.context = canvas.getContext('2d')!;

        //クラスを通して変わらないカンバス設定
        this.context.font = "bold 15px '游ゴシック'";
        this.context.textAlign = 'center';
        this.context.shadowBlur = 2;
        this.drawBoard(5, this.canvas, this.context, goBoadInfo);
    }

    /**
     * 碁盤を描画します。
     * @param shadow 影の長さ（高さ/2）
     * @param context 描画先のコンテキストを指定します。
     * @since 0.1
     */
    private drawBoard(shadow: number, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, goBoadInfo: GoBoadInfo) {

        // canvasのサイズ変更(サイズ変更すると描画内容が消えるので先に変更)
        canvas.width = goBoadInfo.width + 20;
        canvas.height = goBoadInfo.height + 20;

        console.log("canvas(inner):", canvas.width, canvas.height);

        // 碁盤の影
        this.drowShadow(this.context, goBoadInfo.left, goBoadInfo.top, goBoadInfo.width, shadow, goBoadInfo.height);
        // 碁盤
        this.drowGoban(this.context, goBoadInfo.left, goBoadInfo.top, goBoadInfo.width, goBoadInfo.height);
        // 木目
        // drawWood(x, y, width, height, context);
        // 格子
        this.drowKoushi(this.context, goBoadInfo, goBoadInfo.areaLeft, goBoadInfo.roWidth, goBoadInfo.areaWidth, goBoadInfo.roHeight, goBoadInfo.areaHeight);

    }

    public drowKoushi(context: CanvasRenderingContext2D, goBoadInfo: GoBoadInfo, gx: number, dy: number, gwidth: number, dx: number, gheight: number) {
        context.fillStyle = "black";

        let y1, lwidth;
        const lineBaseWidth = goBoadInfo.keisenWidth;
        // 横の格子線
        let x2;
        const y2 = goBoadInfo.areaTop;

        const gy = goBoadInfo.areaTop;
        const ro = goBoadInfo.roCount;
        for (var col = 1; col <= ro; col++) {
            if (col == 1)
                x2 = gx + (col - 1) * dx;

            else
                x2 = gx + 1 + (col - 1) * dx;
            if (col == 1 || col == ro) {
                lwidth = lineBaseWidth *2;

            } else {
                lwidth = lineBaseWidth;
            }
            context.beginPath();
            context.rect(x2, y2, lwidth, gheight);
            context.fill();
            // console.log("格子横:" + col, x2);
        }

        // （横の格子線）
        const x1 = goBoadInfo.areaLeft;
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
            // console.log("格子縦:" + row, y1);
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

