import { GoBoadSetting, GoMoveType, GoStoneColor } from "../../main/ts/GoSetting";
import { GoStoneManager, GoStoneUtil } from "../../main/ts/GoStoneManager"
import { JSDOM } from "jsdom";

describe('GoStoneManager', () => {
    it('着手×3 アゲハマ 着手×1', () => {
        const roSize = 5; const gobanTop = 10; const gobanLeft = 20;
        const goSetting = new GoBoadSetting(gobanTop, gobanLeft, 1, roSize);

        // prepare
        const dummyInstance = new GoStoneManager(tCreateCanvas("dcv1"), goSetting, 19);

        // set result
        const expKifu: string = "B[kl]W[ji]B[cn]XAGW[ji]W[nc]";
        const expRealtimePosition: string = "B[x=2:y=13]B[x=10:y=11]W[x=13:y=2]"
        const expNowCount: number = 4;
        const expNextTurn: GoMoveType = GoMoveType.BLACK;
        const expAgehamaB = 0;
        const expAgehamaW = 1;
        // execute
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 10, gobanTop + 2.5 + roSize * 11);
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 9, gobanTop + 2.5 + roSize * 8);
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 2, gobanTop + 2.5 + roSize * 13);
        dummyInstance.getAgehama(gobanLeft + 2.5 + roSize * 9, gobanTop + 2.5 + roSize * 8); // 白
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 13, gobanTop + 2.5 + roSize * 2);

        // check
        expect(dummyInstance.kifuString).toEqual(expKifu);
        const actualRealtimePosition = tExpStringFromRTPos(dummyInstance.realtimePosition);
        expect(actualRealtimePosition).toEqual(expRealtimePosition);
        expect(dummyInstance.nowCount).toEqual(expNowCount);
        expect(dummyInstance.nextTurn).toEqual(expNextTurn);
        expect(dummyInstance.agehamaB).toEqual(expAgehamaB);
        expect(dummyInstance.agehamaW).toEqual(expAgehamaW);


    });
    it('着手×4 & matta', () => {

        const roSize = 5; const gobanTop = 10; const gobanLeft = 20;
        const goSetting = new GoBoadSetting(gobanTop, gobanLeft, 1, roSize);

        // prepare
        const dummyInstance = new GoStoneManager(tCreateCanvas("dcv1"), goSetting, 19);
        // set expected
        const expectedKifu: string = "B[kl]W[ji]B[cn]";
        const expRealtimePosition: string = "B[x=2:y=13]W[x=9:y=8]B[x=10:y=11]"
        const expNowCount: number = 2;
        const expNextTurn: GoMoveType = GoMoveType.WHITE;
        const expAgehamaB = 0;
        const expAgehamaW = 0;

        // execute
        tExecuteChakushu(dummyInstance, gobanLeft, roSize, gobanTop, 10, 11);
        tExecuteChakushu(dummyInstance, gobanLeft, roSize, gobanTop, 9, 8);
        tExecuteChakushu(dummyInstance, gobanLeft, roSize, gobanTop, 2, 13);
        tExecuteChakushu(dummyInstance, gobanLeft, roSize, gobanTop, 13, 2);
        dummyInstance.matta();

        // check
        expect(dummyInstance.kifuString).toEqual(expectedKifu);
        const actualRealtimePosition = tExpStringFromRTPos(dummyInstance.realtimePosition);
        expect(actualRealtimePosition).toEqual(expRealtimePosition);
        expect(dummyInstance.nowCount).toEqual(expNowCount);
        expect(dummyInstance.nextTurn).toEqual(expNextTurn);
        expect(dummyInstance.agehamaB).toEqual(expAgehamaB);
        expect(dummyInstance.agehamaW).toEqual(expAgehamaW);

    });
    it('着手×4 & アゲハマ ', () => {

        const roSize = 5; const gobanTop = 10; const gobanLeft = 20;
        const goSetting = new GoBoadSetting(gobanTop, gobanLeft, 1, roSize);

        // prepare
        const dummyInstance = new GoStoneManager(tCreateCanvas("dcv1"), goSetting, 19);

        // set expected
        const expected: string = "B[kl]W[ji]B[cn]W[nc]XAGB[kl]";
        const expRealtimePosition: string = "B[x=2:y=13]W[x=9:y=8]W[x=13:y=2]"
        const expNowCount: number = 4;
        const expNextTurn: GoMoveType = GoMoveType.BLACK;
        const expAgehamaB = 1;
        const expAgehamaW = 0;

        // execute
        tExecuteChakushu(dummyInstance, gobanLeft, roSize, gobanTop, 10, 11);
        tExecuteChakushu(dummyInstance, gobanLeft, roSize, gobanTop, 9, 8);
        tExecuteChakushu(dummyInstance, gobanLeft, roSize, gobanTop, 2, 13);
        tExecuteChakushu(dummyInstance, gobanLeft, roSize, gobanTop, 13, 2);
        tExecuteAgehama(dummyInstance, gobanLeft, roSize, gobanTop, 10, 11); // 白
        // dummyInstance.getAgehama(gobanLeft + 2.5 + roSize * 10, gobanTop + 2.5 + roSize * 11);

        // check
        expect(dummyInstance.kifuString).toEqual(expected);
        const actualRealtimePosition = tExpStringFromRTPos(dummyInstance.realtimePosition);
        expect(actualRealtimePosition).toEqual(expRealtimePosition);
        expect(dummyInstance.nowCount).toEqual(expNowCount);
        expect(dummyInstance.nextTurn).toEqual(expNextTurn);
        expect(dummyInstance.agehamaB).toEqual(expAgehamaB);
        expect(dummyInstance.agehamaW).toEqual(expAgehamaW);

    });
    it('着手×4 & アゲハマ & matta ', () => {

        const roSize = 5; const gobanTop = 10; const gobanLeft = 20;
        const goSetting = new GoBoadSetting(gobanTop, gobanLeft, 1, roSize);

        // prepare
        const dummyInstance = new GoStoneManager(tCreateCanvas("dcv1"), goSetting, 19);

        // set expected
        const expKifu: string = "B[kl]W[ji]B[cn]W[nc]";
        const expRealtimePosition: string = "B[x=2:y=13]W[x=9:y=8]B[x=10:y=11]W[x=13:y=2]"
        const expNowCount: number = 3;
        const expNextTurn: GoMoveType = GoMoveType.BLACK;
        const expAgehamaB = 0;
        const expAgehamaW = 0;

        // execute
        tExecuteChakushu(dummyInstance, gobanLeft, roSize, gobanTop, 10, 11);
        tExecuteChakushu(dummyInstance, gobanLeft, roSize, gobanTop, 9, 8);
        tExecuteChakushu(dummyInstance, gobanLeft, roSize, gobanTop, 2, 13);
        tExecuteChakushu(dummyInstance, gobanLeft, roSize, gobanTop, 13, 2);
        tExecuteAgehama(dummyInstance, gobanLeft, roSize, gobanTop, 9, 8);
        // dummyInstance.getAgehama(gobanLeft + 2.5 + roSize * 9, gobanTop + 2.5 + roSize * 8); // 白
        dummyInstance.matta();

        // check
        expect(dummyInstance.kifuString).toEqual(expKifu);
        const actualRealtimePosition = tExpStringFromRTPos(dummyInstance.realtimePosition);
        expect(actualRealtimePosition).toEqual(expRealtimePosition);
        expect(dummyInstance.nowCount).toEqual(expNowCount);
        expect(dummyInstance.nextTurn).toEqual(expNextTurn);
        expect(dummyInstance.agehamaB).toEqual(expAgehamaB);
        expect(dummyInstance.agehamaW).toEqual(expAgehamaW);

    });
    it('着手×4 & アゲハマ & 再着手', () => {

        const roSize = 5; const gobanTop = 10; const gobanLeft = 20;
        const goSetting = new GoBoadSetting(gobanTop, gobanLeft, 1, roSize);

        // prepare
        const dummyInstance = new GoStoneManager(tCreateCanvas("dcv1"), goSetting, 19);

        // set expected
        const expected: string = "B[kl]W[ji]B[dn]W[nc]XAGW[ji]B[ji]";
        const expRealtimePosition: string = "B[x=3:y=13]B[x=9:y=8]B[x=10:y=11]W[x=13:y=2]"
        const expNowCount: number = 5;
        const expNextTurn: GoMoveType = GoMoveType.WHITE;
        const expAgehamaB = 0;
        const expAgehamaW = 1;

        // execute
        tExecuteChakushu(dummyInstance, gobanLeft, roSize, gobanTop, 10, 11);
        tExecuteChakushu(dummyInstance, gobanLeft, roSize, gobanTop, 9, 8);
        tExecuteChakushu(dummyInstance, gobanLeft, roSize, gobanTop, 3, 13);
        tExecuteChakushu(dummyInstance, gobanLeft, roSize, gobanTop, 13, 2);
        tExecuteAgehama(dummyInstance, gobanLeft, roSize, gobanTop, 9, 8); // 白
        tExecuteChakushu(dummyInstance, gobanLeft, roSize, gobanTop, 9, 8);

        // check
        expect(dummyInstance.kifuString).toEqual(expected);
        const actualRealtimePosition = tExpStringFromRTPos(dummyInstance.realtimePosition);
        expect(actualRealtimePosition).toEqual(expRealtimePosition);
        expect(dummyInstance.nowCount).toEqual(expNowCount);
        expect(dummyInstance.nextTurn).toEqual(expNextTurn);
        expect(dummyInstance.agehamaB).toEqual(expAgehamaB);
        expect(dummyInstance.agehamaW).toEqual(expAgehamaW);

    });
    it('着手×4 & アゲハマ & matta & matta ', () => {

        const roSize = 5; const gobanTop = 10; const gobanLeft = 20;

        const goSetting = new GoBoadSetting(gobanTop, gobanLeft, 1, roSize);

        // prepare
        const dummyInstance = new GoStoneManager(tCreateCanvas("dcv1"), goSetting, 19);

        // set expected
        const expected: string = "B[kl]W[ji]B[cn]";
        const expRealtimePosition: string = "B[x=2:y=13]W[x=9:y=8]B[x=10:y=11]"
        const expNowCount: number = 2;
        const expNextTurn: GoMoveType = GoMoveType.WHITE;
        const expAgehamaB = 0;
        const expAgehamaW = 0;

        // execute
        tExecuteChakushu(dummyInstance, gobanLeft, roSize, gobanTop, 10, 11);
        tExecuteChakushu(dummyInstance, gobanLeft, roSize, gobanTop, 9, 8);
        tExecuteChakushu(dummyInstance, gobanLeft, roSize, gobanTop, 2, 13);
        tExecuteChakushu(dummyInstance, gobanLeft, roSize, gobanTop, 13, 2);
        tExecuteAgehama(dummyInstance, gobanLeft, roSize, gobanTop, 9, 8); // 白
        dummyInstance.matta();
        dummyInstance.matta();

        // check
        expect(dummyInstance.kifuString).toEqual(expected);
        const actualRealtimePosition = tExpStringFromRTPos(dummyInstance.realtimePosition);
        expect(actualRealtimePosition).toEqual(expRealtimePosition);
        expect(dummyInstance.nowCount).toEqual(expNowCount);
        expect(dummyInstance.nextTurn).toEqual(expNextTurn);
        expect(dummyInstance.agehamaB).toEqual(expAgehamaB);
        expect(dummyInstance.agehamaW).toEqual(expAgehamaW);

    });
    it('着手×4 & アゲハマ & matta & matta & 着手', () => {

        const roSize = 5; const gobanTop = 10; const gobanLeft = 20;
        const goSetting = new GoBoadSetting(gobanTop, gobanLeft, 1, roSize);

        // prepare
        const dummyInstance = new GoStoneManager(tCreateCanvas("dcv1"), goSetting, 19);

        // set expected
        const expected: string = "B[kl]W[ji]B[cn]W[he]";
        const expRealtimePosition: string = "B[x=2:y=13]W[x=7:y=4]W[x=9:y=8]B[x=10:y=11]"
        const expNowCount: number = 3;
        const expNextTurn: GoMoveType = GoMoveType.BLACK;
        const expAgehamaB = 0;
        const expAgehamaW = 0;

        // execute
        tExecuteChakushu(dummyInstance, gobanLeft, roSize, gobanTop, 10, 11);
        tExecuteChakushu(dummyInstance, gobanLeft, roSize, gobanTop, 9, 8);
        tExecuteChakushu(dummyInstance, gobanLeft, roSize, gobanTop, 2, 13);
        tExecuteChakushu(dummyInstance, gobanLeft, roSize, gobanTop, 13, 2);
        tExecuteAgehama(dummyInstance, gobanLeft, roSize, gobanTop, 9, 8); // 白
        dummyInstance.matta();
        dummyInstance.matta();
        tExecuteChakushu(dummyInstance, gobanLeft, roSize, gobanTop, 7, 4);

        // check
        expect(dummyInstance.kifuString).toEqual(expected);
        const actualRealtimePosition = tExpStringFromRTPos(dummyInstance.realtimePosition);
        expect(actualRealtimePosition).toEqual(expRealtimePosition);
        expect(dummyInstance.nowCount).toEqual(expNowCount);
        expect(dummyInstance.nextTurn).toEqual(expNextTurn);
        expect(dummyInstance.agehamaB).toEqual(expAgehamaB);
        expect(dummyInstance.agehamaW).toEqual(expAgehamaW);

    });
    it('着手×4 & アゲハマ & アゲハマ & アゲハマミス(無いところ) & matta & 着手', () => {

        const roSize = 5; const gobanTop = 10; const gobanLeft = 20;
        const goSetting = new GoBoadSetting(gobanTop, gobanLeft, 1, roSize);

        // prepare
        const dummyInstance = new GoStoneManager(tCreateCanvas("dcv1"), goSetting, 19);

        // set expected
        const expKifu: string = "B[kl]W[ji]B[cn]W[nc]XAGW[ji]B[he]";
        const expRtPos: string = "B[x=2:y=13]B[x=7:y=4]B[x=10:y=11]W[x=13:y=2]"
        const expNowCount: number = 5;
        const expNextTurn: GoMoveType = GoMoveType.WHITE;
        const expAgehamaB = 0;
        const expAgehamaW = 1;

        // execute
        tExecuteChakushu(dummyInstance, gobanLeft, roSize, gobanTop, 10, 11);
        tExecuteChakushu(dummyInstance, gobanLeft, roSize, gobanTop, 9, 8);
        tExecuteChakushu(dummyInstance, gobanLeft, roSize, gobanTop, 2, 13);
        tExecuteChakushu(dummyInstance, gobanLeft, roSize, gobanTop, 13, 2);
        tExecuteAgehama(dummyInstance, gobanLeft, roSize, gobanTop, 9, 8); // 白
        tExecuteAgehama(dummyInstance, gobanLeft, roSize, gobanTop, 13, 2); // 白
        tExecuteAgehama(dummyInstance, gobanLeft, roSize, gobanTop, 13, 2); // 白
        dummyInstance.matta();
        tExecuteChakushu(dummyInstance, gobanLeft, roSize, gobanTop, 7, 4);

        // check
        expect(dummyInstance.kifuString).toEqual(expKifu);
        const actRtPos = tExpStringFromRTPos(dummyInstance.realtimePosition);
        expect(actRtPos).toEqual(expRtPos);
        expect(dummyInstance.nowCount).toEqual(expNowCount);
        expect(dummyInstance.nextTurn).toEqual(expNextTurn);
        expect(dummyInstance.agehamaB).toEqual(expAgehamaB);
        expect(dummyInstance.agehamaW).toEqual(expAgehamaW);

    });
    it('置き石(白) 置き石(黒) 置き石(白) 着手×2 置き石(白) 置き石(黒) ', () => {
        const roSize = 5; const gobanTop = 10; const gobanLeft = 20;
        const goSetting = new GoBoadSetting(gobanTop, gobanLeft, 1, roSize);

        // prepare
        const dummyInstance = new GoStoneManager(tCreateCanvas("dcv1"), goSetting, 19);

        // set result
        const expKifu: string = "AE[ac]AB[ba]AE[as]B[ji]W[cn]AE[fp]AB[sa]";
        const expRealtimePosition: string = "AE[x=0:y=2]AE[x=0:y=18]AB[x=1:y=0]W[x=2:y=13]AE[x=5:y=15]B[x=9:y=8]AB[x=18:y=0]"
        const expNowCount: number = 6;
        const expNextTurn: GoMoveType = GoMoveType.WHITE;
        const expAgehamaB = 0;
        const expAgehamaW = 0;
        // execute
        dummyInstance.addSpecifiedColorStone(gobanLeft + 2.5 + roSize * 0, gobanTop + 2.5 + roSize * 2, GoStoneColor.WHITE);
        dummyInstance.addSpecifiedColorStone(gobanLeft + 2.5 + roSize * 1, gobanTop + 2.5 + roSize * 0, GoStoneColor.BLACK);
        dummyInstance.addSpecifiedColorStone(gobanLeft + 2.5 + roSize * 0, gobanTop + 2.5 + roSize * 18, GoStoneColor.WHITE);
        tExecuteChakushu(dummyInstance, gobanLeft, roSize, gobanTop, 9, 8);
        tExecuteChakushu(dummyInstance, gobanLeft, roSize, gobanTop, 2, 13);
        dummyInstance.addSpecifiedColorStone(gobanLeft + 2.5 + roSize * 5, gobanTop + 2.5 + roSize * 15, GoStoneColor.WHITE);
        dummyInstance.addSpecifiedColorStone(gobanLeft + 2.5 + roSize * 18, gobanTop + 2.5 + roSize * 0, GoStoneColor.BLACK);

        // check
        expect(dummyInstance.kifuString).toEqual(expKifu);
        const actualRealtimePosition = tExpStringFromRTPos(dummyInstance.realtimePosition);
        expect(actualRealtimePosition).toEqual(expRealtimePosition);
        expect(dummyInstance.nowCount).toEqual(expNowCount);
        expect(dummyInstance.nextTurn).toEqual(expNextTurn);
        expect(dummyInstance.agehamaB).toEqual(expAgehamaB);
        expect(dummyInstance.agehamaW).toEqual(expAgehamaW);


    });

    it('置き石(白) アゲハマ ', () => {
        const roSize = 5; const gobanTop = 10; const gobanLeft = 20;
        const goSetting = new GoBoadSetting(gobanTop, gobanLeft, 1, roSize);

        // prepare
        const dummyInstance = new GoStoneManager(tCreateCanvas("dcv1"), goSetting, 19);

        // set result
        const expKifu: string = "AE[ac]XAGW[ac]AB[ac]XAGB[ac]";
        const expRealtimePosition: string = ""
        const expNowCount: number = 3;
        const expNextTurn: GoMoveType = GoMoveType.WHITE;
        const expAgehamaB = 1;
        const expAgehamaW = 1;
        // execute
        dummyInstance.addSpecifiedColorStone(gobanLeft + 2.5 + roSize * 0, gobanTop + 2.5 + roSize * 2, GoStoneColor.WHITE);
        tExecuteAgehama(dummyInstance, gobanLeft, roSize, gobanTop, 0, 2);
        dummyInstance.addSpecifiedColorStone(gobanLeft + 2.5 + roSize * 0, gobanTop + 2.5 + roSize * 2, GoStoneColor.BLACK);
        tExecuteAgehama(dummyInstance, gobanLeft, roSize, gobanTop, 0, 2);
        // check
        expect(dummyInstance.kifuString).toEqual(expKifu);
        const actualRealtimePosition = tExpStringFromRTPos(dummyInstance.realtimePosition);
        expect(actualRealtimePosition).toEqual(expRealtimePosition);
        expect(dummyInstance.nowCount).toEqual(expNowCount);
        expect(dummyInstance.nextTurn).toEqual(expNextTurn);
        expect(dummyInstance.agehamaB).toEqual(expAgehamaB);
        expect(dummyInstance.agehamaW).toEqual(expAgehamaW);


    });

    // 最後のカッコ
});
describe("nextTurn", () => {
    it("To BLACK", () => {
        expect(GoStoneUtil.nextTurn(GoMoveType.WHITE)).toEqual(GoMoveType.BLACK);
        expect(GoStoneUtil.nextTurn(GoMoveType.OKI_WHITE)).toEqual(GoMoveType.BLACK);

    })
    it("To WHITE", () => {
        expect(GoStoneUtil.nextTurn(GoMoveType.BLACK)).toEqual(GoMoveType.WHITE);
        expect(GoStoneUtil.nextTurn(GoMoveType.OKI_BLACK)).toEqual(GoMoveType.WHITE);

    })
    it("null", () => {
        expect(GoStoneUtil.nextTurn(GoMoveType.AGEHAMA_B)).toEqual(null);
        expect(GoStoneUtil.nextTurn(GoMoveType.AGEHAMA_W)).toEqual(null);
        expect(GoStoneUtil.nextTurn(GoMoveType.NONE)).toEqual(null);

    })
})

function tExecuteChakushu(dummyInstance: GoStoneManager, gobanLeft: number, roSize: number, gobanTop: number, x: number, y: number) {
    dummyInstance.chakushu(gobanLeft + 2.5 + roSize * x, gobanTop + 2.5 + roSize * y);
}

function tExecuteAgehama(dummyInstance: GoStoneManager, gobanLeft: number, roSize: number, gobanTop: number, x: number, y: number) {
    dummyInstance.getAgehama(gobanLeft + 2.5 + roSize * x, gobanTop + 2.5 + roSize * y);
}


function tExpStringFromRTPos(rtPos: GoMoveType[][]) {
    var actual3 = "";
    for (let x = 0; x < rtPos.length; x++) {
        const line = rtPos[x];
        for (let y = 0; y < line.length; y++) {
            const color: GoMoveType = line[y];
            if (color != GoMoveType.NONE) {
                actual3 += color + "[x=" + x + ":y=" + y + "]";
            }
        }
    }
    return actual3;
}

function tCreateCanvas(id: string) {
    const dummyJsdom = new JSDOM("<html><canvas id='" + id + "' style='width:20px,height:20px'></canvas></html>");
    const dummyCanvas: HTMLCanvasElement = <HTMLCanvasElement>dummyJsdom.window.document.getElementById(id);
    return dummyCanvas;
}

