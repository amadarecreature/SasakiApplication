export class GoLogger implements Logger {
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
    public log(value: string) {
        this.target.innerHTML = value;
    }

}
export interface Logger {
    log(value: String): void;
}