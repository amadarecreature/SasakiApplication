import { GoBoadManager } from "./GoBoardManager.js";

console.log("yyyyyyyyyyyyyyyyyyy");



class Main {

    readonly gbm: GoBoadManager;
    constructor() {
        const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("main_canvas");

        this.gbm = new GoBoadManager(canvas, 50, 20, 20, 9);

        canvas.addEventListener("click", (e: MouseEvent) => this.gbm.onClick(e));

        console.log("X1X2X3XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

        const btnRenew: HTMLButtonElement = <HTMLButtonElement>document.getElementById("btn_renew");
        btnRenew.addEventListener("click", (e: Event) => this.renew(e))

    }
    /**
     * 再描画イベント用
     * @param e 
     */
    private renew(e: Event) {
        const slRosu: HTMLSelectElement = <HTMLSelectElement>document.getElementById("sl_rosu");
        const rosu: number = parseInt(slRosu.options[slRosu.selectedIndex].value, 10);
        this.gbm.renew(rosu);

    }

}

// Mainクラスを実行する。
window.addEventListener("load", () => new Main());


