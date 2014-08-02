var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var _ = require("lodash");
var UpdatePrimitive = require("./UpdatePrimitive");

var DeleteFromObject = (function (_super) {
    __extends(DeleteFromObject, _super);
    function DeleteFromObject(target, keys) {
        _super.call(this, target);
        this.keys = keys;
    }
    DeleteFromObject.prototype.merge = function (udp) {
        this.keys = _.uniq(this.keys.concat(udp.keys));
        return this;
    };

    DeleteFromObject.prototype.apply = function (store) {
        var item = store.get(this.target);
        this.keys.forEach(function (key) {
            delete item[key];
        });
        return this;
    };
    return DeleteFromObject;
})(UpdatePrimitive);

module.exports = DeleteFromObject;
//# sourceMappingURL=DeleteFromObject.js.map
