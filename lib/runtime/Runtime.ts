export function *ItemIterator(item: any): Iterable<any> {
    yield item;
}

export function *AdditiveIterator(left: Iterator<number>, right: Iterator<number>, isPlus: boolean): Iterable<number> {
    if(isPlus) {
        yield left.next().value + right.next().value;
    } else {
        yield left.next().value - right.next().value;
    }
}

export function *MultiplicativeIterator(op: string, l: Iterator<number>, r: Iterator<number>): Iterable<number> {
    var left = l.next().value;
    var right = r.next().value;
    var result: number;
    if(op === "*") {
        result = left * right;
    } else if(op === "div") {
        result = left / right;
    } else if(op === "idiv") {
        result = Math.floor(left / right);
    } else if(op === "mod") {
        result = left % right;
    }
    yield result;
}

export function *RangeIterator(l: Iterator<number>, r: Iterator<number>): Iterable<number> {
    var start = l.next().value;
    var end = r.next().value;
    for(var i = start; i <= end; i++) {
        yield i;
    }
}
