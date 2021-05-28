import { ImLogger } from "./common/AppLogger";

export class GoLogger implements ImLogger {
    private static instance: GoLogger;
    private constructor(target: HTMLElement) {
        // do something construct...
        this.target = target;
    }

    readonly target: HTMLElement;
    static getInstance(target: HTMLElement) {
        if (!GoLogger.instance) {
            GoLogger.instance = new GoLogger(target);
            // ... any one time initialization goes here ...
        }
        return GoLogger.instance;
    }
    public error(value: string) { };
    public info(value: string) {

        if (this.target instanceof HTMLInputElement) {
            const t = <HTMLInputElement>this.target;
            t.value = value;
            return;
        }
        if (this.target instanceof HTMLLabelElement) {
            const t = <HTMLLabelElement>this.target;
            t.innerHTML = value;
            return;
        }

        throw new Error("this element isn't the target　types.");
    }

}
