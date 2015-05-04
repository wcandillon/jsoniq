import ASTNode = require("./parsers/ASTNode");
import Marker = require("./Marker");

import Iterator = require("../runtime/iterators/Iterator");
import ItemIterator = require("../runtime/iterators/ItemIterator");
import AdditiveIterator = require("../runtime/iterators/AdditiveIterator");
import RangeIterator = require("../runtime/iterators/RangeIterator");
import SequenceIterator = require("../runtime/iterators/SequenceIterator");

class Translator {

    private marker: Marker[];
    private iterators: Iterator[] = [];

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

    RangeExpr(node: ASTNode): boolean {
        this.visitChildren(node);
        var to = this.iterators.pop();
        var f = this.iterators.pop();
        this.iterators.push(new RangeIterator(f, to));
        return true;
    }

    AdditiveExpr(node: ASTNode): boolean {
        this.visitChildren(node);
        this.iterators.push(new AdditiveIterator(this.iterators.pop(), this.iterators.pop()));
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
