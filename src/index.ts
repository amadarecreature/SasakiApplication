import { GoBoadManager, GoishiManager } from "./main/GoBoardMagnager.js";
import { GoBoadSetting } from "./main/GoSetting";
import { GoLogger } from "./main/GoLogger.js"

class Main {

    private gbm: GoBoadManager;
    private gim: GoishiManager;

    readonly goBoadSetting: GoBoadSetting = new GoBoadSetting(0.9, 20, 20, 22);
    constructor() {

        // 路のサイズ
        const roWH = 22;

        const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("main_canvas");
        const canvasIshi: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("sub_canvas");
        const lblLog: HTMLLabelElement = <HTMLLabelElement>document.getElementById("log");
        this.gbm = new GoBoadManager(canvas, this.goBoadSetting, 9, GoLogger.getInstance(lblLog));
        this.gim = new GoishiManager(canvasIshi, this.goBoadSetting, 9, GoLogger.getInstance(lblLog));
        canvasIshi.addEventListener("click", (e: MouseEvent) => this.onClick(e));

        console.log("X1X2X3XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

        const btnRenew: HTMLButtonElement = <HTMLButtonElement>document.getElementById("btn_renew");
        btnRenew.addEventListener("click", (e: Event) => this.renew(e))

    }

    private onClick(e: MouseEvent) {
        const ckOnOkiishiMode: HTMLInputElement = <HTMLInputElement>document.getElementById("ckOkiishiMode");
        if (ckOnOkiishiMode.checked) {
            this.gim.addOkiIshi(e.offsetX, e.offsetY);
        } else {
            this.gim.chakushu(e.offsetX, e.offsetY);
        }
    }
    /**
     * 再描画イベント用
     * @param e 
     */
    private renew(e: Event) {
        const lblLog: HTMLLabelElement = <HTMLLabelElement>document.getElementById("log");

        // 路数選択
        const slRosu: HTMLSelectElement = <HTMLSelectElement>document.getElementById("sl_rosu");
        const rosu: number = parseInt(slRosu.options[slRosu.selectedIndex].value, 10);

        const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("main_canvas");
        this.gbm = new GoBoadManager(canvas, this.goBoadSetting, rosu, GoLogger.getInstance(lblLog));

        const canvasIshi: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("sub_canvas");
        this.gim = new GoishiManager(canvasIshi, this.goBoadSetting, rosu, GoLogger.getInstance(lblLog));
    }
    private back(e: Event) {

    }

}

// Mainクラスを実行する。
window.addEventListener("load", () => new Main());


