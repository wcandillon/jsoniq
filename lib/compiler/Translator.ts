//import _ = require("lodash");

import ASTNode = require("./parsers/ASTNode");
import Position = require("./parsers/Position");
import StaticContext = require("./StaticContext");
import RootStaticContext = require("./RootStaticContext");

import Marker = require("./Marker");

import DynamicContext = require("../runtime/DynamicContext");
import Iterator = require("../runtime/iterators/Iterator");
import ItemIterator = require("../runtime/iterators/ItemIterator");
import AdditiveIterator = require("../runtime/iterators/AdditiveIterator");
import RangeIterator = require("../runtime/iterators/RangeIterator");
import SequenceIterator = require("../runtime/iterators/SequenceIterator");
import MultiplicativeIterator = require("../runtime/iterators/MultiplicativeIterator");
import VarRefIterator = require("../runtime/iterators/VarRefIterator");
import flwor = require("../runtime/iterators/flwor");

import Item = require("../runtime/items/Item");

class Translator {

    private ast: ASTNode;

    private marker: Marker[];

    private iterators: Iterator[]  = [];
    private clauses: flwor.Clause[] = [];

    private clausesCount: number[] = [];

    private rootSctx: RootStaticContext;

    private sctx: StaticContext;
    private dctx: DynamicContext;

    constructor(rootSctx: RootStaticContext, ast: ASTNode) {
        this.rootSctx = rootSctx;
        this.sctx = rootSctx;
        this.dctx = new DynamicContext(undefined);
        this.ast = ast;
    }

    private pushIt(it: Iterator): Translator {
        this.iterators.push(it);
        return this;
    }

    private popIt(): Iterator {
        if(this.iterators.length === 0) {
            throw new Error("Empty iterator statck.");
        }
        return this.iterators.pop();
    }

    private pushClause(clause: flwor.Clause): Translator {
        this.clauses.push(clause);
        return this;
    }

    private popClause(): flwor.Clause {
        if(this.iterators.length === 0) {
            throw new Error("Empty iterator statck.");
        }
        return this.clauses.pop();
    }

    private popAllIt(): Iterator[] {
        return this.iterators.splice(0, this.iterators.length);
    }

    private pushCtx(pos: Position): Translator {
        this.sctx = this.sctx.createContext();
        this.dctx = this.dctx.createContext();
        return this;
    }

    private popCtx = function(pos: Position): Translator {
        this.sctx = this.sctx.getParent();
        this.dctx = this.dctx.getParent();
        return this;
    }

    compile(): Iterator {
        this.visit(this.ast);
        //if iterators.lenght === 0
        //[XPST0003] invalid expression: syntax error, unexpected end of file, the query body should not be empty
        if(this.iterators.length !== 1) {
            throw new Error("Invalid query plan.");
        }
        return this.iterators[0];
    }

    getMarkers(): Marker[] {
        return this.marker;
    }

    VersionDecl(node: ASTNode): boolean {
        return true;
    }

    Expr(node: ASTNode): boolean {
        this.visitChildren(node);
        this.pushIt(new SequenceIterator(node.getPosition(), this.popAllIt()));
        return true;
    }

    ParenthesizedExpr(node: ASTNode) {
        this.visitChildren(node);
        if(this.iterators.length === 0) {
            this.pushIt(new SequenceIterator(node.getPosition(), []));
        }
        return true;
    }

    FLWORExpr(node: ASTNode): boolean {
        this.pushCtx(node.getPosition());
        this.clausesCount.push(0);
        this.pushClause(new flwor.EmptyClause());
        this.visitChildren(node);
        //this.popClause();
        var clauseCount = this.clausesCount.pop();
        for(var i = 0; i < clauseCount; i++) {
            this.popCtx(node.getPosition());
        }
        this.popCtx(node.getPosition());
        return true;
    }

    //ForBinding ::= "$" VarName TypeDeclaration? AllowingEmpty? PositionalVar? "in" ExprSingle
    ForBinding(node: ASTNode): boolean {
        this.visitChildren(node);
        this.pushCtx(node.getPosition());
        this.clausesCount[this.clausesCount.length - 1]++;
        var varName = node.find(["VarName"])[0].toString();
        var allowingEmpty = node.find(["AllowingEmpty"])[0] !== undefined;
        var pos = node.find(["PositionalVar"])[0];
        var posVarName;
        if(pos) {
            posVarName = pos.find(["VarName"])[0].toString();
        }
        this.pushClause(new flwor.ForClause(node.getPosition(), this.dctx, this.popClause(), varName, allowingEmpty, posVarName, this.popIt()));
        return true;
    }

    //LetBinding ::= ( '$' VarName TypeDeclaration? | FTScoreVar ) ':=' ExprSingle
    LetBinding(node: ASTNode): boolean {
        this.visitChildren(node);
        this.pushCtx(node.getPosition());
        this.clausesCount[this.clausesCount.length - 1]++;
        var varName = node.find(["VarName"])[0].toString();
        this.pushClause(new flwor.LetClause(node.getPosition(), this.dctx, this.popClause(), varName, this.popIt()));
        return true;
    }

    ReturnClause(node: ASTNode): boolean {
        this.visitChildren(node);
        this.iterators.push(new flwor.ReturnIterator(node.getPosition(), this.dctx, this.popClause(), this.popIt()));
        return true;
    }

    VarRef(node: ASTNode): boolean {
        var varName = node.find(["VarName"])[0].toString();
        this.iterators.push(new VarRefIterator(node.getPosition(), this.dctx, varName));
        return true;
    }

    RangeExpr(node: ASTNode): boolean {
        this.visitChildren(node);
        var to = this.popIt();
        var f = this.popIt();
        this.iterators.push(new RangeIterator(node.getPosition(), f, to));
        return true;
    }

    //AdditiveExpr ::= MultiplicativeExpr ( ( '+' | '-' ) MultiplicativeExpr )*
    AdditiveExpr(node: ASTNode): boolean {
        this.visitChildren(node);
        node.find(["TOKEN"]).forEach((token: ASTNode) => {
            this.iterators.push(
                new AdditiveIterator(
                    node.getPosition(),
                    this.popIt(),
                    this.popIt(),
                    token.getValue() === "+"
                )
            );
        });
        return true;
    }

    //MultiplicativeExpr ::= UnionExpr ( ( '*' | 'div' | 'idiv' | 'mod' ) UnionExpr )*
    MultiplicativeExpr(node: ASTNode): boolean {
        this.visitChildren(node);
        node.find(["TOKEN"]).forEach((token: ASTNode) => {
            this.iterators.push(
                new MultiplicativeIterator(
                    node.getPosition(),
                    this.popIt(),
                    this.popIt(),
                    token.getValue()
                )
            );
        });
        return true;
    }

    DecimalLiteral(node: ASTNode): boolean {
        var item = new Item(parseFloat(node.toString()));
        this.pushIt(new ItemIterator(item));
        return true;
    }

    DoubleLiteral(node: ASTNode): boolean {
        var item = new Item(parseFloat(node.toString()));
        this.pushIt(new ItemIterator(item));
        return true;
    }

    IntegerLiteral(node: ASTNode): boolean {
        var item = new Item(parseInt(node.toString(), 10));
        this.pushIt(new ItemIterator(item));
        return true;
    }

    StringLiteral(node: ASTNode): boolean {
        var val = node.toString();
        val = val.substring(1, val.length - 1);
        this.pushIt(new ItemIterator(new Item(val)));
        return true;
    }

    BooleanLiteral(node: ASTNode): boolean {
        this.pushIt(new ItemIterator(new Item(node.toString() === "true")));
        return true;
    }

    NullLiteral(node: ASTNode): boolean {
        this.pushIt(new ItemIterator(new Item(null)));
        return true;
    }

    visit(node: ASTNode): Translator {
        var name = node.getName();
        var skip = false;

        if (typeof this[name] === "function") {
            skip = this[name](node) === true;
        }

        if (!skip) {
            this.visitChildren(node);
        }
        return this;
    }

    visitChildren(node: ASTNode): Translator {
        node.getChildren().forEach(child => {
            this.visit(child);
        });
        return this;
    }
}

export = Translator;
