import ReplaceInArray from "../primitives/ReplaceInArray";
import PUL from "../PUL";
import UPComposition from "./UPComposition";

export default class ReplaceInArrayComposition extends UPComposition {
    constructor(d0: PUL) {
        super(d0);
    }

    compose(u: ReplaceInArray): ReplaceInArrayComposition {
        throw new Error("Not implemented yet");
    }
}
