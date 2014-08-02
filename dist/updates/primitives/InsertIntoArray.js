var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var UpdatePrimitive = require("./UpdatePrimitive");

var InsertIntoArray = (function (_super) {
    __extends(InsertIntoArray, _super);
    function InsertIntoArray(target, position, items) {
        _super.call(this, target);
        this.position = position;
        this.items = items;
    }
    InsertIntoArray.prototype.merge = function (udp) {
        this.items.concat(udp.items);
        return this;
    };

    InsertIntoArray.prototype.apply = function (store) {
        var item = store.get(this.target);
        var that = this;
        this.items.forEach(function (i) {
            item.splice(that.position, 0, i);
        });
        return this;
    };
    return InsertIntoArray;
})(UpdatePrimitive);

module.exports = InsertIntoArray;
//# sourceMappingURL=InsertIntoArray.js.map
