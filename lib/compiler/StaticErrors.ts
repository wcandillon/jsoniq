import _ = require("lodash");
import Marker = require("./Marker");
import Position = require("./parsers/Position");

class StaticError extends Marker {
    constructor(pos: Position, code: string, message: string) {
        message = _.template("[<%= code %>]: <%= message %>")({ code: code, message: message });
        super(pos, "error", "error", message);
    }
}

export class XPST0081 extends StaticError {

    constructor(pos: Position, prefix: string) {
        var message = _.template("'<%= prefix %>': can not expand prefix of lexical QName to namespace URI")({ prefix: prefix });
        super(pos, "XPST0081", message);
    }
}
