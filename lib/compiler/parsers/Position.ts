class Position {

    private sl: number = 0;
    private sc: number = 0;
    private el: number = 0;
    private ec: number = 0;

    static convertPosition(code: string, begin: number, end: number) {
        var before = code.substring(0, begin);
        var after = code.substring(0, end);
        var startline = before.split('\n').length;
        var startcolumn = begin - before.lastIndexOf('\n');
        var endline = after.split('\n').length;
        var endcolumn = end - after.lastIndexOf('\n');
        return new Position(startline - 1, startcolumn - 1, endline - 1, endcolumn - 1);
    }

    constructor(sl: number, sc: number, el: number, ec: number) {
        this.sl = sl;
        this.sc = sc;
        this.el = el;
        this.ec = ec;
    }

    getStartLine(): number {
        return this.sl;
    }

    setStartLine(sl: number): Position {
        this.sl = sl;
        return this;
    }

    getStartColumn(): number {
        return this.sc;
    }

    setStartColumn(sc: number): Position {
        this.sc = sc;
        return this;
    }

    getEndLine(): number {
        return this.el;
    }

    setEndLine(el: number): Position {
        this.el = el;
        return this;
    }

    getEndColumn(): number {
        return this.ec;
    }

    setEndColumn(ec: number): Position {
        this.ec = ec;
        return this;
    }
}

export = Position;