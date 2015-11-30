import Position from "./parsers/Position";

export default class Marker {

    private position: Position;
    private type: string;
    private level: string;
    private message: string;

    constructor(position: Position, type: string, level: string, message: string) {
        this.position = position;
        this.type = type;
        this.level = level;
        this.message = message;
    }

    getPosition(): Position {
        return this.position;
    }

    getType(): string {
        return this.type;
    }

    getLevel(): string {
        return this.level;
    }

    getMessage(): string {
        return this.message;
    }
}
