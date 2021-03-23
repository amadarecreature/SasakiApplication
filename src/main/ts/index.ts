import { GoBoadManager } from "./GoBoardManager";
import { FreeWriteManager } from "./FreeWriteManager";
import { GoStoneManager, } from "./GoStoneManager";
import { GoCandidateManager } from "./GoCandidateManager";
import { GoPlayStatsuManager } from "./GoPlayStatusManager"


import { GoBoadSetting, GoStoneColor } from "./GoSetting";
import { GoLogger } from "./GoLogger"
/**
 * (Required feature)
 * ・View sample of two-eyed shape
 */
class Main {

    private gim: GoStoneManager;
    private gcm: GoCandidateManager;
    private fwm: FreeWriteManager;

    private sampleGsm: GoStoneManager;

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
    readonly inpSyncKey: HTMLInputElement = <HTMLInputElement>document.getElementById("synckey");

    readonly rdoNone: HTMLInputElement = <HTMLInputElement>document.getElementById("rdoNone");
    readonly rdoDrawMode: HTMLInputElement = <HTMLInputElement>document.getElementById("rdoDrawMode_on");

    readonly rdoBlackStoneModeOn: HTMLInputElement = <HTMLInputElement>document.getElementById("rdoBlackStoneModeOn");
    readonly rdoWhiteStoneModeOn: HTMLInputElement = <HTMLInputElement>document.getElementById("rdoWhiteStoneModeOn");
    readonly rdoCandidateMode: HTMLInputElement = <HTMLInputElement>document.getElementById("rdoCandidateMode_on");
    readonly slRosu: HTMLSelectElement = <HTMLSelectElement>document.getElementById("sl_rosu");
    readonly btnNew: HTMLButtonElement = <HTMLButtonElement>document.getElementById("btn_new");
    readonly btn_candidate_clear: HTMLButtonElement = <HTMLButtonElement>document.getElementById("btn_candidate_clear");

    // アゲハマモード
    readonly rdo_agehamaMode_on: HTMLInputElement = <HTMLInputElement>document.getElementById("rdo_agehamaMode_on");
    readonly chk_agehama_switch: HTMLInputElement = <HTMLInputElement>document.getElementById("agehama_switch");

    readonly spn_agehama_W: HTMLSpanElement = <HTMLSpanElement>document.getElementById("spn_agehama_W");
    readonly spn_agehama_B: HTMLSpanElement = <HTMLSpanElement>document.getElementById("spn_agehama_B");

    // 自動同期ボタン
    readonly btn_auto_sync_start: HTMLButtonElement = <HTMLButtonElement>document.getElementById("btn_auto_sync_start");
    readonly btn_auto_sync_stop: HTMLButtonElement = <HTMLButtonElement>document.getElementById("btn_auto_sync_stop");
    readonly btn_sync_upLoad: HTMLButtonElement = <HTMLButtonElement>document.getElementById("btn_sync_upLoad");
    readonly btn_sync_pull: HTMLButtonElement = <HTMLButtonElement>document.getElementById("btn_sync_pull");


    readonly btn_turn_back: HTMLButtonElement = <HTMLButtonElement>document.getElementById("btn_turn_back");
    readonly btn_turn_forward: HTMLButtonElement = <HTMLButtonElement>document.getElementById("btn_turn_forward");


    readonly kifuLogger = GoLogger.getInstance(this.inpKifu);

    readonly statusManager;
    /**
     * メイン処理をここに書く
     */
    constructor() {

        const rosu: number = parseInt(this.slRosu.options[this.slRosu.selectedIndex].value, 10);

        const key = this.inpSyncKey.value;
        this.statusManager = new GoPlayStatsuManager(key, "https://dev-instruction-go-api.westus.azurecontainer.io/");

        // 本体描画
        new GoBoadManager(this.canvasGoboad, this.setting, rosu);
        this.gim = new GoStoneManager(this.canvasIshi, this.setting, rosu);
        this.gcm = new GoCandidateManager(this.canvasCandidate, this.setting, rosu);
        this.fwm = new FreeWriteManager(this.canvasFree, this.setting, rosu);

        // サンプル描画
        new GoBoadManager(this.sampleCanvasGoboad, this.setting, rosu);
        this.sampleGsm = new GoStoneManager(this.sampleCanvasGoishi, this.setting, rosu);
        this.sampleGsm.roadFromKifu("B[ab]B[bb]B[cb]B[db]B[da]B[ba]W[bd]W[ad]W[be]W[bf]W[af]W[bg]W[bh]W[ah]B[gb]B[ga]B[ha]B[ib]B[hc]B[ic]");

        // 碁盤付近のクリックイベント
        this.canvasFree.addEventListener("click", (e: MouseEvent) => this.onMouseClick(e));

        // お絵描きモード用イベント
        this.canvasFree.addEventListener("mousedown", (e: MouseEvent) => this.onMouseDown(e));
        this.canvasFree.addEventListener("mouseup", (e: MouseEvent) => this.onMouseUp(e));
        this.canvasFree.addEventListener("mousemove", (e: MouseEvent) => this.onMouseMove(e));

        // 新規開始用イベント
        this.btnNew.addEventListener("click", (e: Event) => this.new(e))

        // 自動同期
        this.btn_auto_sync_start.addEventListener("click", (e: Event) => this.autoSyncStart(e));
        this.btn_auto_sync_stop.addEventListener("click", (e: Event) => this.autoSyncStop(e));

        // 手動更新
        this.btn_sync_upLoad.addEventListener("click", (e: Event) => this.syncUpLoad(e));
        this.btn_sync_pull.addEventListener("click", (e: Event) => this.sync(e));

        // 棋譜読み込み
        this.btn_candidate_clear.addEventListener("click", (e: Event) => this.clearCandidateView(e));

        // 待った
        const btnBack: HTMLButtonElement = <HTMLButtonElement>document.getElementById("btn_back");
        btnBack.addEventListener("click", (e: Event) => this.mattta(e));

        this.btn_turn_back.addEventListener("click", (e: Event) => this.turnBack(e));
        this.btn_turn_forward.addEventListener("click", (e: Event) => this.turnForward(e));

        this.btn_auto_sync_start.addEventListener("click", (e: Event) => this.autoSyncStart(e));

    }
    private syncUpLoad(e: Event) {
        this.statusManager.update(this.gim.kifuString);
    }
    private sync(e: Event) {
        this.statusManager.sync();
    }

    private autoSyncStart(e: Event) {
        this.gim.startSyncLoop(500, this.statusManager);
    }
    private autoSyncStop(e: Event) {
        this.gim.endSyncLoop(this.statusManager);
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

        if (this.rdoBlackStoneModeOn.checked) {
            this.gim.addSpecifiedColorStone(e.offsetX, e.offsetY, GoStoneColor.BLACK);
            this.kifuLogger.log(this.gim.kifuString);
            return;
        }
        if (this.rdoWhiteStoneModeOn.checked) {
            this.gim.addSpecifiedColorStone(e.offsetX, e.offsetY, GoStoneColor.WHITE);
            this.kifuLogger.log(this.gim.kifuString);
            return;
        }
        if (this.rdoCandidateMode.checked) {
            this.gcm.addCandidate(e.offsetX, e.offsetY);
            return;
        }

        // アゲハマ取るモード
        // if (this.rdo_agehamaMode_on.checked) {
        if (this.chk_agehama_switch.checked) {
            let targetMove = this.gim.getAgehama(e.offsetX, e.offsetY);
            this.spn_agehama_B.innerText = this.gim.agehamaB + "個";
            this.spn_agehama_W.innerText = this.gim.agehamaW + "個";
            return;

        }

        this.gim.chakushu(e.offsetX, e.offsetY);
        this.kifuLogger.log(this.gim.kifuString);
        this.statusManager.update(this.gim.kifuString);
        const spnTeban: HTMLSpanElement = <HTMLSpanElement>document.getElementById("spnTeban");
        spnTeban.innerHTML = this.gim.nextTurn;
    }
    /**
     * 新規表示
     * @param e 
     */
    private new(e: Event) {
        const rosu: number = parseInt(this.slRosu.options[this.slRosu.selectedIndex].value, 10);

        new GoBoadManager(this.canvasGoboad, this.setting, rosu);
        this.gim = new GoStoneManager(this.canvasIshi, this.setting, rosu);
        this.gcm = new GoCandidateManager(this.canvasFree, this.setting, rosu);
        this.fwm = new FreeWriteManager(this.canvasFree, this.setting, rosu);

        // データ登録
        this.statusManager.sync();

    }

    private turnBack(e: Event) {

    }
    private turnForward(e: Event) {

    }

    private mattta(e: Event) {
        this.gim.matta();
        this.kifuLogger.log(this.gim.kifuString);

    }
    /**
     * 指導内容のクリア
     * @param e 
     */
    private clearCandidateView(e: Event) {
        this.fwm.clearAll();
        this.gcm.clearAll();
        this.rdoNone.checked = true;
    }
}
// Mainクラスを実行する。
window.addEventListener("load", () => new Main());


