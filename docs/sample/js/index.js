import { GoBoadManager, GoishiManager } from "./main/GoBoardMagnager.js";
import { GoBoadSetting } from "./main/GoSetting";
import { GoLogger } from "./main/GoLogger.js";
var Main = /** @class */ (function () {
    function Main() {
        var _this = this;
        this.goBoadSetting = new GoBoadSetting(0.9, 20, 20, 22);
        // 路のサイズ
        var roWH = 22;
        var canvas = document.getElementById("main_canvas");
        var canvasIshi = document.getElementById("sub_canvas");
        var lblLog = document.getElementById("log");
        this.gbm = new GoBoadManager(canvas, this.goBoadSetting, 9, GoLogger.getInstance(lblLog));
        this.gim = new GoishiManager(canvasIshi, this.goBoadSetting, 9, GoLogger.getInstance(lblLog));
        canvasIshi.addEventListener("click", function (e) { return _this.onClick(e); });
        console.log("X1X2X3XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
        var btnRenew = document.getElementById("btn_renew");
        btnRenew.addEventListener("click", function (e) { return _this.renew(e); });
    }
    Main.prototype.onClick = function (e) {
        var ckOnOkiishiMode = document.getElementById("ckOkiishiMode");
        if (ckOnOkiishiMode.checked) {
            this.gim.addOkiIshi(e.offsetX, e.offsetY);
        }
        else {
            this.gim.chakushu(e.offsetX, e.offsetY);
        }
    };
    /**
     * 再描画イベント用
     * @param e
     */
    Main.prototype.renew = function (e) {
        var lblLog = document.getElementById("log");
        // 路数選択
        var slRosu = document.getElementById("sl_rosu");
        var rosu = parseInt(slRosu.options[slRosu.selectedIndex].value, 10);
        var canvas = document.getElementById("main_canvas");
        this.gbm = new GoBoadManager(canvas, this.goBoadSetting, rosu, GoLogger.getInstance(lblLog));
        var canvasIshi = document.getElementById("sub_canvas");
        this.gim = new GoishiManager(canvasIshi, this.goBoadSetting, rosu, GoLogger.getInstance(lblLog));
    };
    Main.prototype.back = function (e) {
    };
    return Main;
}());
// Mainクラスを実行する。
window.addEventListener("load", function () { return new Main(); });
