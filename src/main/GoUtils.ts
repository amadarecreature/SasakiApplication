import { GoTebanType, KifuPart } from "./GoSetting";

export class KifuUtil {
    /**
     * 位置をアルファベットに変換する処理が後々必要
     */

    static readonly part01 = "[";
    static readonly part02 = "]";
    static readonly part03 = ",";

    static convertFromString(inputKifu: string): KifuPart[] {



        // ')'で区切って1手単位にする。
        const valueList = inputKifu.split(this.part02);
        console.log(inputKifu);
        const result = new Array();

        // 1手単位に処理 ex) B(10,9
        for (let index = 0; index < valueList.length; index++) {

            const one_te = valueList[index];
            if (one_te == "") {
                // 最後の「)」の後に空白要素が追加される為、1件不要な要素が存在することになる。
                continue;
            }

            // 「(」の有無チェック
            if (one_te.indexOf(this.part01) == -1) {
                throw new Error("value:" + one_te + ",reason:'" + this.part01 + "' is nothing.");
            }

            const one_te_parts = one_te.split(this.part01);
            const color: string = one_te_parts[0];
            const positionText: string = one_te_parts[1];

            // console.log("color:" + color);
            // console.log("positionText:" + positionText);

            // カンマチェック
            if (positionText.indexOf(",") == -1) {
                throw new Error("value:" + one_te + ",reason:There is no '" + this.part03 + "'.");
            }

            const positions = positionText.split(this.part03);

            const x: string = positions[0];
            const y: string = positions[1];

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

    }
    /**
     * TODO 実装する
     * @param kifuList 
     */
    static convertToString(kifuList: KifuPart[]): string {
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
                posX = kifu.position.roX.toString()
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
    }

}