/// <reference path="../../../typings/tsd.d.ts" />
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

    toXML(indent?: string): string {
        var result =  "";
        indent = indent ? indent : "";
        if(this.value) {
            result += (indent + "<" + this.name + ">" + this.value + "</" + this.name + ">\n");
        } else {
            result += indent + "<" + this.name + ">\n";
            this.children.forEach(function (child) {
                result += child.toXML(indent + "  ");
            });
            result += indent + "</" + this.name + ">\n";
        }
        return result;
    }

    toJSON(root?: boolean): string {
        var result =  "";
        root = root ? root : true;
        result += "{ ";
        result += "  \"name\": \"" + this.name + "\"";
        if(this.value) {
            result += (", " + "  \"value\": \"" + this.value + "\"");
        }
        if(this.children.length > 0) {
            result += ", " + "  \"children\": [" + (this.children.map(function(child) { return child.toJSON(false); }).join(", ")) + "]";
        }
        result += " } ";
        if(root) {
            return JSON.stringify(JSON.parse(result), null, 2);
        } else {
            return result;
        }
    }
}

export = ASTNode;
