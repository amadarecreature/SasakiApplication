import { GoMoveType, GoStoneColor, PointerPosition, GoBoadInfo, PositionOnGoBoad } from "./GoSetting";
export class CommonCanvasUtil {
    public static drawText(context: CanvasRenderingContext2D, text: string, baseX: number, baseY: number) {
        //座標を指定して文字を描く（座標は画像の中心に）
        context.fillText(text, baseX, baseY);
    }
}

export class GoBoardCanvasUtil {
    /**
     * 太さと色を指定して罫線を引ける
     * @param context 
     * @param goBoadInfo 
     * @param lineWidth 
     * @param lineColor 
     */
    public static drawKeisenH(context: CanvasRenderingContext2D, goBoadInfo: GoBoadInfo, lineWidth: number, lineColor: string) {
        context.beginPath();
        context.fillStyle = lineColor;
        for (var col = 0; col < goBoadInfo.roCount; col++) {
            // 外枠の太い部分の半分から計算を始める。
            const startX1 = goBoadInfo.areaLeft + lineWidth + (col * goBoadInfo.roHeight);
            context.rect(startX1, goBoadInfo.areaTop, lineWidth, goBoadInfo.areaHeight);
        }
        context.fill();
    }

    public static drawKeisenOutsideH(goBoadInfo: GoBoadInfo, context: CanvasRenderingContext2D) {
        const koushiLeft = goBoadInfo.areaLeft;
        const verticalStartY = goBoadInfo.areaTop;
        const verticalLength = goBoadInfo.areaHeight;
        const outOfAreaLength = goBoadInfo.areaLeft - goBoadInfo.left;
        const lineWidth = goBoadInfo.keisenWidth;
        context.beginPath();
        // 外枠の太線を追加する
        // 左端
        context.rect(koushiLeft, verticalStartY, lineWidth, verticalLength);
        // 右端
        context.rect(goBoadInfo.left + (goBoadInfo.width - outOfAreaLength), verticalStartY, lineWidth, verticalLength);
        context.fill();
    }
    public static drawKeisenV(context: CanvasRenderingContext2D, keisenColor: string, goBoadInfo: GoBoadInfo, lineWidth: number) {
        context.beginPath();
        context.fillStyle = keisenColor;

        // 基本の横線
        for (var row = 0; row < goBoadInfo.roCount; row++) {
            // 外枠の太い部分の半分から計算を始める。
            const y1 = goBoadInfo.areaTop + lineWidth + (row * goBoadInfo.roWidth);
            context.rect(goBoadInfo.areaLeft, y1, goBoadInfo.areaWidth, lineWidth);
        }
        context.fill();
    }

    public static drawKeisenOutsideV(context: CanvasRenderingContext2D, goBoadInfo: GoBoadInfo, lineWidth: number) {
        context.beginPath();

        const horizontalLength = goBoadInfo.areaWidth;
        const horizontalStartX = goBoadInfo.areaLeft;
        const koushiTop = goBoadInfo.areaTop;
        const outOfAreaLength = goBoadInfo.areaLeft - goBoadInfo.left;

        // 外枠の太線を追加する
        // 上端
        context.rect(horizontalStartX, koushiTop, horizontalLength, lineWidth);
        // 下端
        context.rect(horizontalStartX, goBoadInfo.top + (goBoadInfo.height - outOfAreaLength), horizontalLength, lineWidth);
        context.fill();
    }

}
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
export class KifuUtil {
    static toAlphabet(index: number): string {
        const alphabet = "abcdefghijklmnopqrstuvwxyz";
        if (index >= 1 && index <= 26) {
            return alphabet.charAt(index - 1);
        } else {
            return "";
        }
    }
}
