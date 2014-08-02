var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var UpdatePrimitive = require("./UpdatePrimitive");

var ReplaceInArray = (function (_super) {
    __extends(ReplaceInArray, _super);
    function ReplaceInArray(target, position, item) {
        _super.call(this, target);
        this.position = position;
        this.item = item;
    }
    ReplaceInArray.prototype.apply = function (store) {
        var item = store.get(this.target);
        item[this.position] = this.item;
        return this;
    };
    return ReplaceInArray;
})(UpdatePrimitive);

module.exports = ReplaceInArray;
//# sourceMappingURL=ReplaceInArray.js.map
