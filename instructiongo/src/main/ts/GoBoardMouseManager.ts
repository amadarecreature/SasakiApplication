import { GoBoadSetting, GoBoadInfo, PointerPosition, PositionOnGoBoad } from "./GoSetting";
import { GoStoneUtil } from "./GoUtils"

export class GoBoardMouseManager {

    private _canvas!: HTMLCanvasElement;
    /**
     * このクラスが扱うカンバスのコンテキスト
     * 
     */
    readonly _context!: CanvasRenderingContext2D;

    readonly _goBoadInfo!: GoBoadInfo;

    readonly _pointerColor: string;

    /**
     * このクラスが扱うコンテキストと幅(縦も同義)を注入する
     * @param canvas 
     * @param goSetting
     * @param ro 
     */
    public constructor(canvas: HTMLCanvasElement, goSetting: GoBoadSetting, ro: number) {

        this._pointerColor = "red";

        this._goBoadInfo = new GoBoadInfo(goSetting.roHW, goSetting.roHW, goSetting.gobanLeft, goSetting.gobanTop, ro);

        // canvasのサイズ変更(サイズ変更すると描画内容が消えるので先に変更)
        canvas.width = this._goBoadInfo.width + 20;
        canvas.height = this._goBoadInfo.height + 20;

        //カンバスが使用できるかチェック
        // テストができない
        /* istanbul ignore next */
        if (!canvas.getContext) {
            console.log('カンバスが使用できません');
            return;
        }


        //カンバス・コンテキスト・大きさを注入する
        this._canvas = canvas;
        this._context = canvas.getContext('2d')!;



    }

    /**
     * Draws pointer position line
     * @param mouseX 
     * @param mouseY 
     */
    public drawPointerPositionLine(mouseX: number, mouseY: number) {

        // いったんクリア
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);

        const pos = new PointerPosition(mouseX, mouseY);

        const roPos = GoStoneUtil.calcPositionOnGoban(pos, this._goBoadInfo);
        console.info("mouse position" + roPos.roX + ":" + roPos.roY);
        const circleCenterPosition = this.calcCircleCenterPosition(this._goBoadInfo, roPos);

        this.drawCircle(circleCenterPosition.x, circleCenterPosition.y, 4, 1, this._context, this._pointerColor);

        const lineLength = this._goBoadInfo.roHeight * 1;
        this.drawLineVH(circleCenterPosition.x, circleCenterPosition.y, lineLength, 2, this._context, this._pointerColor);
    }
    private drawCircle(x: number, y: number, r: number, globalAlpha: number, context: CanvasRenderingContext2D, fillStyle: string) {
        context.beginPath();
        context.arc(x, y, r, 0, 2 * Math.PI);
        context.globalAlpha = globalAlpha;
        context.fillStyle = fillStyle;
        context.fill();

        // 透明度
        context.closePath();

    }

    private drawLineVH(x: number, y: number, length: number, lineWidth: number, context: CanvasRenderingContext2D, fillStyle: string) {
        context.beginPath();
        context.lineWidth = lineWidth;
        context.strokeStyle = fillStyle;
        context.moveTo(x, y)
        context.lineTo(x + length, y);
        context.lineTo(x - length, y);
        context.moveTo(x, y)
        context.lineTo(x, y + length);
        context.lineTo(x, y - length);
        // context.fillStyle = fillStyle;
        // context.fill();
        context.stroke();
        // 透明度
        context.closePath();

    }

    /**
     * Calcs circle center position
     * 同じ奴があるのであとで消す
     * @param goBoadInfo 
     * @param positionOnGoban 
     * @returns  
     */
    private calcCircleCenterPosition(goBoadInfo: GoBoadInfo, positionOnGoban: PositionOnGoBoad) {
        const circleX = goBoadInfo.areaLeft + goBoadInfo.keisenWidth + (goBoadInfo.roWidth) * (positionOnGoban.roX);
        // 端の線は2px(格子ごとの線+1pxなので、足りない1pxだけ足す)
        const circleY = goBoadInfo.areaTop + goBoadInfo.keisenWidth + (goBoadInfo.roHeight) * (positionOnGoban.roY);
        const circleCenterPosition = new PointerPosition(circleX, circleY);
        return circleCenterPosition;
    }

}