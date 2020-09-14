
enum GoishiColor {
    BLACK,
    WHITE
}
class KifPart {
    readonly color: GoishiColor;
    readonly position: PositionXY;
    constructor(color: GoishiColor, roX: number, roY: number) {
        this.color = color;
        this.position = new PositionXY(roX, roY);
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
export class GoBoadManager {


    readonly kifu: KifPart[];

    readonly realtimePosition: GoishiColor[][];

    /**
     * このクラスが扱うカンバスのコンテキスト
     * 
     */
    readonly ctx!: CanvasRenderingContext2D;

    /**
     * このクラスが扱うカンバスの横幅(縦幅)
     */

    private canvas!: HTMLCanvasElement;

    private enable: boolean;

    private turn: GoishiColor;

    private gobanTop: number;
    private gobanLeft: number;


    // 一路の横
    private dx = 22;
    // 一路の縦
    private dy = 24;

    private ro: number;



    /**
     * 碁盤上での位置左上から数えた路数
     * @param x 
     * @param y 
     */
    private calcPositionOnGoban(x: number, y: number): PositionXY {
        const x0 = x - this.gobanLeft;
        const xRo = Math.floor((x0 + (this.dx / 2)) / this.dx);
        const y0 = y - this.gobanTop;
        const yRo = Math.floor((y0 + (this.dy / 2)) / this.dy);

        console.info("ro=" + xRo + ":" + yRo);


        return new PositionXY(xRo, yRo);
    }


    public renew(ro: number) {
        this.ro = ro;
        this.drawBoard(5, this.canvas, this.ctx);
    }

    /**
     * このクラスが扱うコンテキストと幅(縦も同義)を注入する
     * @param canvas 
     * @param width 
     * @param gobanTop 
     * @param gobanLeft 
     * @param ro 
     */
    public constructor(canvas: HTMLCanvasElement, width: number, gobanTop: number, gobanLeft: number, ro: number) {

        this.turn = GoishiColor.BLACK;

        //カンバスが使用できるかチェック
        if (!canvas.getContext) {
            console.log('[Roulette.constructor] カンバスが使用できません');
            this.enable = false;
            this.ro = 0;
            this.gobanTop = 0;
            this.gobanLeft = 0;
            this.kifu = new Array();
            this.realtimePosition = new Array();
            return;
        }

        //カンバス・コンテキスト・大きさを注入する
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.ro = ro;

        this.gobanTop = gobanTop;
        this.gobanLeft = gobanLeft;

        this.kifu = new Array();
        this.realtimePosition = new Array();

        //enable を true にする
        this.enable = true;

        //クラスを通して変わらないカンバス設定
        this.ctx.font = "bold 15px '游ゴシック'";
        this.ctx.textAlign = 'center';
        this.ctx.shadowBlur = 2;
        this.drawBoard(5, this.canvas, this.ctx);
    }

    /**
     * 碁盤を描画します。
     * @param shadow 影の長さ（高さ/2）
     * @param context 描画先のコンテキストを指定します。
     * @since 0.1
     */
    private drawBoard(shadow: number, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {

        // 碁盤のサイズ
        const width = this.dx * (this.ro + 1);
        const height = this.dy * (this.ro + 1);
        const gwidth = this.dx * (this.ro - 1) + 2;
        const gheight = this.dy * (this.ro - 1) + 2;
        const gx = this.gobanLeft + Math.floor((width - gwidth) / 2);
        const gy = this.gobanTop + Math.floor((height - gheight) / 2);

        // サイズ変更(サイズ変更すると描画内容が消えるので先に変更)
        canvas.width = width + 20;
        canvas.height = height + 20;

        console.log("canvas:", canvas.width, canvas.height);

        // 碁盤の影
        this.drowShadow(this.ctx, this.gobanLeft, this.gobanTop, width, shadow, height);
        // 碁盤
        this.drowGoban(this.ctx, this.gobanLeft, this.gobanTop, width, height);
        // 木目
        // drawWoodGrain(x, y, width, height, context);
        // 格子
        this.drowKoushi(this.ctx, gx, this.ro, gy, this.dy, gwidth, this.dx, gheight);

        // TODO:変更の仕方調べる

    }

    private drowKoushi(context: CanvasRenderingContext2D, gx: number, ro: number, gy: number, dy: number, gwidth: number, dx: number, gheight: number) {
        context.fillStyle = "black";


        let y1, lwidth;
        // 横の格子線
        let x2;
        const y2 = gy;
        for (var col = 1; col <= ro; col++) {
            if (col == 1)
                x2 = gx + (col - 1) * dx;

            else
                x2 = gx + 1 + (col - 1) * dx;
            if (col == 1 || col == ro)
                lwidth = 2;

            else
                lwidth = 1;
            context.beginPath();
            context.rect(x2, y2, lwidth, gheight);
            context.fill();
            console.log("格子横:" + col, x2);
        }

        // （横の格子線）
        const x1 = gx;
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
            console.log("格子縦:" + row, y1);
        }
    }

    private drowGoban(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
        context.beginPath();
        context.rect(x, y, width, height);
        context.fillStyle = "burlywood";
        context.globalAlpha = 1.0;
        context.fill();
    }

    private drowShadow(context: CanvasRenderingContext2D, x: number, y: number, width: number, shadow: number, height: number) {
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x + width, y);
        context.lineTo(x + width + shadow, y + shadow);
        context.lineTo(x + width + shadow, y + height + shadow);
        context.lineTo(x + shadow, y + height + shadow);
        context.lineTo(x, y + height);
        context.closePath();
        context.fillStyle = "black";
        context.globalAlpha = 0.5;
        context.fill();
    }

    /**
     * 円形オブジェクトを描画します。
     * @param x 左端座標
     * @param y 上端座標
     * @param r 半径
     * @param shadow 影の長さ（高さ/2）
     * @param context 描画先のコンテキストを指定します。
     * @since 0.1
     */
    private drawCircle(x: number, y: number, r: number, shadow: number, context: CanvasRenderingContext2D, fillStyle: string) {
        context.beginPath();
        context.arc(x + r + shadow, y + r + shadow, r, 0, 2 * Math.PI);
        context.fillStyle = fillStyle;
        // 透明度
        context.globalAlpha = 0.5;
        context.fill();

        console.log("color", fillStyle);
    }

    /**
 * マウスイベントハンドラー
 * とりあえず碁石を置きます。
 * @since 0.2
 */
    public onClick(event: MouseEvent) {

        const mouseX = event.offsetX;
        const mouseY = event.offsetY;

        console.info("click=" + mouseX + ":" + mouseY);

        const width = this.dx * (this.ro + 1);
        const height = this.dy * (this.ro + 1);
        const gwidth = this.dx * (this.ro - 1) + 2;
        const gheight = this.dy * (this.ro - 1) + 2;
        const gx = this.gobanLeft + Math.floor((width - gwidth) / 2);
        const gy = this.gobanTop + Math.floor((height - gheight) / 2);

        // TODO:値を受け取る
        const positionOnGoban = this.calcPositionOnGoban(mouseX, mouseY)

        const keisen = 1;
        const circleX = gx + 1 + keisen + (this.dx) * (positionOnGoban.x - 1);
        // TODO:なぜ２を足さないといけないのか?
        const circleY = gy + 2 + keisen + (this.dy) * (positionOnGoban.y - 1);

        console.info("circle=" + circleX + ":" + circleY);


        const fillstyle = (this.turn == GoishiColor.BLACK) ? "black" : "white";
        this.drawCircle(circleX - (this.dx / 2), circleY - (this.dy / 2), 10, 0, this.ctx, fillstyle);


        // ターンを入れ替える
        this.turn = (this.turn == GoishiColor.BLACK) ? GoishiColor.WHITE : GoishiColor.BLACK;

        this.kifu.push(new KifPart(this.turn, positionOnGoban.x - 1, positionOnGoban.y - 1));

        // auClick.play();
        // turn = 3 - turn;
    }
}