/// <reference path="../../../typings/parsers/ParsingEventHandler.d.ts" />

class ParseTreeHandler implements ParsingEventHandler {

    private source: string;

    reset(source: string) {
        this.source = source;
    }

    startNonterminal(name: string, begin: number) {
        console.log(name);
    }

    endNonterminal(name: string, end: number) {
        console.log(name);
    }

    terminal(name: string, begin: number, end: number) {
        console.log(name);
    }

    whitespace(begin: number, end: number) {
        console.log(begin);
    }
}

export = ParseTreeHandler;

