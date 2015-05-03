/// <reference path="../../../typings/tsd.d.ts" />
import JSONiqParser = require("./JSONiqParser");
import ASTNode = require("./ASTNode");
import TerminalASTNode = require("./TerminalASTNode");
import NonTerminalASTNode = require("./NonTerminalASTNode");

class JSONParseTreeHandler implements JSONiqParser.ParsingEventHandler {

    private source: string;
    private ast: ASTNode;
    private ptr: ASTNode;

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
    }

    reset(source: string): void {}

    startNonterminal(name: string, begin: number): void {

    }

    endNonterminal(name: string, end: number): void {
    }

    terminal(name: string, begin: number, end: number): void {

    }

    whitespace(begin: number, end: number): void {
    }
}

export = JSONParseTreeHandler;