interface ES5Parser {
    new(source: string, parsingEventHandler: any);
    parse_Program();
}

declare var ES5Parser: ES5Parser;