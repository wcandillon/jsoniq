/// <reference path="../typings/tsd.d.ts" />
require("source-map-support").install();
import Marker = require("./compiler/Marker");
import Translator = require("./compiler/Translator");
import Position = require("./compiler/parsers/Position");
import RootStaticContext = require("./compiler/RootStaticContext");
import ASTNode = require("./compiler/parsers/ASTNode");
import JSONiqParser = require("./compiler/parsers/JSONiqParser");
import XQueryParser = require("./compiler/parsers/XQueryParser");
import JSONParseTreeHandler = require("./compiler/parsers/JSONParseTreeHandler");

import Iterator = require("./runtime/iterators/Iterator");

class JSONiq {

    private rootSctx: RootStaticContext;
    private source: string;
    private fileName: string = "";
    private markers: Marker[] = [];

    constructor(source: string) {
        this.source = source;
        this.rootSctx = new RootStaticContext();
    }

    setFileName(fileName: string): JSONiq {
        this.fileName = fileName;
        return this;
    }

    parse(): ASTNode {
        var isJSONiq = (
            (this.fileName.substring(this.fileName.length - ".jq".length).indexOf(".jq") !== -1) &&
            this.source.indexOf("xquery version") !== 0
            ) || this.source.indexOf("jsoniq version") === 0;
        var h = new JSONParseTreeHandler(this.source);
        var parser = isJSONiq ? new JSONiqParser.Parser(this.source, h) : new XQueryParser.Parser(this.source, h);
        try {
            parser.parse_XQuery();
        } catch (e) {
            if (e instanceof JSONiqParser.ParseException) {
                h.closeParseTree();
                var message: string;
                if(parser instanceof JSONiqParser.Parser) {
                    message = (<JSONiqParser.Parser>parser).getErrorMessage(e);
                } else if(parser instanceof XQueryParser.Parser) {
                    message = (<XQueryParser.Parser>parser).getErrorMessage(e);
                }
                var pos = Position.convertPosition(this.source, e.getBegin(), e.getEnd());
                if (pos.getStartColumn() === pos.getEndColumn() && pos.getStartLine() === pos.getEndLine()) {
                    pos.setEndColumn(pos.getEndColumn() + 1);
                }
                this.markers.push(new Marker(pos, "error", "error", message));
            } else {
                throw e;
            }
        }
        return h.getParseTree();
    }

    compile(): Iterator {
        var ast = this.parse();
        //console.log(ast.toXML());
        var translator = new Translator(this.rootSctx, ast);
        var it = translator.compile();
        this.markers = this.markers.concat(translator.getMarkers());
        return it;
    }
}

export = JSONiq;

//var jsoniq = new JSONiq("1 + 1 + 1 - 1 - 1 + 10 - 1, (1 to 5), (1, (), 2, 3), 20.1 idiv 1.678, 10 div 2, 2 * 5");
/*
it.forEach(item => {
   console.log(item);
});
*/
//(parent: Clause, varName: string, allowEmpty: boolean, positionalVar: string, expr: Iterator)

//for $a in (1 to 100) where $a le 10 for $b in (1 to 10) where $a * $b ge 50 return $a * $b
//var jsoniq = new JSONiq("for $a in (1 to 10) for $b in (1 to 10) return $a * $b");
//var jsoniq = new JSONiq("for $z at $y in (2 to 5) return $z * $y");
//var it = jsoniq.compile();
//console.log(it.toString());
//it.forEach(item => {
//    console.log(item.get());
//}).catch(error => {
//    console.error(error.stack);
//});
