var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var jerr;
(function (jerr) {
    var Error = (function () {
        function Error(code, message) {
            this.code = code;
            this.message = message;
        }
        return Error;
    })();
    jerr.Error = Error;

    var DynamicError = (function (_super) {
        __extends(DynamicError, _super);
        function DynamicError(code, message) {
            _super.call(this, code, message);
        }
        return DynamicError;
    })(Error);
    jerr.DynamicError = DynamicError;

    var StaticError = (function (_super) {
        __extends(StaticError, _super);
        function StaticError(code, message) {
            _super.call(this, code, message);
        }
        return StaticError;
    })(Error);
    jerr.StaticError = StaticError;

    var JNUP0005 = (function (_super) {
        __extends(JNUP0005, _super);
        function JNUP0005() {
            _super.call(this, "JNUP0005", "It is a dynamic error if a pending update list contains two inserting update primitives on the same object and pair name.");
        }
        return JNUP0005;
    })(DynamicError);
    jerr.JNUP0005 = JNUP0005;

    var JNUP0009 = (function (_super) {
        __extends(JNUP0009, _super);
        function JNUP0009() {
            _super.call(this, "JNUP0009", "It is a dynamic error if a pending update list contains two JSON replacing update primitives on the same object or array, and with the same selector.");
        }
        return JNUP0009;
    })(DynamicError);
    jerr.JNUP0009 = JNUP0009;
})(jerr || (jerr = {}));
//# sourceMappingURL=errors.js.map
