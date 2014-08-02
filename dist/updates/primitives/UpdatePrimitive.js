var UpdatePrimitive = (function () {
    function UpdatePrimitive(target) {
        this.target = target;
    }
    UpdatePrimitive.prototype.apply = function (store) {
        throw new Error("This method is abstract");
    };

    UpdatePrimitive.prototype.merge = function (udp) {
        throw new Error("This method is abstract");
    };

    UpdatePrimitive.prototype.inverse = function (store) {
        throw new Error("This method is abstract");
    };
    return UpdatePrimitive;
})();

module.exports = UpdatePrimitive;
//# sourceMappingURL=UpdatePrimitive.js.map
