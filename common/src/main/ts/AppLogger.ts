export interface ImLogger {
    info(value: String): void;
    error(value: String): void;
}
export enum EnumLoggerMode {
    debug,
    info,
    error,

}
export class AppLogger implements ImLogger {
    readonly enumLoggerMode: EnumLoggerMode;
    constructor(mode: EnumLoggerMode) {
        this.enumLoggerMode = mode;
    }
    public info(value: String): void {
        throw new Error("Method not implemented.");
    }
    public error(value: String): void {
        throw new Error("Method not implemented.");
    }

}