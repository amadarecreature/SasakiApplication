import { GoMoveType, KifuPart, GoStoneColor } from "./GoSetting";

enum KifuBlockComponent {
    POS_START = "[",
    POS_END = "]"
}
enum PositionWord {
    a = 1, b = 2, c = 3,
    d = 4, e = 5, f = 6,
    g = 7, h = 8, i = 9,
    j = 10, k = 11, l = 12,
    m = 13, n = 14, o = 15,
    p = 16, q = 17, r = 18,
    s = 19, t = 20, u = 21,
    v = 22, w = 23, x = 24,
    y = 25, z = 26,

}
/**
 * 棋譜操作用のユーティリティ
 */
export class KifuUtil {


    /**
     * 色指定で強制的に石を置いた場合の棋譜
     * 
     * @param color 
     * @returns 置き石の棋譜(色ごと)、該当しない場合は「なし」を返却
     */
    static convertHandicapMoveFromColor(color: GoStoneColor) {
        if (color == GoStoneColor.BLACK) {
            return GoMoveType.OKI_BLACK;
        }
        if (color == GoStoneColor.WHITE) {
            return GoMoveType.OKI_WHITE
        }
        throw GoMoveType.NONE;
    }
    static getPositionNo(alphabet: string): number {
        const list = Object.keys(PositionWord);
        for (const key in list) {
            if (PositionWord[key] == alphabet) {
                const num = Number(key);
                return num;
            }
            // console.log("key:" + key);
        }
        return 0;
    }

    /**
     * 位置をアルファベットに変換する処理が後々必要
     */
    static convertFromString(inputKifu: string): KifuPart[] {

        const part01 = KifuBlockComponent.POS_START;
        const part02 = KifuBlockComponent.POS_END;

        // ')'で区切って1手単位にする。
        const valueList = inputKifu.split(part02);
        // console.log(inputKifu);
        const result = new Array();

        // 1手単位に処理 ex) B(10,9
        for (let index = 0; index < valueList.length; index++) {

            const one_te = valueList[index];
            if (one_te == "") {
                // 最後のかっこの後に空白要素が追加される為、1件不要な要素が存在することになる。
                continue;
            }

            // 「(」の有無チェック
            if (one_te.indexOf(part01) == -1) {
                throw new Error("value:" + one_te + ",reason:'" + part01 + "' is nothing.");
            }

            const one_te_parts = one_te.split(part01);
            const color: string = one_te_parts[0];
            const positionText: string = one_te_parts[1];

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

            const x: string = positionText.slice(0, 1).toLowerCase();
            const y: string = positionText.slice(1, 2).toLowerCase();

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

    }
    /**
     * 
     * @param kifuList 
     */
    static convertToString(kifuList: KifuPart[]): string {
        const part01 = KifuBlockComponent.POS_START;
        const part02 = KifuBlockComponent.POS_END;

        var result = "";
        for (let index = 0; index < kifuList.length; index++) {
            const kifu = kifuList[index];

            const type = kifu.color;

            // 一手を分析
            let posX: string;
            let posY: string;
            if (kifu.isPassed) {
                posX = "t";
                posY = "t";
            } else {
                posX = PositionWord[kifu.position.roX + 1];
                posY = PositionWord[kifu.position.roY + 1];
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
    }


    public static convertMoveToColor(chakushu: GoMoveType): GoStoneColor {
        if (chakushu == GoMoveType.BLACK) {
            return GoStoneColor.BLACK;
        }
        if (chakushu == GoMoveType.WHITE) {
            return GoStoneColor.WHITE;
        }
        if (chakushu == GoMoveType.OKI_BLACK) {
            return GoStoneColor.BLACK;
        }
        if (chakushu == GoMoveType.OKI_WHITE) {
            return GoStoneColor.WHITE;
        }
        return GoStoneColor.NONE;
    }

}
