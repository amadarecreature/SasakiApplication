import { GoBoadInfo, GoBoadSetting } from "./GoSetting";

export class FreeWriteManager {
    /**
     * このクラスが扱うカンバスのコンテキスト
     * 
     */
    readonly context!: CanvasRenderingContext2D;

    private canvas!: HTMLCanvasElement;

    /**
     * なめらかに線を引くために、前回の描画した場所を保存しておく。
     */
    private lastPointX: number = 0;
    private lastPointY: number = 0;

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
        canvas.width = goBoadInfo.width + 40;
        canvas.height = goBoadInfo.height + 40;

        console.log("initCanvas:", canvas.width, canvas.height);
    }
    public clearAll() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    // 描画中かどうか
    private isDrawing: boolean = false;

    /**
     * 描画を開始する
     * @param mouseX 
     * @param mouseY 
     */
    public start(mouseX: number, mouseY: number) {
        this.lastPointX = mouseX;
        this.lastPointY = mouseY;
        this.isDrawing = true;

    }
    /**
     * 描画を終了する
     */
    public stop() {
        this.isDrawing = false;
    }
    /**
     * 指定した点と、前回の点を結んだ線を描画する。
     * @param mouseX 
     * @param mouseY 
     */
    public draw(mouseX: number, mouseY: number) {

        if (this.isDrawing) {
            const top = this.goBoadInfo.top;
            const left = this.goBoadInfo.left;
            this.context.beginPath();

            const distanceX = (mouseX - this.lastPointX) / 5;
            const distanceY = (mouseY - this.lastPointY) / 5;
            this.context.arc(mouseX - (distanceX * 4), mouseY - (distanceY * 4), 2, 0, 2 * Math.PI);
            this.context.arc(mouseX - (distanceX * 3), mouseY - (distanceY * 3), 2, 0, 2 * Math.PI);
            this.context.arc(mouseX - (distanceX * 2), mouseY - (distanceY * 2), 2, 0, 2 * Math.PI);
            this.context.arc(mouseX - (distanceX * 1), mouseY - (distanceY * 1), 2, 0, 2 * Math.PI);

            //先端
            this.context.arc(mouseX, mouseY, 2, 0, 2 * Math.PI);
            this.context.fillStyle = "black";
            // 透明度
            this.context.closePath();
            this.context.fill();
            this.lastPointX = mouseX;
            this.lastPointY = mouseY;
        }
    }

}