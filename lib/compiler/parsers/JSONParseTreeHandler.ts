/// <reference path="../../../typings/tsd.d.ts" />
import JSONiqParser = require("./JSONiqParser");
import ASTNode = require("./ASTNode");
import Position = require("./Position");

class JSONParseTreeHandler implements JSONiqParser.ParsingEventHandler {

    private source: string;
    private ast: ASTNode;
    private ptr: ASTNode;
    private remains: string;
    private cursor: number = 0;
    private lineCursor: number = 0;
    private line: number = 0;

    private toBeIndexed: string[] = ["VarDecl", "FunctionDecl"];

    //List of nodes that are not targeted by the parse tree size optimization.
    private list: string[] = [
        "OrExpr", "AndExpr", "ComparisonExpr", "StringConcatExpr", "RangeExpr",
        //, "AdditiveExpr", "MultiplicativeExpr"
        "UnionExpr", "IntersectExceptExpr", "InstanceofExpr", "TreatExpr", "CastableExpr", "CastExpr", "UnaryExpr", "ValueExpr",
        "FTContainsExpr", "SimpleMapExpr", "PathExpr", "RelativePathExpr", "PostfixExpr", "StepExpr"
    ];

    constructor(source) {
        this.source = source;
        this.remains = source;
    }

    pushNode(name: string): JSONParseTreeHandler { //begin
        var node = new ASTNode(name, this.ast, new Position(0, 0, 0, 0), undefined, []);
        if (this.ast === undefined) {
            this.ast = node;
            this.ast.index = [];
            this.ptr = node;
        } else {
            node.setParent(this.ptr);
            this.ptr.addChild(node);
            this.ptr = this.ptr.getChildren()[this.ptr.getChildren().length - 1];
        }
        return this;
    }

    popNode(): JSONParseTreeHandler {
        var children = this.ptr.getChildren();
        if (children.length > 0) {
            var s = children[0];
            var e;
            //We want to skip empty non terminals. For instance:
            // [108] AxisStep ::= (ReverseStep | ForwardStep) PredicateList
            // [120] PredicateList ::= Predicate*
            for (var i = children.length - 1; i >= 0; i--) {
                e = children[i];
                if (e.getPosition().getEndLine() !== 0 || e.getPosition().getEndColumn() !== 0) {
                    break;
                }
            }
            this.ptr.setPosition(new Position(
                s.getPosition().getStartLine(),
                s.getPosition().getStartColumn(),
                e.getPosition().getEndLine(),
                e.getPosition().getEndColumn()
            ));
        }

        //Normalize EQName && FunctionName
        if (this.ptr.getName() === "FunctionName") {
            this.ptr.setName("EQName");
        }

        if (this.ptr.getName() === "EQName" && this.ptr.getValue() === undefined) {
            this.ptr.setValue(this.ptr.getChildren()[0].getValue());
            this.ptr.getChildren().pop();
        }

        if(this.toBeIndexed.indexOf(this.ptr.getName()) !== -1) {
            this.ast.index.push(this.ptr);
        }

        if (this.ptr.getParent() !== undefined) {
            this.ptr = this.ptr.getParent();
        }

        //Parse tree size optimization
        if (this.ptr.getChildren().length > 0) {
            var lastChild = this.ptr.getChildren()[this.ptr.getChildren().length - 1];
            if (lastChild.getChildren().length === 1 && this.list.indexOf(lastChild.getName()) !== -1) {
                this.ptr.getChildren()[this.ptr.getChildren().length - 1] = lastChild.getChildren()[0];
            }
        }
        return this;
    }

    getParseTree(): ASTNode {
        return this.ast;
    }

    closeParseTree(): JSONParseTreeHandler {
        while (this.ptr.getParent() !== undefined) {
            this.popNode();
        }
        this.popNode();
        return this;
    }

    reset(source: string): void {
        this.source = source;
        this.remains = source;
    }

    startNonterminal(name: string, begin: number): void {
        this.pushNode(name);
    }

    endNonterminal(name: string, end: number): void {
        this.popNode();
    }

    terminal(name: string, begin: number, end: number): void {
        name = (name.substring(0, 1) === "'" && name.substring(name.length - 1) === "'") ? "TOKEN" : name;
        this.pushNode(name);
        this.setValue(this.ptr, begin, end);
        this.popNode();
    }

    whitespace(begin: number, end: number): void {
        var name = "WS";
        this.pushNode(name);
        this.setValue(this.ptr, begin, end);
        this.popNode();
    }

    private setValue(node: ASTNode, begin: number, end: number) {
        var e = end - this.cursor;
        node.setValue(this.remains.substring(0, e));
        this.remains = this.remains.substring(e);
        this.cursor = end;

        var sl = this.line;
        var sc = this.lineCursor;
        var el = sl + node.getValue().split("\n").length - 1;
        var lastIdx = node.getValue().lastIndexOf("\n");
        var ec = lastIdx === -1 ? sc + node.getValue().length : node.getValue().substring(lastIdx + 1).length;

        this.line = el;
        this.lineCursor = ec;
        node.setPosition(new Position(sl, sc, el, ec));
    }
}

export = JSONParseTreeHandler;
