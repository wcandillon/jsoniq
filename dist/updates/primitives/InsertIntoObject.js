var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var _ = require("lodash");
var UpdatePrimitive = require("./UpdatePrimitive");

var InsertIntoObject = (function (_super) {
    __extends(InsertIntoObject, _super);
    function InsertIntoObject(target, pairs) {
        _super.call(this, target);
        this.pairs = pairs;
    }
    InsertIntoObject.prototype.merge = function (udp) {
        var keys = Object.keys(this.pairs);
        var newKeys = Object.keys(udp.pairs);
        var intersection = _.intersection(keys, newKeys);

        if (intersection.length > 0) {
            throw new jerr.JNUP0005();
        } else {
            _.merge(this.pairs, udp.pairs);
        }
        return this;
    };

    InsertIntoObject.prototype.apply = function (store) {
        var item = store.get(this.target);
        var that = this;
        Object.keys(this.pairs).forEach(function (key) {
            item[key] = that.pairs[key];
        });
        return this;
    };
    return InsertIntoObject;
})(UpdatePrimitive);

module.exports = InsertIntoObject;
//# sourceMappingURL=InsertIntoObject.js.map
