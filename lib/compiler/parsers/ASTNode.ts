import Position = require("./Position");

class ASTNode {

    private name: string;
    private parent: ASTNode;
    private position: Position;
    private value: string;
    private children: ASTNode[];
    public index: any[];

    constructor(name: string, parent: ASTNode, position: Position, value: string, children: ASTNode[]) {
        this.name = name;
        this.parent = parent;
        this.position = position;
        this.value = value;
        this.children = children;
    }

    setName(name: string): ASTNode {
        this.name = name;
        return this;
    }

    getName(): string {
        return this.name;
    }

    setParent(node: ASTNode): ASTNode {
        this.parent = node;
        return this;
    }

    getParent(): ASTNode {
        return this.parent;
    }

    setPosition(position: Position): ASTNode {
        this.position = position;
        return this;
    }

    getPosition(): Position {
        return this.position;
    }

    getValue(): string {
        return this.value;
    }

    setValue(value: string): ASTNode {
        this.value = value;
        return this;
    }

    getChildren(): ASTNode[] {
        return this.children;
    }

    addChild(child: ASTNode): ASTNode {
        this.children.push(child);
        return this;
    }
}

export = ASTNode;
