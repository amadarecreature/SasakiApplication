import { Canvas3dManager } from "./Canvas3dManager";
import { PointerPosition } from "./PointerPosition";

class MainProcess {

    readonly mainCanvas = <HTMLCanvasElement>document.getElementById("mainCanvas");
    readonly btnForward1 = <HTMLLabelElement>document.getElementById("btnForward1");

    readonly canvasMgr;

    constructor() {
        this.init();
        this.canvasMgr = new Canvas3dManager(this.mainCanvas, 800, 600);

        this.canvasMgr.viewBall(100, new PointerPosition(240, 240));
    }

    private init() {

    }



}


// Mainクラスを実行する。
window.addEventListener("load", () => new MainProcess());

