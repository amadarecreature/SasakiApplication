import { GoTebanType, KifuPart } from "./GoSetting";
var KifuUtil = /** @class */ (function () {
    function KifuUtil() {
    }
    KifuUtil.convertFromString = function (inputKifu) {
        // ')'で区切って1手単位にする。
        var valueList = inputKifu.split(this.part02);
        console.log(inputKifu);
        var result = new Array();
        // 1手単位に処理 ex) B(10,9
        for (var index = 0; index < valueList.length; index++) {
            var one_te = valueList[index];
            if (one_te == "") {
                // 最後の「)」の後に空白要素が追加される為、1件不要な要素が存在することになる。
                continue;
            }
            // 「(」の有無チェック
            if (one_te.indexOf(this.part01) == -1) {
                throw new Error("value:" + one_te + ",reason:'" + this.part01 + "' is nothing.");
            }
            var one_te_parts = one_te.split(this.part01);
            var color = one_te_parts[0];
            var positionText = one_te_parts[1];
            // console.log("color:" + color);
            // console.log("positionText:" + positionText);
            // カンマチェック
            if (positionText.indexOf(",") == -1) {
                throw new Error("value:" + one_te + ",reason:There is no '" + this.part03 + "'.");
            }
            var positions = positionText.split(this.part03);
            var x = positions[0];
            var y = positions[1];
            // console.log("xy:" + x + y);
            // 色チェック
            if (color == "W") {
                result.push(new KifuPart(GoTebanType.WHITE, Number(x), Number(y)));
                console.log("convertFromString:" + GoTebanType.WHITE);
                continue;
            }
            if (color == "B") {
                result.push(new KifuPart(GoTebanType.BLACK, Number(x), Number(y)));
                console.log("convertFromString:" + GoTebanType.BLACK);
                continue;
            }
            // 色がBWのどちらでもなければ
            throw new Error("value:" + one_te + ",reason:The Color is not either B or W.");
        }
        return result;
    };
    /**
     * TODO 実装する
     * @param kifuList
     */
    KifuUtil.convertToString = function (kifuList) {
        var result = "";
        for (var index = 0; index < kifuList.length; index++) {
            var kifu = kifuList[index];
            var type = kifu.color;
            // 一手を分析
            var posX = void 0;
            var posY = void 0;
            if (kifu.isPassed) {
                posX = "t";
                posY = "t";
            }
            else {
                posX = kifu.position.roX.toString();
                posY = kifu.position.roY.toString();
            }
            // 結果を更新
            result += kifu.color;
            result += this.part01;
            result += posX;
            result += this.part03;
            result += posY;
            result += this.part02;
        }
        return result;
    };
    /**
     * 位置をアルファベットに変換する処理が後々必要
     */
    KifuUtil.part01 = "[";
    KifuUtil.part02 = "]";
    KifuUtil.part03 = ",";
    return KifuUtil;
}());
export { KifuUtil };
