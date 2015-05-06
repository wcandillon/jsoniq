import ASTNode = require("./parsers/ASTNode");
import Marker = require("./Marker");

import Iterator = require("../runtime/iterators/Iterator");
import ItemIterator = require("../runtime/iterators/ItemIterator");
import AdditiveIterator = require("../runtime/iterators/AdditiveIterator");
import RangeIterator = require("../runtime/iterators/RangeIterator");
import SequenceIterator = require("../runtime/iterators/SequenceIterator");
import MultiplicativeIterator = require("../runtime/iterators/MultiplicativeIterator");

import flwor = require("../runtime/iterators/flwor");

class Translator {

    private marker: Marker[];
    private iterators: Iterator[] = [];
    private lastClause: flwor.Clause = new flwor.EmptyClause();

    getMarkers(): Marker[] {
        return this.marker;
    }

    getIterator(): Iterator {
        return this.iterators[0];
    }

    Expr(node: ASTNode): boolean {
        this.visitChildren(node);
        this.iterators.push(new SequenceIterator(this.iterators.splice(0, this.iterators.length)));
        return true;
    }

    ForBinding(node: ASTNode): boolean {
        this.visitChildren(node);
        this.lastClause = new flwor.ForClause(this.lastClause, "i", false, "a", this.iterators.pop());
        return true;
    }

    ReturnClause(node: ASTNode): boolean {
        this.visitChildren(node);
        this.iterators.push(new flwor.ReturnIterator(this.lastClause, this.iterators.pop()));
        this.lastClause = new flwor.EmptyClause();
        return true;
    }

    RangeExpr(node: ASTNode): boolean {
        this.visitChildren(node);
        var to = this.iterators.pop();
        var f = this.iterators.pop();
        this.iterators.push(new RangeIterator(f, to));
        return true;
    }

    //AdditiveExpr ::= MultiplicativeExpr ( ( '+' | '-' ) MultiplicativeExpr )*
    AdditiveExpr(node: ASTNode): boolean {
        this.visitChildren(node);
        node.find(["TOKEN"]).forEach((token: ASTNode) => {
            this.iterators.push(
                new AdditiveIterator(
                    this.iterators.pop(),
                    this.iterators.pop(),
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
                    this.iterators.pop(),
                    this.iterators.pop(),
                    token.getValue()
                )
            );
        });
        return true;
    }

    DecimalLiteral(node: ASTNode): boolean {
        this.iterators.push(new ItemIterator(parseFloat(node.getValue())));
        return true;
    }

    IntegerLiteral(node: ASTNode): boolean {
        this.iterators.push(new ItemIterator(parseInt(node.getValue(), 10)));
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
