import Clause = require("./Clause");
import Tuple = require("./Tuple");

class RootClause extends Clause {

    constructor() {
        super(undefined);
    }

    pull(): Promise<Tuple> {
        if(this.closed) {
            return this.emptyTuple();
        }
        this.closed = true;
        return Promise.resolve({});
    }

    reset(): Clause {
        super.reset();
        return this;
    }
}

export = RootClause;
