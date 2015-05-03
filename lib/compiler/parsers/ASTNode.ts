import Position = require("./Position");

class ASTNode {

    private name: string;
    private parent: ASTNode;
    private position: Position;

    constructor(name: string, parent: ASTNode, position: Position) {
        this.name = name;
        this.parent = parent;
        this.position = position;
    }

    getName(): string {
        return this.name;
    }

    getParent(): ASTNode {
        return this.parent;
    }

    getPosition(): Position {
        return this.position;
    }
}

export = ASTNode;
