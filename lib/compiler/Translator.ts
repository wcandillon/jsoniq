import _ = require("lodash");

import ASTNode = require("./parsers/ASTNode");
import Position = require("./parsers/Position");

import StaticContext = require("./StaticContext");
import RootStaticContext = require("./RootStaticContext");
import QName = require("./QName");
import Variable = require("./Variable");
import Marker = require("./Marker");
import err = require("./StaticErrors");
import war = require("./StaticWarnings");

import DynamicContext = require("../runtime/DynamicContext");
import Iterator = require("../runtime/iterators/Iterator");
import ItemIterator = require("../runtime/iterators/ItemIterator");
import AdditiveIterator = require("../runtime/iterators/AdditiveIterator");
import RangeIterator = require("../runtime/iterators/RangeIterator");
import SequenceIterator = require("../runtime/iterators/SequenceIterator");
import MultiplicativeIterator = require("../runtime/iterators/MultiplicativeIterator");
import VarRefIterator = require("../runtime/iterators/VarRefIterator");
import ComparisonIterator = require("../runtime/iterators/ComparisonIterator");
import ObjectIterator = require("../runtime/iterators/ObjectIterator");
import PairIterator = require("../runtime/iterators/PairIterator");
import ArrayIterator = require("../runtime/iterators/ArrayIterator");

import FLWORIterator = require("../runtime/iterators/flwor/FLWORIterator");
import Clause = require("../runtime/iterators/flwor/Clause");
import ForClause = require("../runtime/iterators/flwor/ForClause");
import LetClause = require("../runtime/iterators/flwor/LetClause");
import OrderClause = require("../runtime/iterators/flwor/OrderClause");
import WhereClause = require("../runtime/iterators/flwor/WhereClause");

import Item = require("../runtime/items/Item");

class Translator {

    private ast: ASTNode;

    private markers: Marker[] = [];

    private iterators: Iterator[]  = [];
    private clauses: Clause[][] = [];

    private rootSctx: RootStaticContext;

    private sctx: StaticContext;

    constructor(rootSctx: RootStaticContext, ast: ASTNode) {
        this.rootSctx = rootSctx;
        this.sctx = rootSctx;
        this.ast = ast;
    }

    resolveQName(value: string, pos: Position): QName {
        var idx;
        if (value.substring(0, 2) === "Q{") {
            idx = value.indexOf("}");
            return new QName("", value.substring(2, idx), value.substring(idx + 1));
        } else {
            idx = value.indexOf(":");
            var prefix = value.substring(0, idx);
            var qname = this.sctx.getNamespaceByPrefix(prefix);
            if(!qname && prefix.length > 0) {
                this.markers.push(new err.XPST0081(pos, prefix));
            }
            return new QName(prefix, qname ? qname.getURI() : "", value.substring(idx + 1));
        }

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

    private startFLWOR(): Translator {
        this.clauses.push([]);
        return this;
    }

    private pushClause(clause: Clause): Translator {
        this.clauses[this.clauses.length - 1].push(clause);
        return this;
    }

    private popClauses(): Clause[] {
        if(this.clauses.length === 0) {
            throw new Error("Empty clause statck.");
        }
        return this.clauses.pop();
    }

    private pushCtx(pos: Position): Translator {
        this.sctx = this.sctx.createContext(pos);
        return this;
    }

    private popCtx = function(pos: Position): Translator {
        this.sctx.setPosition(
            new Position(
                this.sctx.getPosition().getStartLine(),
                this.sctx.getPosition().getStartColumn(),
                pos.getEndLine(),
                pos.getEndColumn(),
                pos.getFileName()
            )
        );
        this.sctx.getParent().addVarRefs(this.sctx.getUnusedVarRefs());
        this.sctx.getUnusedVariables().forEach((v: Variable) => {
            if(v.getType() !== "GroupingVariable" && v.getType() !== "CatchVar") {
                this.markers.push(new war.UnusedVariable(v));
            }
        });
        this.sctx = this.sctx.getParent();
        return this;
    }

    compile(): Iterator {
        this.visit(this.ast);
        //if iterators.lenght === 0
        //TODO: [XPST0003] invalid expression: syntax error, unexpected end of file, the query body should not be empty
        if(this.iterators.length !== 1 || this.clauses.length !== 0) {
            throw new Error("Invalid query plan.");
        }
        return this.iterators[0].setDynamicCtx(new DynamicContext(undefined));
    }

    getMarkers(): Marker[] {
        return this.markers;
    }

    VersionDecl(node: ASTNode): boolean {
        return true;
    }

    NamespaceDecl(node: ASTNode): boolean {
        var prefix = node.find(["NCName"]).toString();
        var uri = node.find(["URILiteral"]).toString();
        this.sctx.addNamespace(prefix, uri);
        return true;
    }

    Expr(node: ASTNode): boolean {
        var l = this.iterators.length;
        this.visitChildren(node);
        this.pushIt(new SequenceIterator(node.getPosition(), this.iterators.splice(l)));
        return true;
    }

    ParenthesizedExpr(node: ASTNode): boolean {
        this.visitChildren(node);
        if(this.iterators.length === 0) {
            this.pushIt(new SequenceIterator(node.getPosition(), []));
        }
        return true;
    }

    FLWORExpr(node: ASTNode): boolean {
        this.pushCtx(node.getPosition());
        this.startFLWOR();
        this.visitChildren(node);
        var clauses: Clause[] = this.popClauses();
        this.pushIt(new FLWORIterator(node.getPosition(), clauses, this.popIt()));
        for(var i = 0; i < clauses.length; i++) {
            this.popCtx(node.getPosition());
        }
        this.popCtx(node.getPosition());
        return true;
    }

    //ForBinding ::= "$" VarName TypeDeclaration? AllowingEmpty? PositionalVar? "in" ExprSingle
    ForBinding(node: ASTNode): boolean {
        this.visitChildren(node);
        this.pushCtx(node.getPosition());
        var varName = node.find(["VarName"])[0].toString();
        var allowingEmpty = node.find(["AllowingEmpty"])[0] !== undefined;
        var pos = node.find(["PositionalVar"])[0];
        var posVarName;
        if(pos) {
            posVarName = pos.find(["VarName"])[0].toString();
        }
        this.pushClause(new ForClause(node.getPosition(), varName, allowingEmpty, posVarName, this.popIt()));
        return true;
    }

    //LetBinding ::= ( '$' VarName TypeDeclaration? | FTScoreVar ) ':=' ExprSingle
    LetBinding(node: ASTNode): boolean {
        this.visitChildren(node);
        this.pushCtx(node.getPosition());
        var v = node.find(["VarName"])[0];
        var qname = this.resolveQName(v.toString(), v.getPosition());
        this.sctx.addVariable(new Variable(v.getPosition(), "LetBinding", qname));
        this.pushClause(new LetClause(node.getPosition(), v.toString(), this.popIt()));
        return true;
    }

    WhereClause(node: ASTNode): boolean {
        this.visitChildren(node);
        this.pushCtx(node.getPosition());
        this.pushClause(new WhereClause(node.getPosition(), this.popIt()));
        return true;
    }

    OrderByClause(node: ASTNode): boolean {
        this.pushCtx(node.getPosition());
        var orderSpecs: { expr: Iterator; ascending: boolean; emptyGreatest: boolean }[] = [];
        var specs: ASTNode[] = node.find(["OrderSpecList"])[0].getChildren();
        _.chain<ASTNode[]>(specs).forEach((spec: ASTNode) => {
            this.visitChildren(spec);
            orderSpecs.push({
                expr: this.popIt(),
                ascending: spec.find(["OrderModifier"])[0].toString().indexOf("ascending") !== -1,
                emptyGreatest: spec.find(["OrderModifier"])[0].toString().indexOf("empty greatest") !== -1
            });
        });
        this.pushClause(new OrderClause(node.getPosition(), orderSpecs));
        return true;
    }

    ReturnClause(node: ASTNode): boolean {
        this.visitChildren(node);
        return true;
    }

    VarRef(node: ASTNode): boolean {
        var varName = node.find(["VarName"])[0].toString();
        this.sctx.addVarRef(this.resolveQName(varName, node.getPosition()));
        this.pushIt(new VarRefIterator(node.getPosition(), varName));
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
            this.pushIt(
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

    ComparisonExpr(node: ASTNode): boolean {
        this.visitChildren(node);
        var right = this.popIt();
        var left = this.popIt();
        var comp = node.find(["ValueComp"]).toString();
        comp = comp === "" ? node.find(["GeneralComp"]).toString() : comp;
        comp = comp === "" ? node.find(["NodeComp"]).toString() : comp;
        this.pushIt(new ComparisonIterator(node.getPosition(), left, right, comp));
        return true;
    }

    BlockExpr(node: ASTNode): boolean {
        var oldLength = this.iterators.length;
        this.visitChildren(node);
        if(this.iterators.length === oldLength) {
            this.pushIt(new ObjectIterator(node.getPosition(), []));
        }
        return true;
    }

    ObjectConstructor(node: ASTNode): boolean {
        var l = this.iterators.length;
        this.visitChildren(node);
        this.pushIt(new ObjectIterator(node.getPosition(), this.iterators.splice(l)));
        return true;
    }

    //ArrayConstructor
    ArrayConstructor(node: ASTNode): boolean {
        this.visitChildren(node);
        this.pushIt(new ArrayIterator(node.getPosition(), this.popIt()));
        return true;
    }

    PairConstructor(node: ASTNode): boolean {
        this.visitChildren(node);
        var value = this.popIt();
        var key;
        if(node.find(["NCName"])[0]) {
            key = new ItemIterator(node.getPosition(), new Item(node.find(["NCName"])[0].toString()));
        } else {
            key = this.popIt();
        }
        this.pushIt(new PairIterator(node.getPosition(), key, value));
        return true;
    }

    DecimalLiteral(node: ASTNode): boolean {
        var item = new Item(parseFloat(node.toString()));
        this.pushIt(new ItemIterator(node.getPosition(), item));
        return true;
    }

    DoubleLiteral(node: ASTNode): boolean {
        var item = new Item(parseFloat(node.toString()));
        this.pushIt(new ItemIterator(node.getPosition(), item));
        return true;
    }

    IntegerLiteral(node: ASTNode): boolean {
        var item = new Item(parseInt(node.toString(), 10));
        this.pushIt(new ItemIterator(node.getPosition(), item));
        return true;
    }

    StringLiteral(node: ASTNode): boolean {
        var val = node.toString();
        val = val.substring(1, val.length - 1);
        this.pushIt(new ItemIterator(node.getPosition(), new Item(val)));
        return true;
    }

    BooleanLiteral(node: ASTNode): boolean {
        this.pushIt(new ItemIterator(node.getPosition(), new Item(node.toString() === "true")));
        return true;
    }

    NullLiteral(node: ASTNode): boolean {
        this.pushIt(new ItemIterator(node.getPosition(), new Item(null)));
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
