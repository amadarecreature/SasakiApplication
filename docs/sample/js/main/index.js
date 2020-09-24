import { GoBoadManager } from "./GoBoardMagnager.js";
import { FreeWriteManager } from "./FreeWriteManager.js";
import { GoishiManager } from "./GoIshiManager.js";
import { GoBoadSetting } from "./GoSetting.js";
import { GoLogger } from "./GoLogger.js";
var Main = /** @class */ (function () {
    /**
     * メイン処理をここに書く
     */
    function Main() {
        var _this = this;
        this.setting = new GoBoadSetting(0.9, 20, 20, 36);
        this.canvas = document.getElementById("main_canvas");
        this.canvasIshi = document.getElementById("sub_canvas");
        this.canvasFree = document.getElementById("free_canvas");
        this.canvasCandidate = document.getElementById("candidate_canvas");
        this.lblLog = document.getElementById("log");
        this.inpKifu = document.getElementById("kifu");
        this.ckDrawMode = document.getElementById("ckDrawMode");
        this.ckOnOkiishiMode = document.getElementById("ckOkiishiMode");
        this.ckCandidateMode = document.getElementById("ckCandidateMode");
        this.slRosu = document.getElementById("sl_rosu");
        this.btnNew = document.getElementById("btn_new");
        this.gbm = new GoBoadManager(this.canvas, this.setting, 9);
        this.gim = new GoishiManager(this.canvasIshi, this.setting, 9, GoLogger.getInstance(this.inpKifu));
        this.gcm = new GoishiManager(this.canvasCandidate, this.setting, 9, GoLogger.getInstance(this.inpKifu));
        this.Fwm = new FreeWriteManager(this.canvasFree, this.setting, 9);
        this.canvasFree.addEventListener("click", function (e) { return _this.onMouseClick(e); });
        // お絵描きモード用イベント
        this.canvasFree.addEventListener("mousedown", function (e) { return _this.onMouseDown(e); });
        this.canvasFree.addEventListener("mouseup", function (e) { return _this.onMouseUp(e); });
        this.canvasFree.addEventListener("mousemove", function (e) { return _this.onMouseMove(e); });
        this.ckDrawMode.addEventListener("change", function (e) { return _this.Fwm.clearAll(); });
        this.ckCandidateMode.addEventListener("change", function (e) { return _this.gcm.clearAll(); });
        // 再描画
        this.btnNew.addEventListener("click", function (e) { return _this.new(e); });
        // 再描画
        var btnRenew = document.getElementById("btn_renew");
        btnRenew.addEventListener("click", function (e) { return _this.renew(e); });
        // 待った
        var btnBack = document.getElementById("btn_back");
        btnBack.addEventListener("click", function (e) { return _this.mattta(e); });
        // 棋譜読み込み
        var btnKifuRead = document.getElementById("btn_bkifu_read");
        btnKifuRead.addEventListener("click", function (e) { return _this.onClickKifuRead(e); });
    }
    Main.prototype.onMouseMove = function (e) {
        if (this.ckDrawMode.checked) {
            this.Fwm.draw(e.offsetX, e.offsetY);
        }
    };
    Main.prototype.onMouseDown = function (e) {
        if (this.ckDrawMode.checked) {
            this.Fwm.start();
        }
    };
    Main.prototype.onMouseUp = function (e) {
        if (this.ckDrawMode.checked) {
            this.Fwm.stop();
        }
    };
    Main.prototype.onClickKifuRead = function (e) {
        var kifu = this.inpKifu.value;
        this.gim.viewFromKifu(kifu);
    };
    /**
     *
     * @param e
     */
    Main.prototype.onMouseClick = function (e) {
        if (this.ckDrawMode.checked) {
            // 描画モードの場合
            return;
        }
        if (this.ckOnOkiishiMode.checked) {
            this.gim.addOkiIshi(e.offsetX, e.offsetY);
            return;
        }
        if (this.ckCandidateMode.checked) {
            this.gcm.addCandidate(e.offsetX, e.offsetY, "1");
            return;
        }
        this.gim.chakushu(e.offsetX, e.offsetY);
        var spnTeban = document.getElementById("spnTeban");
        spnTeban.innerHTML = this.gim.turn;
    };
    /**
     * 再描画イベント用
     * @param e
     */
    Main.prototype.new = function (e) {
        var rosu = parseInt(this.slRosu.options[this.slRosu.selectedIndex].value, 10);
        this.gbm = new GoBoadManager(this.canvas, this.setting, rosu);
        this.gim = new GoishiManager(this.canvasIshi, this.setting, rosu, GoLogger.getInstance(this.inpKifu));
    };
    Main.prototype.mattta = function (e) {
        this.gim.chakushBack();
    };
    Main.prototype.renew = function (e) {
        this.gim.viewFromKifu(this.inpKifu.value);
    };
    return Main;
}());
// Mainクラスを実行する。
window.addEventListener("load", function () { return new Main(); });
