/// <reference path="../typings/tsd.d.ts" />
require("source-map-support").install();

import SourceMap = require("source-map");

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
        this.rootSctx = new RootStaticContext(new Position(0, 0, 0, 0, this.fileName));
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
        var h = new JSONParseTreeHandler(this.source, this.fileName);
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
                var pos = Position.convertPosition(this.source, e.getBegin(), e.getEnd(), this.fileName);
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
        //TODO: check for syntax errors and don't compile
        //console.log(ast.toXML());
        var translator = new Translator(this.rootSctx, ast);
        var it = translator.compile();
        this.markers = this.markers.concat(translator.getMarkers());
        return it;
    }

    static serialize(it: Iterator): string {
        var node = new SourceMap.SourceNode(1, 1, it.getPosition().getFileName());
        node.add("var r = require('./dist/lib/runtime/Runtime');\nvar it = ");
        node.add(it.serialize());
        node.add(";\n");
        node.add("\n");
        node.add("it.setDynamicCtx(new r.DynamicContext());");
        node.add("\n");
        node.add("it\n.forEach(function(item){ console.log(item.get()); })\n.catch(function(e){ console.error(e.stack); });");
        var source = node.toStringWithSourceMap();
        return source.code;
    }

    getMarkers(): Marker[] {
        return this.markers;
    }
}

export = JSONiq;
