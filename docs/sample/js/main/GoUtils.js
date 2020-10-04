import { GoMoveType, KifuPart } from "./GoSetting";
var PositionWord;
(function (PositionWord) {
    PositionWord[PositionWord["a"] = 1] = "a";
    PositionWord[PositionWord["b"] = 2] = "b";
    PositionWord[PositionWord["c"] = 3] = "c";
    PositionWord[PositionWord["d"] = 4] = "d";
    PositionWord[PositionWord["e"] = 5] = "e";
    PositionWord[PositionWord["f"] = 6] = "f";
    PositionWord[PositionWord["g"] = 7] = "g";
    PositionWord[PositionWord["h"] = 8] = "h";
    PositionWord[PositionWord["i"] = 9] = "i";
    PositionWord[PositionWord["j"] = 10] = "j";
    PositionWord[PositionWord["k"] = 11] = "k";
    PositionWord[PositionWord["l"] = 12] = "l";
    PositionWord[PositionWord["m"] = 13] = "m";
    PositionWord[PositionWord["n"] = 14] = "n";
    PositionWord[PositionWord["o"] = 15] = "o";
    PositionWord[PositionWord["p"] = 16] = "p";
    PositionWord[PositionWord["q"] = 17] = "q";
    PositionWord[PositionWord["r"] = 18] = "r";
    PositionWord[PositionWord["s"] = 19] = "s";
    PositionWord[PositionWord["t"] = 20] = "t";
    PositionWord[PositionWord["u"] = 21] = "u";
    PositionWord[PositionWord["v"] = 22] = "v";
    PositionWord[PositionWord["w"] = 23] = "w";
    PositionWord[PositionWord["x"] = 24] = "x";
    PositionWord[PositionWord["y"] = 25] = "y";
    PositionWord[PositionWord["z"] = 26] = "z";
})(PositionWord || (PositionWord = {}));
var KifuParts;
(function (KifuParts) {
    KifuParts["POS_START"] = "[";
    KifuParts["POS_END"] = "]";
})(KifuParts || (KifuParts = {}));
var KifuUtil = /** @class */ (function () {
    function KifuUtil() {
    }
    KifuUtil.getPositionNo = function (alphabet) {
        var list = Object.keys(PositionWord);
        for (var key in list) {
            if (PositionWord[key] == alphabet) {
                var num = Number(key);
                return num;
            }
            // console.log("key:" + key);
        }
        return 0;
    };
    KifuUtil.convertFromString = function (inputKifu) {
        var part01 = KifuParts.POS_START;
        var part02 = KifuParts.POS_END;
        // ')'で区切って1手単位にする。
        var valueList = inputKifu.split(part02);
        // console.log(inputKifu);
        var result = new Array();
        // 1手単位に処理 ex) B(10,9
        for (var index = 0; index < valueList.length; index++) {
            var one_te = valueList[index];
            if (one_te == "") {
                // 最後のかっこの後に空白要素が追加される為、1件不要な要素が存在することになる。
                continue;
            }
            // 「(」の有無チェック
            if (one_te.indexOf(part01) == -1) {
                throw new Error("value:" + one_te + ",reason:'" + part01 + "' is nothing.");
            }
            var one_te_parts = one_te.split(part01);
            var color = one_te_parts[0];
            var positionText = one_te_parts[1];
            // console.log("color:" + color);
            // console.log("positionText:" + positionText);
            // カンマチェック
            // if (positionText.indexOf(",") == -1) {
            //     throw new Error("value:" + one_te + ",reason:There is no '" + this.part03 + "'.");
            // }
            if (positionText.length != 2) {
                throw new Error("value:" + one_te + ",reason:There is not 2 position values.");
            }
            // const positions = positionText.split(this.part03);
            var x = positionText.slice(0, 1);
            var y = positionText.slice(1, 2);
            // console.log("xy:" + x + y);
            // 色チェック
            if (color == "W") {
                result.push(new KifuPart(GoMoveType.WHITE, this.getPositionNo(x), this.getPositionNo(y)));
                // console.log("convertFromString:" + GoTebanType.WHITE);
                continue;
            }
            if (color == "B") {
                result.push(new KifuPart(GoMoveType.BLACK, this.getPositionNo(x), this.getPositionNo(y)));
                // console.log("convertFromString:" + GoTebanType.BLACK);
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
        var part01 = KifuParts.POS_START;
        var part02 = KifuParts.POS_END;
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
                posX = PositionWord[kifu.position.roX];
                posY = PositionWord[kifu.position.roY];
            }
            // 結果を更新
            result += kifu.color;
            result += part01;
            result += posX;
            // result += this.part03;
            result += posY;
            result += part02;
        }
        return result;
    };
    /**
     * 位置をアルファベットに変換する処理が後々必要
     */
    KifuUtil.part03 = ",";
    return KifuUtil;
}());
export { KifuUtil };
