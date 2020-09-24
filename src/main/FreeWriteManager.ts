import { GoBoadInfo, GoBoadSetting } from "./GoSetting.js";

export class FreeWriteManager {
    /**
     * このクラスが扱うカンバスのコンテキスト
     * 
     */
    readonly context!: CanvasRenderingContext2D;

    /**
     * このクラスが扱うカンバスの横幅(縦幅)
     */

    private canvas!: HTMLCanvasElement;


    readonly goBoadInfo: GoBoadInfo;

    /**
     * このクラスが扱うコンテキストと幅(縦も同義)を注入する
     * @param canvas 
     * @param goSetting
     * @param roCount 
     * @param logger
     */
    public constructor(canvas: HTMLCanvasElement, goSetting: GoBoadSetting, roCount: number) {

        this.goBoadInfo = new GoBoadInfo(goSetting.roHW, goSetting.roHW, goSetting.gobanLeft, goSetting.gobanTop, roCount);
        //カンバスが使用できるかチェック
        if (!canvas.getContext) {
            console.log('[Roulette.constructor] カンバスが使用できません');
            return;
        }

        //カンバス・コンテキスト・大きさを注入する
        this.canvas = canvas;
        this.context = canvas.getContext("2d")!;

        //クラスを通して変わらないカンバス設定
        this.context.font = "bold 15px '游ゴシック'";
        this.context.textAlign = 'center';
        this.context.shadowBlur = 2;
        this.initCanvas(this.canvas, this.goBoadInfo);
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

        console.log("initCanvas:", canvas.width, canvas.height);
    }
    public clearAll() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    // 描画中かどうか
    private isDrawing: boolean = false;

    public start() {
        this.isDrawing = true;

    }
    public stop() {
        this.isDrawing = false;
    }
    public draw(mouseX: number, mouseY: number) {

        if (this.isDrawing) {
            // console.info("position=" + mouseX + ":" + mouseY);
            const top = this.goBoadInfo.top;
            const left = this.goBoadInfo.left;
            this.context.beginPath();
            this.context.arc(mouseX, mouseY, 2, 0, 2 * Math.PI);
            this.context.fillStyle = "black";
            // 透明度
            // this.context.globalAlpha = 1;
            this.context.closePath();
            this.context.fill();



        }
    }

}