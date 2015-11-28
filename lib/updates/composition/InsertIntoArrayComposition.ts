import InsertIntoArray from "../primitives/InsertIntoArray";
import PUL from "../PUL";
import UPComposition from "./UPComposition";


export default class InsertIntoArrayComposition extends UPComposition {
    constructor(d0: PUL) {
        super(d0);
    }

    compose(u: InsertIntoArray): InsertIntoArrayComposition {
        throw new Error("Not implemented yet");
    }
}
