import { GoBoadManager } from "./GoBoardMagnager.js";
import { GoSetting } from "./GoSetting.js";
var Main = /** @class */ (function () {
    function Main() {
        var _this = this;
        var canvas = document.getElementById("main_canvas");
        var canvasIshi = document.getElementById("sub_canvas");
        this.gbm = new GoBoadManager(canvas, canvasIshi, new GoSetting(0.9, 20, 20), 9);
        canvasIshi.addEventListener("click", function (e) { return _this.onClick(e); });
        console.log("X1X2X3XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
        var btnRenew = document.getElementById("btn_renew");
        btnRenew.addEventListener("click", function (e) { return _this.renew(e); });
    }
    Main.prototype.onClick = function (e) {
        this.gbm.addGoishi(e.offsetX, e.offsetY);
    };
    /**
     * 再描画イベント用
     * @param e
     */
    Main.prototype.renew = function (e) {
        var slRosu = document.getElementById("sl_rosu");
        var rosu = parseInt(slRosu.options[slRosu.selectedIndex].value, 10);
        this.gbm.renew(rosu);
    };
    return Main;
}());
// Mainクラスを実行する。
window.addEventListener("load", function () { return new Main(); });
