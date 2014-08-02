var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var UpdatePrimitive = require("./UpdatePrimitive");

var DeleteFromArray = (function (_super) {
    __extends(DeleteFromArray, _super);
    function DeleteFromArray(target, position) {
        _super.call(this, target);
        this.position = position;
    }
    DeleteFromArray.prototype.apply = function (store) {
        var item = store.get(this.target);
        item.splice(this.position, 1);
        return this;
    };
    return DeleteFromArray;
})(UpdatePrimitive);

module.exports = DeleteFromArray;
//# sourceMappingURL=DeleteFromArray.js.map
