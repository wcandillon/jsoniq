import QName from "./QName";
import Position from "./parsers/Position";

export default class Variable extends QName {

    private type: string;
    private position: Position;

    constructor(position: Position, type: string, qname: QName) {
        super(qname.getPrefix(), qname.getURI(), qname.getLocalName());
        this.type = type;
        this.position = position;
    }

    getType(): string {
        return this.type;
    }

    getPosition(): Position {
        return this.position;
    }
}
