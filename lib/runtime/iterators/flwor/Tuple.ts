import Iterator = require("../Iterator");

interface Tuple {
    [key: string]: Iterator;
}

export = Tuple;
