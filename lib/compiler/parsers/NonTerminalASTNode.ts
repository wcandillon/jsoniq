import ASTNode = require("./ASTNode");
import Position = require("./Position");

class NonTerminalASTNode extends ASTNode {

    private children: ASTNode[];

    constructor(name: string, parent: ASTNode, position: Position, children: ASTNode[]) {
        super(name, parent, position);
        this.children = children;
    }

    getChildren(): ASTNode[] {
        return this.children;
    }

    addChild(child: ASTNode): NonTerminalASTNode {
        this.children.push(child);
        return this;
    }
}

export = NonTerminalASTNode;