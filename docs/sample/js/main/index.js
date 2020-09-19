import { GoBoadManager, GoishiManager } from "./GoBoardMagnager.js";
import { GoBoadSetting } from "./GoSetting.js";
import { GoLogger } from "./GoLogger.js";
var Main = /** @class */ (function () {
    function Main() {
        var _this = this;
        this.setting = new GoBoadSetting(0.9, 20, 20, 22);
        var canvas = document.getElementById("main_canvas");
        var canvasIshi = document.getElementById("sub_canvas");
        var lblLog = document.getElementById("log");
        this.gbm = new GoBoadManager(canvas, this.setting, 9, GoLogger.getInstance(lblLog));
        this.gim = new GoishiManager(canvasIshi, this.setting, 9, GoLogger.getInstance(lblLog));
        canvasIshi.addEventListener("click", function (e) { return _this.onMouseClick(e); });
        // 再描画
        var btnNew = document.getElementById("btn_new");
        btnNew.addEventListener("click", function (e) { return _this.new(e); });
        // 再描画
        var btnRenew = document.getElementById("btn_renew");
        btnRenew.addEventListener("click", function (e) { return _this.renew(e); });
        // 待った
        var btnBack = document.getElementById("btn_back");
        btnBack.addEventListener("click", function (e) { return _this.mattta(e); });
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
    Main.prototype.new = function (e) {
        var canvas = document.getElementById("main_canvas");
        var canvasIshi = document.getElementById("sub_canvas");
        var lblLog = document.getElementById("log");
        var slRosu = document.getElementById("sl_rosu");
        var rosu = parseInt(slRosu.options[slRosu.selectedIndex].value, 10);
        this.gbm = new GoBoadManager(canvas, this.setting, rosu, GoLogger.getInstance(lblLog));
        this.gim = new GoishiManager(canvasIshi, this.setting, rosu, GoLogger.getInstance(lblLog));
    };
    Main.prototype.mattta = function (e) {
        this.gim.chakushBack(0);
    };
    Main.prototype.renew = function (e) {
        this.gim.view();
    };
    return Main;
}());
// Mainクラスを実行する。
window.addEventListener("load", function () { return new Main(); });
