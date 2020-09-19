import { GoBoadManager, GoishiManager } from "./GoBoardMagnager.js";
import { GoBoadSetting } from "./GoSetting.js";
import { GoLogger } from "./GoLogger.js"

class Main {

    private gbm: GoBoadManager;
    private gim: GoishiManager;
    readonly setting: GoBoadSetting = new GoBoadSetting(0.9, 20, 20, 22);

    readonly canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("main_canvas");
    readonly canvasIshi: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("sub_canvas");
    readonly lblLog: HTMLLabelElement = <HTMLLabelElement>document.getElementById("log");

    readonly slRosu: HTMLSelectElement = <HTMLSelectElement>document.getElementById("sl_rosu");


    /**
     * メイン処理をここに書く
     */
    constructor() {
        this.gbm = new GoBoadManager(this.canvas, this.setting, 9);
        this.gim = new GoishiManager(this.canvasIshi, this.setting, 9, GoLogger.getInstance(this.lblLog));

        this.canvasIshi.addEventListener("click", (e: MouseEvent) => this.onMouseClick(e));

        // 再描画
        const btnNew: HTMLButtonElement = <HTMLButtonElement>document.getElementById("btn_new");
        btnNew.addEventListener("click", (e: Event) => this.new(e))

        // 再描画
        const btnRenew: HTMLButtonElement = <HTMLButtonElement>document.getElementById("btn_renew");
        btnRenew.addEventListener("click", (e: Event) => this.renew(e))

        // 待った
        const btnBack: HTMLButtonElement = <HTMLButtonElement>document.getElementById("btn_back");
        btnBack.addEventListener("click", (e: Event) => this.mattta(e))

    }

    /**
     * 
     * @param e 
     */
    private onMouseClick(e: MouseEvent) {
        const ckOnOkiishiMode: HTMLInputElement = <HTMLInputElement>document.getElementById("ckOkiishiMode");
        if (ckOnOkiishiMode.checked) {
            this.gim.addOkiIshi(e.offsetX, e.offsetY);
        } else {
            this.gim.chakushu(e.offsetX, e.offsetY);
        }
        const spnTeban: HTMLSpanElement = <HTMLSpanElement>document.getElementById("spnTeban");
        spnTeban.innerHTML = this.gim.turn;
    }
    /**
     * 再描画イベント用
     * @param e 
     */
    private new(e: Event) {
        const rosu: number = parseInt(this.slRosu.options[this.slRosu.selectedIndex].value, 10);

        this.gbm = new GoBoadManager(this.canvas, this.setting, rosu);
        this.gim = new GoishiManager(this.canvasIshi, this.setting, rosu, GoLogger.getInstance(this.lblLog));
    }
    private mattta(e:Event){
        this.gim.chakushBack(0);
    }
    private renew(e:Event){
        this.gim.view();
    }
}
// Mainクラスを実行する。
window.addEventListener("load", () => new Main());


