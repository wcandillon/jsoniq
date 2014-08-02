var uuid = require("node-uuid");
var PUL = require("../updates/PUL");

var MemoryStore = (function () {
    function MemoryStore() {
        this.pul = new PUL();
        this.items = {};
    }
    MemoryStore.prototype.getTarget = function (ref, ordPath) {
        return [ref, ordPath.join(".")].join(":");
    };

    MemoryStore.prototype.find = function (item, ordPath) {
        if (ordPath.length === 0) {
            return item;
        } else {
            return this.find(item[ordPath[0]], ordPath.slice(1));
        }
    };

    MemoryStore.prototype.get = function (ref) {
        var segments = ref.split(":");
        var target = segments[0];
        var ordPath = segments[1] ? segments[1].split(".") : [];
        var result = this.find(this.items[target], ordPath);
        if (result) {
            return result;
        } else {
            throw new Error("Item not found: " + ref);
        }
    };

    MemoryStore.prototype.put = function (item, ref) {
        ref = ref ? ref : uuid.v4();
        this.items[ref] = item;
        return ref;
    };

    MemoryStore.prototype.insertIntoObject = function (ref, ordPath, pairs) {
        var target = this.getTarget(ref, ordPath);
        this.pul.insertIntoObject(target, pairs);
        return this;
    };

    MemoryStore.prototype.insertIntoArray = function (ref, ordPath, position, items) {
        var target = this.getTarget(ref, ordPath);
        this.pul.insertIntoArray(target, position, items);
        return this;
    };

    MemoryStore.prototype.deleteFromObject = function (ref, ordPath, keys) {
        var target = this.getTarget(ref, ordPath);
        this.pul.deleteFromObject(target, keys);
        return this;
    };

    MemoryStore.prototype.deleteFromArray = function (ref, ordPath, position) {
        var target = this.getTarget(ref, ordPath);
        this.pul.deleteFromArray(target, position);
        return this;
    };

    MemoryStore.prototype.replaceInArray = function (ref, ordPath, position, item) {
        var target = this.getTarget(ref, ordPath);
        this.pul.replaceInArray(target, position, item);
        return this;
    };

    MemoryStore.prototype.replaceInObject = function (ref, ordPath, key, item) {
        var target = this.getTarget(ref, ordPath);
        this.pul.replaceInObject(target, key, item);
        return this;
    };

    MemoryStore.prototype.renameInObject = function (ref, ordPath, key, newKey) {
        var target = this.getTarget(ref, ordPath);
        this.pul.renameInObject(target, key, newKey);
        return this;
    };

    MemoryStore.prototype.commit = function () {
        this.pul.apply(this);
        return this;
    };
    return MemoryStore;
})();

module.exports = MemoryStore;
//# sourceMappingURL=MemoryStore.js.map
