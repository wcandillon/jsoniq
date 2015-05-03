import ASTNode = require("./ASTNode");
import Position = require("./Position");

class TerminalASTNode extends ASTNode {

    private value: string;

    constructor(name: string, parent: ASTNode, position: Position, value: string) {
        super(name, parent, position);
        this.value = value;
    }

    getValue(): string {
        return this.value;
    }

    setValue(value: string): TerminalASTNode {
        this.value = value;
        return this;
    }
}

export = TerminalASTNode;
