import Iterator = require("../Iterator");

class Tuple {
    private tuple: { [key: string]: Iterator } = {};

    getVariable(varName: string): Iterator {
        return this.tuple[varName];
    }

    getVariableNames(): string[] {
        return Object.keys(this.tuple);
    }

    addVariable(varName: string, it: Iterator): Tuple {
        this.tuple[varName] = it;
        return this;
    }

    clone(): Tuple {
        var tuple = new Tuple();
        this.getVariableNames().forEach(varName => {
            tuple.addVariable(varName, this.getVariable(varName));
        });
        return tuple;
    }
}

export = Tuple;
