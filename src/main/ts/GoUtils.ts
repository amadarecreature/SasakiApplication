import { GoMoveType, GoStoneColor, PointerPosition, GoBoadInfo, PositionOnGoBoad } from "./GoSetting";

export class GoStoneUtil {

    /**
     * 碁盤上での位置左上から数えた路数
     * @param x 
     * @param y 
     */
    public static calcPositionOnGoban(position: PointerPosition, goBoadInfo: GoBoadInfo): PositionOnGoBoad {
        const top = goBoadInfo.top;
        const left = goBoadInfo.left;
        console.log(`boad:${top}:${left}`)

        const x0 = position.x - left;
        // 1区画の半分先までは、手前の路数として判断する
        const xRo = Math.floor((x0 + (goBoadInfo.roHeight / 2)) / goBoadInfo.roWidth) - 1;

        const y0 = position.y - top;
        // 1区画の半分先までは、手前の路数として判断する
        const yRo = Math.floor((y0 + (goBoadInfo.roHeight / 2)) / goBoadInfo.roHeight) - 1;

        // console.info("ro=" + xRo + ":" + yRo);


        return new PositionOnGoBoad(xRo, yRo);
    }


    static calcStoneColor(move: GoMoveType): GoStoneColor {
        if (move == GoMoveType.BLACK) {
            return GoStoneColor.BLACK;
        }
        if (move == GoMoveType.WHITE) {
            return GoStoneColor.WHITE;
        }

        if (move == GoMoveType.OKI_BLACK) {
            return GoStoneColor.BLACK;
        }
        if (move == GoMoveType.OKI_WHITE) {
            return GoStoneColor.WHITE;
        }
        return GoStoneColor.NONE;
    }
    /**
     * 今の着手から次のターンの着手を求める。
     * アゲハマの場合は変更しない為、NONEを返す
     * @param nowTurn 
     * @returns default:GoMoveType.NONE
     */
    static nextTurn(nowTurn: GoMoveType) {
        if (nowTurn == GoMoveType.BLACK) {
            return GoMoveType.WHITE;
        }
        if (nowTurn == GoMoveType.WHITE) {
            return GoMoveType.BLACK
        }

        if (nowTurn == GoMoveType.OKI_BLACK) {
            return GoMoveType.WHITE;
        }
        if (nowTurn == GoMoveType.OKI_WHITE) {
            return GoMoveType.BLACK;
        }

        return null;
    }
}