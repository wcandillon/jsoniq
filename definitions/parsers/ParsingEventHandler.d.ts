interface ParsingEventHandler {
    reset(source: string);
    startNonterminal(name: string, begin: number);
    endNonterminal(name: string, end: number);
    terminal(name: string, begin: number, end: number);
    whitespace(begin: number, end: number);
}

declare var ParsingEventHandler: ParsingEventHandler;