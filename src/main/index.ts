import { GoBoadManager } from "./GoBoardMagnager.js";
import { FreeWriteManager } from "./FreeWriteManager.js";
import { GoishiManager } from "./GoIshiManager.js";
import { GoCandidateManager } from "./GoCandidateManager.js";


import { GoBoadSetting } from "./GoSetting.js";
import { GoLogger } from "./GoLogger.js"
/**
 * (Required feature)
 * ・View sample of two-eyed shape
 */
class Main {

    private gbm: GoBoadManager;
    private gim: GoishiManager;
    private gcm: GoCandidateManager;
    readonly fwm: FreeWriteManager;

    readonly setting: GoBoadSetting = new GoBoadSetting(0.9, 20, 20, 36);

    readonly canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("main_canvas");
    readonly canvasIshi: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("sub_canvas");
    readonly canvasFree: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("free_canvas");
    readonly canvasCandidate: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("candidate_canvas");

    readonly lblLog: HTMLLabelElement = <HTMLLabelElement>document.getElementById("log");
    readonly inpKifu: HTMLInputElement = <HTMLInputElement>document.getElementById("kifu");

    readonly ckDrawMode: HTMLInputElement = <HTMLInputElement>document.getElementById("ckDrawMode");
    readonly ckOnOkiishiMode: HTMLInputElement = <HTMLInputElement>document.getElementById("ckOkiishiMode");
    readonly ckCandidateMode: HTMLInputElement = <HTMLInputElement>document.getElementById("ckCandidateMode");
    readonly slRosu: HTMLSelectElement = <HTMLSelectElement>document.getElementById("sl_rosu");
    readonly btnNew: HTMLButtonElement = <HTMLButtonElement>document.getElementById("btn_new");
    readonly btnReadKifu: HTMLButtonElement = <HTMLButtonElement>document.getElementById("btn_read_kifu");

    readonly kifuLogger = GoLogger.getInstance(this.inpKifu);

    /**
     * メイン処理をここに書く
     */
    constructor() {
        this.gbm = new GoBoadManager(this.canvas, this.setting, 9);
        this.gim = new GoishiManager(this.canvasIshi, this.setting, 9);
        this.gcm = new GoCandidateManager(this.canvasCandidate, this.setting, 9);
        this.fwm = new FreeWriteManager(this.canvasFree, this.setting, 9);

        // クリックイベント
        this.canvasFree.addEventListener("click", (e: MouseEvent) => this.onMouseClick(e));

        // お絵描きモード用イベント
        this.canvasFree.addEventListener("mousedown", (e: MouseEvent) => this.onMouseDown(e));
        this.canvasFree.addEventListener("mouseup", (e: MouseEvent) => this.onMouseUp(e));
        this.canvasFree.addEventListener("mousemove", (e: MouseEvent) => this.onMouseMove(e));
        this.ckDrawMode.addEventListener("change", (e: Event) => this.fwm.clearAll())

        // 候補モード用イベント
        this.ckCandidateMode.addEventListener("change", (e: Event) => this.gcm.clearAll())

        // 新規開始用イベント
        this.btnNew.addEventListener("click", (e: Event) => this.new(e))

        // 棋譜読み込み
        this.btnReadKifu.addEventListener("click", (e: Event) => this.readKifu(e));

        // 待った
        const btnBack: HTMLButtonElement = <HTMLButtonElement>document.getElementById("btn_back");
        btnBack.addEventListener("click", (e: Event) => this.mattta(e));

    }
    private onMouseMove(e: MouseEvent): any {
        if (this.ckDrawMode.checked) {
            this.fwm.draw(e.offsetX, e.offsetY);
        }
    }
    private onMouseDown(e: MouseEvent): any {
        if (this.ckDrawMode.checked) {
            this.fwm.start();
        }
    }
    private onMouseUp(e: MouseEvent): any {
        if (this.ckDrawMode.checked) {
            this.fwm.stop();
        }
    }

    /**
     * 
     * @param e 
     */
    private onMouseClick(e: MouseEvent) {
        if (this.ckDrawMode.checked) {
            // 描画モードの場合
            return;
        }

        if (this.ckOnOkiishiMode.checked) {
            this.gim.addOkiIshi(e.offsetX, e.offsetY);
            return;
        }
        if (this.ckCandidateMode.checked) {
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

        this.gbm = new GoBoadManager(this.canvas, this.setting, rosu);
        this.gim = new GoishiManager(this.canvasIshi, this.setting, rosu);
    }
    private mattta(e: Event) {
        this.gim.chakushBack();
    }
    private readKifu(e: Event) {
        this.gim.viewFromKifu(this.inpKifu.value);
    }
}
// Mainクラスを実行する。
window.addEventListener("load", () => new Main());


