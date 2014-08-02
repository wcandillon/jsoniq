var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var UpdatePrimitive = require("./UpdatePrimitive");

var RenameInObject = (function (_super) {
    __extends(RenameInObject, _super);
    function RenameInObject(target, key, newKey) {
        _super.call(this, target);
        this.key = key;
        this.newKey = newKey;
    }
    RenameInObject.prototype.apply = function (store) {
        var item = store.get(this.target);
        item[this.newKey] = item[this.key];
        delete item[this.key];
        return this;
    };
    return RenameInObject;
})(UpdatePrimitive);

module.exports = RenameInObject;
//# sourceMappingURL=RenameInObject.js.map
