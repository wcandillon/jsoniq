import DeleteFromArray from "../primitives/DeleteFromArray";
import PUL from "../PUL";
import UPComposition from "./UPComposition";

export default class DeleteFromArrayComposition extends UPComposition {
    constructor(d0: PUL) {
        super(d0);
    }

    compose(u: DeleteFromArray): DeleteFromArrayComposition {
        throw new Error("Not implemented yet");
    }
}
