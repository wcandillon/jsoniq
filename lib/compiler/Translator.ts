import ASTNode = require("./parsers/ASTNode");
import Marker = require("./Marker");

class Translator {

    private marker: Marker[];

    getMarkers(): Marker[] {
        return this.marker;
    }

    visit(node: ASTNode): Translator {
        //var name = node.getName();

        return this;
    }
}

export = Translator;
