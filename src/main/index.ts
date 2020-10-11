import { GoBoadManager } from "./GoBoardMagnager";
import { FreeWriteManager } from "./FreeWriteManager";
import { GoishiManager } from "./GoIshiManager";
import { GoCandidateManager } from "./GoCandidateManager";


import { GoBoadSetting } from "./GoSetting";
import { GoLogger } from "./GoLogger"
/**
 * (Required feature)
 * ・View sample of two-eyed shape
 */
class Main {

    private gim: GoishiManager;
    private gcm: GoCandidateManager;
    private fwm: FreeWriteManager;

    private sampleGim: GoishiManager;

    // 碁盤の設定
    readonly setting: GoBoadSetting = new GoBoadSetting(0.9, 20, 20, 36);

    readonly canvasGoboad: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("goboad_canvas");
    readonly canvasIshi: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("goishi_canvas");
    readonly canvasFree: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("free_canvas");
    readonly canvasCandidate: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("candidate_canvas");

    readonly sampleCanvasGoboad: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("sample_goboad_canvas");
    readonly sampleCanvasGoishi: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("sample_goishi_canvas");


    readonly lblLog: HTMLLabelElement = <HTMLLabelElement>document.getElementById("log");
    readonly inpKifu: HTMLInputElement = <HTMLInputElement>document.getElementById("kifu");

    readonly rdoDrawMode: HTMLInputElement = <HTMLInputElement>document.getElementById("rdoDrawMode");
    readonly rdoHandiCapStoneMode: HTMLInputElement = <HTMLInputElement>document.getElementById("rdoHandicapMode");
    readonly rdoCandidateMode: HTMLInputElement = <HTMLInputElement>document.getElementById("rdoCandidateMode");
    readonly slRosu: HTMLSelectElement = <HTMLSelectElement>document.getElementById("sl_rosu");
    readonly btnNew: HTMLButtonElement = <HTMLButtonElement>document.getElementById("btn_new");
    readonly btnClearCandidateView: HTMLButtonElement = <HTMLButtonElement>document.getElementById("btn_candidate_clear");

    readonly kifuLogger = GoLogger.getInstance(this.inpKifu);

    /**
     * メイン処理をここに書く
     */
    constructor() {
        // 本体描画
        new GoBoadManager(this.canvasGoboad, this.setting, 9);
        this.gim = new GoishiManager(this.canvasIshi, this.setting, 9);
        this.gcm = new GoCandidateManager(this.canvasCandidate, this.setting, 9);
        this.fwm = new FreeWriteManager(this.canvasFree, this.setting, 9);

        // サンプル描画
        new GoBoadManager(this.sampleCanvasGoboad, this.setting, 9);
        this.sampleGim = new GoishiManager(this.sampleCanvasGoishi, this.setting, 9);
        this.sampleGim.roadFromKifu("B[ab]B[bb]B[cb]B[db]B[da]B[ba]W[bd]W[ad]W[be]W[bf]W[af]W[bg]W[bh]W[ah]B[gb]B[ga]B[ha]B[ib]B[hc]B[ic]");

        // 碁盤付近のクリックイベント
        this.canvasFree.addEventListener("click", (e: MouseEvent) => this.onMouseClick(e));

        // お絵描きモード用イベント
        this.canvasFree.addEventListener("mousedown", (e: MouseEvent) => this.onMouseDown(e));
        this.canvasFree.addEventListener("mouseup", (e: MouseEvent) => this.onMouseUp(e));
        this.canvasFree.addEventListener("mousemove", (e: MouseEvent) => this.onMouseMove(e));

        // 新規開始用イベント
        this.btnNew.addEventListener("click", (e: Event) => this.new(e))

        // 棋譜読み込み
        this.btnClearCandidateView.addEventListener("click", (e: Event) => this.clearCandidateView(e));

        // 待った
        const btnBack: HTMLButtonElement = <HTMLButtonElement>document.getElementById("btn_back");
        btnBack.addEventListener("click", (e: Event) => this.mattta(e));

    }
    private onMouseMove(e: MouseEvent): any {
        if (this.rdoDrawMode.checked) {
            this.fwm.draw(e.offsetX, e.offsetY);
        }
    }
    private onMouseDown(e: MouseEvent): any {
        if (this.rdoDrawMode.checked) {
            this.fwm.start(e.offsetX, e.offsetY);
        }
    }
    private onMouseUp(e: MouseEvent): any {
        if (this.rdoDrawMode.checked) {
            this.fwm.stop();
        }
    }

    /**
     * 
     * @param e 
     */
    private onMouseClick(e: MouseEvent) {
        if (this.rdoDrawMode.checked) {
            // 描画モードの場合
            return;
        }

        if (this.rdoHandiCapStoneMode.checked) {
            this.gim.addHandicapStone(e.offsetX, e.offsetY);
            this.kifuLogger.log(this.gim.kifuString);
            return;
        }
        if (this.rdoCandidateMode.checked) {
            this.gcm.addCandidate(e.offsetX, e.offsetY);
            return;
        }

        this.gim.chakushu(e.offsetX, e.offsetY);
        this.kifuLogger.log(this.gim.kifuString);
        const spnTeban: HTMLSpanElement = <HTMLSpanElement>document.getElementById("spnTeban");
        spnTeban.innerHTML = this.gim.turn;
    }
    /**
     * 新規表示
     * @param e 
     */
    private new(e: Event) {
        const rosu: number = parseInt(this.slRosu.options[this.slRosu.selectedIndex].value, 10);

        new GoBoadManager(this.canvasGoboad, this.setting, rosu);
        this.gim = new GoishiManager(this.canvasIshi, this.setting, rosu);
        this.gcm = new GoCandidateManager(this.canvasFree, this.setting, rosu);
        this.fwm = new FreeWriteManager(this.canvasFree, this.setting, rosu);
    }
    private mattta(e: Event) {
        this.gim.chakushBack();
    }
    /**
     * 指導内容のクリア
     * @param e 
     */
    private clearCandidateView(e: Event) {
        this.fwm.clearAll();
        this.gcm.clearAll();
    }
}
// Mainクラスを実行する。
window.addEventListener("load", () => new Main());


