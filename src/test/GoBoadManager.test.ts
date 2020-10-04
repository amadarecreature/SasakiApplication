import { GoBoadInfo, GoBoadSetting } from "../main/GoSetting";
import { GoBoadManager } from "../main/GoBoardMagnager";


describe('Name of the group', () => {
    it('should ', () => {
        const canvasE = new HTMLCanvasElement();
        const goSetting = new GoBoadSetting(10, 20, 1, 5);
        const goBoadInfo = new GoBoadInfo(goSetting.roHW, goSetting.roHW, goSetting.gobanLeft, goSetting.gobanTop, 19);

        const gbm = new GoBoadManager(canvasE, goSetting, 19);
        const context = canvasE.getContext("2d")!;
        gbm.drowKoushi(context, goBoadInfo, 30, 40, 50, 60, 70);
        console.log(context.getImageData(canvasE.offsetLeft,canvasE.offsetTop,canvasE.offsetWidth,canvasE.offsetHeight));
    });
});
