class Position {
    private sl: number = 0;
    private sc: number = 0;
    private el: number = 0;
    private ec: number = 0;

    constructor(sl: number, sc: number, el: number, ec: number){
        this.sl = sl;
        this.sc = sc;
        this.el = el;
        this.ec = ec;
    }

    getStartLine(): number {
        return this.sl;
    }

    getStartColumn(): number {
        return this.sc;
    }

    getEndLine(): number {
        return this.el;
    }

    getEndColumn(): number {
        return this.ec;
    }
}

export = Position;