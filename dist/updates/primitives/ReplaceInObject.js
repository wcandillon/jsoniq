var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var UpdatePrimitive = require("./UpdatePrimitive");

var ReplaceInObject = (function (_super) {
    __extends(ReplaceInObject, _super);
    function ReplaceInObject(target, key, item) {
        _super.call(this, target);
        this.key = key;
        this.item = item;
    }
    ReplaceInObject.prototype.apply = function (store) {
        var item = store.get(this.target);
        item[this.key] = this.item;
        return this;
    };
    return ReplaceInObject;
})(UpdatePrimitive);

module.exports = ReplaceInObject;
//# sourceMappingURL=ReplaceInObject.js.map
