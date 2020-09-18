import { GoBoadManager, GoishiManager } from "./GoBoardMagnager.js";
import { GoBoadSetting } from "./GoSetting.js";
import { GoLogger } from "./GoLogger.js";
var Main = /** @class */ (function () {
    function Main() {
        var _this = this;
        var canvas = document.getElementById("main_canvas");
        var canvasIshi = document.getElementById("sub_canvas");
        var lblLog = document.getElementById("log");
        this.gbm = new GoBoadManager(canvas, canvasIshi, new GoBoadSetting(0.9, 20, 20), 9, GoLogger.getInstance(lblLog));
        this.gim = new GoishiManager(canvasIshi, new GoBoadSetting(0.9, 20, 20), 9, GoLogger.getInstance(lblLog));
        canvasIshi.addEventListener("click", function (e) { return _this.onMouseClick(e); });
        var btnRenew = document.getElementById("btn_renew");
        btnRenew.addEventListener("click", function (e) { return _this.renew(e); });
    }
    /**
     *
     * @param e
     */
    Main.prototype.onMouseClick = function (e) {
        var ckOnOkiishiMode = document.getElementById("ckOkiishiMode");
        if (ckOnOkiishiMode.checked) {
            this.gim.addOkiIshi(e.offsetX, e.offsetY);
        }
        else {
            this.gim.chakushu(e.offsetX, e.offsetY);
        }
        var spnTeban = document.getElementById("spnTeban");
        spnTeban.innerHTML = this.gim.turn;
    };
    /**
     * 再描画イベント用
     * @param e
     */
    Main.prototype.renew = function (e) {
        var canvas = document.getElementById("main_canvas");
        var canvasIshi = document.getElementById("sub_canvas");
        var lblLog = document.getElementById("log");
        var slRosu = document.getElementById("sl_rosu");
        var rosu = parseInt(slRosu.options[slRosu.selectedIndex].value, 10);
        this.gbm = new GoBoadManager(canvas, canvasIshi, new GoBoadSetting(0.9, 20, 20), rosu, GoLogger.getInstance(lblLog));
        this.gim = new GoishiManager(canvasIshi, new GoBoadSetting(0.9, 20, 20), rosu, GoLogger.getInstance(lblLog));
    };
    return Main;
}());
// Mainクラスを実行する。
window.addEventListener("load", function () { return new Main(); });
