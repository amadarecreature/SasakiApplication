import { GoTebanType, KifuPart } from "../main/GoSetting";
import { KifuUtil } from "../main/GoUtils";
describe("KifuUtil_convertFromString", () => {

    describe("正常ケース", () => {
        it("0手", () => {
            const input = "";
            const actual = KifuUtil.convertFromString(input);
            expect(actual).toEqual([]);

        })

        it("一手", () => {
            const input = "B[5,7]";

            const actual = KifuUtil.convertFromString(input);
            expect(actual).toEqual([new KifuPart(GoTebanType.BLACK, 5, 7)]);
        })
        test("複数手", () => {
            const input = "W[9,4]B[5,7]";

            const actual = KifuUtil.convertFromString(input);
            expect(actual).toEqual([new KifuPart(GoTebanType.WHITE, 9, 4), new KifuPart(GoTebanType.BLACK, 5, 7)]);

        })
        test("複数手、2桁混合", () => {
            const input = "B[5,15]W[19,19]B[17,7]";

            const actual = KifuUtil.convertFromString(input);
            expect(actual).toEqual([
                new KifuPart(GoTebanType.BLACK, 5, 15),
                new KifuPart(GoTebanType.WHITE, 19, 19),
                new KifuPart(GoTebanType.BLACK, 17, 7)
            ]);

        })

    })
    describe("異常ケース", () => {
        it("(なし_2番目", () => {
            const input = "B[5,15]W19,19]B[17,7]";
            expect(() => {
                KifuUtil.convertFromString(input);
            }).toThrow("value:W19,19,reason:'[' is nothing.");
        })
        it("(なし_3番目", () => {
            const input = "B[5,15]W[19,19]B17,7]";
            expect(() => {
                KifuUtil.convertFromString(input);
            }).toThrow("value:B17,7,reason:'[' is nothing.");
        })
        it("BWなし_最初", () => {
            const input = "[5,15]W[19,19]B[17,7]";
            expect(() => {
                KifuUtil.convertFromString(input)
            }).toThrow("value:[5,15,reason:The Color is not either B or W.");
        })
        it("BWなし_途中", () => {
            const input = "B[5,15][19,19]B[17,7]";
            expect(() => {
                KifuUtil.convertFromString(input)
            }).toThrow("value:[19,19,reason:The Color is not either B or W.");
        })
        it("カンマなし_途中", () => {
            const input = "B[5,15]W[1919]B[17,7]";
            expect(() => {
                KifuUtil.convertFromString(input)
            }).toThrow("value:W[1919,reason:There is no ','.");
        })

    })

})



describe("KifuUtil_convertToString", () => {
    describe("正常系", () => {
        it("1手", () => {
            const input = [new KifuPart(GoTebanType.BLACK, 10, 12)];
            const actual = KifuUtil.convertToString(input);
            expect(actual).toBe("B[10,12]");
        })
        it("2手", () => {
            const input = [
                new KifuPart(GoTebanType.WHITE, 1, 13),
                new KifuPart(GoTebanType.BLACK, 10, 12)
            ];
            const actual = KifuUtil.convertToString(input);
            expect(actual).toBe("W[1,13]B[10,12]");
        })
        it("正常系パス", () => {
            const input = [
                new KifuPart(GoTebanType.BLACK, 10, 12),
                new KifuPart(GoTebanType.WHITE, 3, 4, true),
                new KifuPart(GoTebanType.BLACK, 19, 1),
            ];
            const actual = KifuUtil.convertToString(input);
            expect(actual).toBe("B[10,12]W[t,t]B[19,1]");
        })
    })
}
);