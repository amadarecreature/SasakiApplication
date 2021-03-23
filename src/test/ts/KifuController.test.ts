import { GoMoveType, KifuPart } from "../../main/ts/GoSetting";
import { KifuUtil } from "../../main/ts/KifuController";

describe("KifuUtil_convertFromString", () => {
    describe("正常ケース", () => {
        it("0手", () => {
            const input = "";
            const actual = KifuUtil.convertFromString(input);
            expect(actual).toEqual([]);

        })

        it("一手", () => {
            const input = "B[eg]";

            const actual = KifuUtil.convertFromString(input);
            expect(actual).toEqual([new KifuPart(GoMoveType.BLACK, 5, 7)]);
        })
        test("複数手", () => {
            const input = "W[id]B[eg]";

            const actual = KifuUtil.convertFromString(input);
            expect(actual).toEqual([new KifuPart(GoMoveType.WHITE, 9, 4), new KifuPart(GoMoveType.BLACK, 5, 7)]);

        })
        test("複数手、2桁混合", () => {
            const input = "B[eo]W[ss]B[qg]";

            const actual = KifuUtil.convertFromString(input);
            expect(actual).toEqual([
                new KifuPart(GoMoveType.BLACK, 5, 15),
                new KifuPart(GoMoveType.WHITE, 19, 19),
                new KifuPart(GoMoveType.BLACK, 17, 7)
            ]);

        })

    })
    describe("異常ケース", () => {
        it("(なし_2番目", () => {
            const input = "B[eo]Wss]B[qg]";
            expect(() => {
                KifuUtil.convertFromString(input);
            }).toThrow("value:Wss,reason:'[' is nothing.");
        })
        it("(なし_3番目", () => {
            const input = "B[eo]W[ss]Bqg]";
            expect(() => {
                KifuUtil.convertFromString(input);
            }).toThrow("value:Bqg,reason:'[' is nothing.");
        })
        it("BWなし_最初", () => {
            const input = "[eo]W[ss]B[qg]";
            expect(() => {
                KifuUtil.convertFromString(input)
            }).toThrow("value:[eo,reason:The Color is not either B or W.");
        })
        it("BWなし_途中", () => {
            const input = "B[eo][ss]B[qg]";
            expect(() => {
                KifuUtil.convertFromString(input)
            }).toThrow("value:[ss,reason:The Color is not either B or W.");
        })
        it("位置指定が3つ", () => {
            const input = "B[oke]W[ie]B[ps]";
            expect(() => {
                KifuUtil.convertFromString(input)
            }).toThrow("value:B[oke,reason:There is not 2 position values.");
        })

    })

})
describe("KifuUtil_getPositionNo", () => {
    describe("正常系", () => {
        it("a", () => {
            const actual = KifuUtil.getPositionNo("a");
            expect(actual).toBe(1);
        })
        it("z", () => {
            const actual = KifuUtil.getPositionNo("z");
            expect(actual).toBe(26);
        })
    })
})

describe("KifuUtil_convertToString", () => {
    describe("正常系", () => {
        it("1手", () => {
            const input = [new KifuPart(GoMoveType.BLACK, 9, 11)];
            const actual = KifuUtil.convertToString(input);
            expect(actual).toBe("B[jl]");
        })
        it("2手", () => {
            const input = [
                new KifuPart(GoMoveType.WHITE, 0, 12),
                new KifuPart(GoMoveType.BLACK, 9, 11)
            ];
            const actual = KifuUtil.convertToString(input);
            expect(actual).toBe("W[am]B[jl]");
        })
        it("一部パス", () => {
            const input = [
                new KifuPart(GoMoveType.BLACK, 9, 11),
                new KifuPart(GoMoveType.WHITE, 2, 3, true),
                new KifuPart(GoMoveType.BLACK, 18, 0),
            ];
            const actual = KifuUtil.convertToString(input);
            expect(actual).toBe("B[jl]W[tt]B[sa]");
        })
        it("連続パス", () => {
            const input = [
                new KifuPart(GoMoveType.BLACK, 9, 11, true),
                new KifuPart(GoMoveType.WHITE, 2, 3, true),
                new KifuPart(GoMoveType.BLACK, 18, 0),
            ];
            const actual = KifuUtil.convertToString(input);
            expect(actual).toBe("B[tt]W[tt]B[sa]");
        })
    })
}
);