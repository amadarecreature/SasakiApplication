import { GoBoadManager, GoishiManager } from "./GoBoardMagnager.js";
import { GoBoadSetting } from "./GoSetting.js";
import { GoLogger } from "./GoLogger.js"

class Main {

    private gbm: GoBoadManager;
    private gim: GoishiManager;
    constructor() {
        const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("main_canvas");
        const canvasIshi: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("sub_canvas");
        const lblLog: HTMLLabelElement = <HTMLLabelElement>document.getElementById("log");
        this.gbm = new GoBoadManager(canvas, canvasIshi, new GoBoadSetting(0.9, 20, 20), 9, GoLogger.getInstance(lblLog));
        this.gim = new GoishiManager(canvasIshi, new GoBoadSetting(0.9, 20, 20), 9, GoLogger.getInstance(lblLog));

        canvasIshi.addEventListener("click", (e: MouseEvent) => this.onMouseClick(e));

        const btnRenew: HTMLButtonElement = <HTMLButtonElement>document.getElementById("btn_renew");
        btnRenew.addEventListener("click", (e: Event) => this.renew(e))

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
    private renew(e: Event) {
        const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("main_canvas");
        const canvasIshi: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("sub_canvas");
        const lblLog: HTMLLabelElement = <HTMLLabelElement>document.getElementById("log");

        const slRosu: HTMLSelectElement = <HTMLSelectElement>document.getElementById("sl_rosu");
        const rosu: number = parseInt(slRosu.options[slRosu.selectedIndex].value, 10);

        this.gbm = new GoBoadManager(canvas, canvasIshi, new GoBoadSetting(0.9, 20, 20), rosu, GoLogger.getInstance(lblLog));
        this.gim = new GoishiManager(canvasIshi, new GoBoadSetting(0.9, 20, 20), rosu, GoLogger.getInstance(lblLog));
    }
}

// Mainクラスを実行する。
window.addEventListener("load", () => new Main());


