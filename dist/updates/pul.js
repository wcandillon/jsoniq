var _ = require("lodash");

var InsertIntoObject = require("./primitives/InsertIntoObject");
var InsertIntoArray = require("./primitives/InsertIntoArray");
var DeleteFromObject = require("./primitives/DeleteFromObject");
var DeleteFromArray = require("./primitives/DeleteFromArray");
var ReplaceInObject = require("./primitives/ReplaceInObject");
var ReplaceInArray = require("./primitives/ReplaceInArray");
var RenameInObject = require("./primitives/RenameInObject");

var PUL = (function () {
    function PUL() {
        this.insertIntoObjectList = [];
        this.insertIntoArrayList = [];
        this.deleteFromObjectList = [];
        this.deleteFromArrayList = [];
        this.replaceInObjectList = [];
        this.replaceInArrayList = [];
        this.renameInObjectList = [];
    }
    PUL.prototype.parse = function (pul) {
        var that = this;
        var newPul = JSON.parse(pul);
        newPul.insertIntoObjectList.forEach(function (udp) {
            that.insertIntoObject(udp.target, udp.pairs);
        });
        newPul.insertIntoArrayList.forEach(function (udp) {
            that.insertIntoArray(udp.target, udp.position, udp.items);
        });
        newPul.deleteFromObjectList.forEach(function (udp) {
            that.deleteFromObject(udp.target, udp.keys);
        });
        newPul.replaceInObjectList.forEach(function (udp) {
            that.replaceInObject(udp.target, udp.key, udp.item);
        });
        newPul.deleteFromArrayList.forEach(function (udp) {
            that.deleteFromArray(udp.target, udp.position);
        });
        newPul.replaceInArrayList.forEach(function (udp) {
            that.replaceInArray(udp.target, udp.position, udp.item);
        });
        newPul.renameInObjectList.forEach(function (udp) {
            that.renameInObject(udp.target, udp.key, udp.newKey);
        });
        return this;
    };

    PUL.prototype.serialize = function () {
        return JSON.stringify(this);
    };

    PUL.prototype.apply = function (store) {
        this.normalize();

        _.forEach(this.replaceInObjectList, function (udp) {
            udp.apply(store);
        });

        _.forEach(this.deleteFromObjectList, function (udp) {
            udp.apply(store);
        });

        _.forEach(this.renameInObjectList, function (udp) {
            udp.apply(store);
        });

        _.forEach(this.insertIntoObjectList, function (udp) {
            udp.apply(store);
        });

        _.sortBy(this.replaceInArrayList, "position");
        _.forEach(this.replaceInArrayList, function (udp) {
            udp.apply(store);
        });

        _.sortBy(this.deleteFromArrayList, "position");
        _.forEach(this.deleteFromArrayList, function (udp) {
            udp.apply(store);
        });

        _.sortBy(this.insertIntoArrayList, "position");
        _.forEach(this.insertIntoArrayList, function (udp) {
            udp.apply(store);
        });

        return this;
    };

    PUL.prototype.normalize = function () {
        var that = this;

        _.forEach(this.deleteFromArrayList, function (udp) {
            _.remove(that.replaceInArrayList, { target: udp.target, position: udp.position });
        });

        _.forEach(this.deleteFromObjectList, function (udp) {
            _.forEach(udp.keys, function (key) {
                _.remove(that.replaceInObjectList, { target: udp.target, key: key });
                _.remove(that.renameInObjectList, { target: udp.target, key: key });
            });
        });
        return this;
    };

    PUL.prototype.insertIntoObject = function (target, pairs) {
        var newUdp = new InsertIntoObject(target, pairs);

        var udp = _.find(this.insertIntoObjectList, { target: target });
        if (udp) {
            udp.merge(newUdp);
        } else {
            this.insertIntoObjectList.push(newUdp);
        }
        return this;
    };

    PUL.prototype.insertIntoArray = function (target, position, items) {
        var newUdp = new InsertIntoArray(target, position, items);

        var udp = _.find(this.insertIntoArrayList, { target: target, position: position });
        if (udp) {
            udp.merge(newUdp);
        } else {
            this.insertIntoArrayList.push(newUdp);
        }
        return this;
    };

    PUL.prototype.deleteFromObject = function (target, keys) {
        var newUdp = new DeleteFromObject(target, keys);

        var udp = _.find(this.deleteFromObjectList, { target: target });
        if (udp) {
            udp.merge(newUdp);
        } else {
            this.deleteFromObjectList.push(newUdp);
        }
        return this;
    };

    PUL.prototype.deleteFromArray = function (target, position) {
        var newUdp = new DeleteFromArray(target, position);

        var udp = _.find(this.deleteFromArrayList, { target: target, position: position });
        if (!udp) {
            this.deleteFromArrayList.push(newUdp);
        }
        return this;
    };

    PUL.prototype.replaceInArray = function (target, position, item) {
        var newUdp = new ReplaceInArray(target, position, item);

        var udp = _.find(this.replaceInArrayList, { target: target, position: position });
        if (udp) {
            throw new jerr.JNUP0009();
        } else {
            this.replaceInArrayList.push(newUdp);
        }
        return this;
    };

    PUL.prototype.replaceInObject = function (target, key, item) {
        var newUdp = new ReplaceInObject(target, key, item);

        var udp = _.find(this.replaceInObjectList, { target: target, key: key });
        if (udp) {
            throw new jerr.JNUP0009();
        } else {
            this.replaceInObjectList.push(newUdp);
        }
        return this;
    };

    PUL.prototype.renameInObject = function (target, key, newKey) {
        var newUdp = new RenameInObject(target, key, newKey);

        var udp = _.find(this.renameInObjectList, { target: target, key: key });
        if (udp) {
            throw new jerr.JNUP0009();
        } else {
            this.renameInObjectList.push(newUdp);
        }
        return this;
    };
    return PUL;
})();

module.exports = PUL;
//# sourceMappingURL=PUL.js.map
