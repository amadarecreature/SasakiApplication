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
        this.target.innerHTML = value;
    };
    return GoLogger;
}());
export { GoLogger };
