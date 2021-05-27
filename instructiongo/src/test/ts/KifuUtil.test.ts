import { KifuUtil } from "../../main/ts/GoUtils";


describe('KifuUtil.toAlphabet', () => {
    it("anz", () => {
        expect(KifuUtil.toAlphabet(1)).toEqual("a");
        expect(KifuUtil.toAlphabet(14)).toEqual("n");
        expect(KifuUtil.toAlphabet(26)).toEqual("z");
    })
    it("out of range", () => {
        expect(KifuUtil.toAlphabet(0)).toEqual("");
        expect(KifuUtil.toAlphabet(27)).toEqual("");
    })

})