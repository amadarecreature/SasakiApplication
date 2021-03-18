import { GoBoadInfo, GoBoadSetting, GoMoveType } from "../main/GoSetting";
import { GoBoadManager } from "../main/GoBoardManager";
import { GoStoneManager } from "../main/GoStoneManager"
import { JSDOM } from "jsdom";

describe('GoStoneManager', () => {
    it('着手×3 アゲハマ 着手×1', () => {
        const roSize = 5; const gobanTop = 10; const gobanLeft = 20;

        const goSetting = new GoBoadSetting(gobanTop, 20, 1, roSize);

        // prepare
        const dummyCanvas: HTMLCanvasElement = createCanvas("dcv1");
        const dummyInstance = new GoStoneManager(dummyCanvas, goSetting, 19);

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
        const actualRealtimePosition = expectStoneFromRealTimePosition(dummyInstance.realtimePosition);
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
        const dummyCanvas: HTMLCanvasElement = createCanvas("dcv1");
        const dummyInstance = new GoStoneManager(dummyCanvas, goSetting, 19);
        // set expected
        const expectedKifu: string = "B[kl]W[ji]B[cn]";
        const expRealtimePosition: string = "B[x=2:y=13]W[x=9:y=8]B[x=10:y=11]"
        const expNowCount: number = 2;
        const expNextTurn: GoMoveType = GoMoveType.WHITE;
        const expAgehamaB = 0;
        const expAgehamaW = 0;

        // execute
        const canvas: HTMLCanvasElement = createCanvas("cv1");
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 10, gobanTop + 2.5 + roSize * 11);
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 9, gobanTop + 2.5 + roSize * 8);
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 2, gobanTop + 2.5 + roSize * 13);
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 13, gobanTop + 2.5 + roSize * 2);
        dummyInstance.matta();

        // check
        expect(dummyInstance.kifuString).toEqual(expectedKifu);
        const actualRealtimePosition = expectStoneFromRealTimePosition(dummyInstance.realtimePosition);
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
        const dummyCanvas: HTMLCanvasElement = createCanvas("dcv1");
        const dummyInstance = new GoStoneManager(dummyCanvas, goSetting, 19);

        // set expected
        const expected: string = "B[kl]W[ji]B[cn]W[nc]XAGB[kl]";
        const expRealtimePosition: string = "B[x=2:y=13]W[x=9:y=8]W[x=13:y=2]"
        const expNowCount: number = 4;
        const expNextTurn: GoMoveType = GoMoveType.BLACK;
        const expAgehamaB = 1;
        const expAgehamaW = 0;

        // execute
        const canvas: HTMLCanvasElement = createCanvas("cv1");
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 10, gobanTop + 2.5 + roSize * 11);
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 9, gobanTop + 2.5 + roSize * 8);
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 2, gobanTop + 2.5 + roSize * 13);
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 13, gobanTop + 2.5 + roSize * 2);
        dummyInstance.getAgehama(gobanLeft + 2.5 + roSize * 10, gobanTop + 2.5 + roSize * 11);

        // check
        expect(dummyInstance.kifuString).toEqual(expected);
        const actualRealtimePosition = expectStoneFromRealTimePosition(dummyInstance.realtimePosition);
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
        const dummyCanvas: HTMLCanvasElement = createCanvas("dcv1");
        const dummyInstance = new GoStoneManager(dummyCanvas, goSetting, 19);

        // set expected
        const expected: string = "B[kl]W[ji]B[cn]W[nc]";
        const expRealtimePosition: string = "B[x=2:y=13]W[x=9:y=8]B[x=10:y=11]W[x=13:y=2]"
        const expNowCount: number = 3;
        const expNextTurn: GoMoveType = GoMoveType.BLACK;
        const expAgehamaB = 0;
        const expAgehamaW = 0;

        // execute
        const canvas: HTMLCanvasElement = createCanvas("cv1");
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 10, gobanTop + 2.5 + roSize * 11);
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 9, gobanTop + 2.5 + roSize * 8);
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 2, gobanTop + 2.5 + roSize * 13);
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 13, gobanTop + 2.5 + roSize * 2);
        dummyInstance.getAgehama(gobanLeft + 2.5 + roSize * 9, gobanTop + 2.5 + roSize * 8); // 白
        dummyInstance.matta();

        // check
        expect(dummyInstance.kifuString).toEqual(expected);
        const actualRealtimePosition = expectStoneFromRealTimePosition(dummyInstance.realtimePosition);
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
        const dummyCanvas: HTMLCanvasElement = createCanvas("dcv1");
        const dummyInstance = new GoStoneManager(dummyCanvas, goSetting, 19);

        // set expected
        const expected: string = "B[kl]W[ji]B[dn]W[nc]XAGW[ji]B[ji]";
        const expRealtimePosition: string = "B[x=3:y=13]B[x=9:y=8]B[x=10:y=11]W[x=13:y=2]"
        const expNowCount: number = 5;
        const expNextTurn: GoMoveType = GoMoveType.WHITE;
        const expAgehamaB = 0;
        const expAgehamaW = 1;

        // execute
        const canvas: HTMLCanvasElement = createCanvas("cv1");
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 10, gobanTop + 2.5 + roSize * 11);
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 9, gobanTop + 2.5 + roSize * 8);
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 3, gobanTop + 2.5 + roSize * 13);
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 13, gobanTop + 2.5 + roSize * 2);
        dummyInstance.getAgehama(gobanLeft + 2.5 + roSize * 9, gobanTop + 2.5 + roSize * 8); // 白
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 9, gobanTop + 2.5 + roSize * 8); // 黒

        // check
        expect(dummyInstance.kifuString).toEqual(expected);
        const actualRealtimePosition = expectStoneFromRealTimePosition(dummyInstance.realtimePosition);
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
        const dummyCanvas: HTMLCanvasElement = createCanvas("dcv1");

        const dummyInstance = new GoStoneManager(dummyCanvas, goSetting, 19);
        // set expected
        const expected: string = "B[kl]W[ji]B[cn]";
        const expRealtimePosition: string = "B[x=2:y=13]W[x=9:y=8]B[x=10:y=11]"
        const expNowCount: number = 2;
        const expNextTurn: GoMoveType = GoMoveType.WHITE;
        const expAgehamaB = 0;
        const expAgehamaW = 1;

        // execute
        const canvas: HTMLCanvasElement = createCanvas("cv1");
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 10, gobanTop + 2.5 + roSize * 11);
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 9, gobanTop + 2.5 + roSize * 8);
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 2, gobanTop + 2.5 + roSize * 13);
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 13, gobanTop + 2.5 + roSize * 2);
        dummyInstance.getAgehama(gobanLeft + 2.5 + roSize * 9, gobanTop + 2.5 + roSize * 8); // 白
        dummyInstance.matta();
        dummyInstance.matta();

        // check
        expect(dummyInstance.kifuString).toEqual(expected);
        const actualRealtimePosition = expectStoneFromRealTimePosition(dummyInstance.realtimePosition);
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
        const dummyCanvas: HTMLCanvasElement = createCanvas("dcv1");

        const dummyInstance = new GoStoneManager(dummyCanvas, goSetting, 19);
        // set expected
        const expected: string = "B[kl]W[ji]B[cn]W[he]";
        const expRealtimePosition: string = "B[x=2:y=13]W[x=7:y=4]W[x=9:y=8]B[x=10:y=11]"
        const expNowCount: number = 3;
        const expNextTurn: GoMoveType = GoMoveType.BLACK;
        const expAgehamaB = 0;
        const expAgehamaW = 1;

        // execute
        const canvas: HTMLCanvasElement = createCanvas("cv1");
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 10, gobanTop + 2.5 + roSize * 11);
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 9, gobanTop + 2.5 + roSize * 8);
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 2, gobanTop + 2.5 + roSize * 13);
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 13, gobanTop + 2.5 + roSize * 2);
        dummyInstance.getAgehama(gobanLeft + 2.5 + roSize * 9, gobanTop + 2.5 + roSize * 8); // 白
        dummyInstance.matta();
        dummyInstance.matta();
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 7, gobanTop + 2.5 + roSize * 4);

        // check
        expect(dummyInstance.kifuString).toEqual(expected);
        const actualRealtimePosition = expectStoneFromRealTimePosition(dummyInstance.realtimePosition);
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
        const dummyCanvas: HTMLCanvasElement = createCanvas("dcv1");

        const dummyInstance = new GoStoneManager(dummyCanvas, goSetting, 19);
        // set expected
        const expected: string = "B[kl]W[ji]B[cn]W[nc]XAGW[ji]B[he]";
        const expRealtimePosition: string = "B[x=2:y=13]B[x=7:y=4]B[x=10:y=11]W[x=13:y=2]"
        const expNowCount: number = 5;
        const expNextTurn: GoMoveType = GoMoveType.WHITE;
        const expAgehamaB = 0;
        const expAgehamaW = 1;

        // execute
        const canvas: HTMLCanvasElement = createCanvas("cv1");
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 10, gobanTop + 2.5 + roSize * 11);
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 9, gobanTop + 2.5 + roSize * 8);
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 2, gobanTop + 2.5 + roSize * 13);
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 13, gobanTop + 2.5 + roSize * 2);
        dummyInstance.getAgehama(gobanLeft + 2.5 + roSize * 9, gobanTop + 2.5 + roSize * 8); // 白
        dummyInstance.getAgehama(gobanLeft + 2.5 + roSize * 13, gobanTop + 2.5 + roSize * 2); // 白
        dummyInstance.getAgehama(gobanLeft + 2.5 + roSize * 13, gobanTop + 2.5 + roSize * 2); // 白
        dummyInstance.matta();
        dummyInstance.chakushu(gobanLeft + 2.5 + roSize * 7, gobanTop + 2.5 + roSize * 4);


        // check
        expect(dummyInstance.kifuString).toEqual(expected);
        const actualRealtimePosition = expectStoneFromRealTimePosition(dummyInstance.realtimePosition);
        expect(actualRealtimePosition).toEqual(expRealtimePosition);
        expect(dummyInstance.nowCount).toEqual(expNowCount);
        expect(dummyInstance.nextTurn).toEqual(expNextTurn);
        expect(dummyInstance.agehamaB).toEqual(expAgehamaB);
        expect(dummyInstance.agehamaW).toEqual(expAgehamaW);

    });
    // 最後のカッコ
});



function expectStoneFromRealTimePosition(tmp3: GoMoveType[][]) {
    var actual3 = "";
    for (let x = 0; x < tmp3.length; x++) {
        const line = tmp3[x];
        for (let y = 0; y < line.length; y++) {
            const color: GoMoveType = line[y];
            if (color != GoMoveType.NONE) {
                actual3 += color + "[x=" + x + ":y=" + y + "]";
            }
        }
    }
    return actual3;
}

function createCanvas(id: string) {
    const dummyJsdom = new JSDOM("<html><canvas id='" + id + "' style='width:20px,height:20px'></canvas></html>");
    const dummyCanvas: HTMLCanvasElement = <HTMLCanvasElement>dummyJsdom.window.document.getElementById(id);
    return dummyCanvas;
}

