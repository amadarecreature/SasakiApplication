var GoLogger = /** @class */ (function () {
    function GoLogger(target) {
        // do something construct...
        this.target = target;
    }
    GoLogger.getInstance = function (target) {
        if (!GoLogger.instance) {
            GoLogger.instance = new GoLogger(target);
            // ... any one time initialization goes here ...
        }
        return GoLogger.instance;
    };
    GoLogger.prototype.log = function (value) {
        if (this.target instanceof HTMLInputElement) {
            var t = this.target;
            t.value = value;
            return;
        }
        if (this.target instanceof HTMLLabelElement) {
            var t = this.target;
            t.innerHTML = value;
            return;
        }
        throw new Error("this element isn't the target　types.");
    };
    return GoLogger;
}());
export { GoLogger };
