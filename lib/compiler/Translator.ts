import ASTNode = require("./parsers/ASTNode");
import Marker = require("./Marker");

import Iterator = require("../runtime/iterators/Iterator");
import ItemIterator = require("../runtime/iterators/ItemIterator");
import AdditiveIterator = require("../runtime/iterators/AdditiveIterator");
import RangeIterator = require("../runtime/iterators/RangeIterator");
import SequenceIterator = require("../runtime/iterators/SequenceIterator");

class Translator {

    private marker: Marker[];
    private iterators: Iterator[];

    getMarkers(): Marker[] {
        return this.marker;
    }

    Expr(node: ASTNode): boolean {
        this.visitChildren(node);
        this.iterators.push(new SequenceIterator(this.iterators));
        return true;
    }

    RangeExpr(node: ASTNode): boolean {
        this.visitChildren(node);
        this.iterators.push(new RangeIterator(this.iterators.pop(), this.iterators.pop()));
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
        node.getChildren().forEach(function(child){
            this.visit(child);
        });
        return this;
    }
}

export = Translator;
