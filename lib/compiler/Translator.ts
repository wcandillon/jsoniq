//import * as _ from "lodash";

import ASTNode from "./parsers/ASTNode";
import Position from "./parsers/Position";

import StaticContext from "./StaticContext";
import RootStaticContext from "./RootStaticContext";
import QName from "./QName";
import Variable from "./Variable";
import Marker from "./Marker";

import * as err from "./StaticErrors";
import * as war from "./StaticWarnings";

import Iterator from "../runtime/iterators/Iterator";
import ItemIterator from "../runtime/iterators/ItemIterator";
import AdditiveIterator from "../runtime/iterators/AdditiveIterator";
import RangeIterator from "../runtime/iterators/RangeIterator";
import SequenceIterator from "../runtime/iterators/SequenceIterator";
import MultiplicativeIterator from "../runtime/iterators/MultiplicativeIterator";
import VarRefIterator from "../runtime/iterators/VarRefIterator";
import ComparisonIterator from "../runtime/iterators/ComparisonIterator";
import ObjectIterator from "../runtime/iterators/ObjectIterator";
import PairIterator from "../runtime/iterators/PairIterator";
import ArrayIterator from "../runtime/iterators/ArrayIterator";

import FLWORIterator from "../runtime/iterators/flwor/FLWORIterator";
import ForIterator from "../runtime/iterators/flwor/ForIterator";
import LetIterator from "../runtime/iterators/flwor/LetIterator";
import ReturnIterator from "../runtime/iterators/flwor/ReturnIterator";

import Item from "../runtime/items/Item";

export default class Translator {

    private ast: ASTNode;

    private markers: Marker[] = [];

    private iterators: Iterator[]  = [];

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

    private pushCtx(pos: Position): Translator {
        this.sctx = this.sctx.createContext(pos);
        return this;
    }

    private popCtx(pos: Position): Translator {
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
        if(this.iterators.length !== 1) {
            throw new Error("Invalid query plan.");
        }
        return this.iterators[0];
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

    //FLWORExpr ::= InitialClause IntermediateClause* ReturnClause
    FLWORExpr(node: ASTNode): boolean {
        //this.pushCtx(node.getPosition());
        var clauses = [];
        var children = node.getChildren().filter(node => { return node.getName() !== "WS"; });
        for(var i = 0; i < children.length; i++) {
            this.visit(children[i]);
            clauses.push(this.popIt());
        }
        this.pushIt(new FLWORIterator(node.getPosition(), clauses));
        for(var i = 0; i < children.length - 1; i++) {
            this.popCtx(node.getPosition());
        }
        //this.popCtx(node.getPosition());
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
        this.pushIt(new ForIterator(node.getPosition(), varName, allowingEmpty, posVarName, this.popIt()));
        return true;
    }


    //LetBinding ::= ( '$' VarName TypeDeclaration? | FTScoreVar ) ':=' ExprSingle
    LetBinding(node: ASTNode): boolean {
        this.visitChildren(node);
        this.pushCtx(node.getPosition());
        var v = node.find(["VarName"])[0];
        var qname = this.resolveQName(v.toString(), v.getPosition());
        var variable = new Variable(v.getPosition(), "LetBinding", qname);
        var overrides = this.sctx.getVariable(variable) !== undefined;
        this.sctx.addVariable(variable);
        this.pushIt(new LetIterator(node.getPosition(), v.toString(), this.popIt(), overrides));
        return true;
    }

    ReturnClause(node: ASTNode): boolean {
        this.visitChildren(node);
        this.pushIt(new ReturnIterator(node.getPosition(), this.popIt()));
        return true;
    }

    ParenthesizedExpr(node: ASTNode): boolean {
        this.visitChildren(node);
        if(this.iterators.length === 0) {
            this.pushIt(new SequenceIterator(node.getPosition(), []));
        }
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
