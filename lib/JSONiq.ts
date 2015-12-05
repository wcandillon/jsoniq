/// <reference path="../typings/tsd.d.ts" />
import Marker from "./compiler/Marker";
import Translator from "./compiler/Translator";
import Position from "./compiler/parsers/Position";
import RootStaticContext from "./compiler/RootStaticContext";
import ASTNode from "./compiler/parsers/ASTNode";
import * as JSONiqParser from "./compiler/parsers/JSONiqParser";
import * as XQueryParser from "./compiler/parsers/XQueryParser";
import JSONParseTreeHandler from "./compiler/parsers/JSONParseTreeHandler";

import * as SourceMap from "source-map";

import Iterator from "./runtime/iterators/Iterator";

require("source-map-support").install();

export default class JSONiq {

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
        var node = new SourceMap.SourceNode(1, 1, it.getPosition().getFileName(), null, "MainQuery");
        node.add("'use strict';\n");
        node.add("require('source-map-support').install();\n");
        node.add("var r = require('./dist/lib/runtime/Runtime');\n");
        node.add("var it = ");
        node.add(it.serialize());
        node.add(";\n");
        node.add("for(var item of it) {\n");
        node.add("   console.log(item);\n");
        node.add("}\n");
        var source = node.toStringWithSourceMap();
        source.code +=  "\n//# sourceMappingURL=data:application/json," + source.map;
        return source.code;
    }

    static serializeAsJSON(it: Iterator): string {
        var node = new SourceMap.SourceNode(1, 1, it.getPosition().getFileName(), null, "MainQuery");
        node.add("'use strict';\n");
        node.add("require('source-map-support').install();\n");
        node.add("var r = require('./dist/lib/runtime/Runtime');\n");
        node.add("var it = ");
        node.add(it.serialize());
        node.add(";\n");
        node.add("for(var item of it) {\n");
        node.add("   console.log(JSON.stringify(item));\n");
        node.add("}\n");
        var source = node.toStringWithSourceMap();
        source.code +=  "\n//# sourceMappingURL=data:application/json," + source.map;
        return source.code;
    }

    getMarkers(): Marker[] {
        return this.markers;
    }
}
