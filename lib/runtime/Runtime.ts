export function load(it: Iterator<any>): any[] {
    let items = [], item;
    while((item = it.next().value) !== undefined) {
        items.push(item);
    }
    return items;
}

export function sort(tuples: {}, expr: Iterator<any>, ascending: boolean, emptyGreatest: boolean): {} {
    return tuples;
}

export function processTuples(tuples: Iterator<any>): any[] {
    var newTuples = [];
    var tuple;
    while((tuple = tuples.next().value) !== undefined) {
        newTuples.push(tuple);
    }
    newTuples.sort((tuple1, tuple2) => {
        var v1, v2, ascending = "true";
        Object.keys(tuple1).filter(key => { return key.split("_")[0] === "group"; }).forEach(key => {
            v1 = tuple1[key];
            v2 = tuple2[key];
            ascending = key.split("_")[1];
        });
        return ascending === "true" ? (v1 > v2 ? 1 : -1) : (v1 < v2 ? 1 : -1);
    });
    return newTuples;
}

export function *item(items: any[]): Iterable<any> {
    for(let i = 0; i < items.length; i++) {
        yield items[i];
    }
}

export function *comp(l: Iterator<any>, r: Iterator<any>, operator: string): Iterator<any> {
    var left = l.next().value;
    var right = r.next().value;
    if(operator === "eq") {
        yield left === right;
    } else if(operator === "ne") {
        yield left !== right;
    } else if(operator === "lt" || operator === "<") {
        yield left < right;
    } else if(operator === "le") {
        yield left <= right;
    } else if(operator === "gt" || operator === ">") {
        yield left > right;
    } else if(operator === "ge") {
        yield left >= right;
    }
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

export function *SequenceIterator(its: Iterator<any>[]): Iterable<any> {
    var item;
    for(var i = 0; i < its.length; i++) {
        while((item = its[i].next().value) !== undefined) {
            yield item;
        }
    }
}

export function *ArrayIterator(it: Iterator<any>): Iterable<any> {
    var array = [];
    var item;
    while((item = it.next().value) !== undefined) {
        array.push(item);
    }
    yield array;
}

export function *ObjectIterator(its: Iterator<any>[]): Iterable<{}> {
    var object = {};
    its.forEach(it => {
        var pair = it.next().value;
        var items = [], item;
        while((item = pair.value.next().value) !== undefined) {
            items.push(item);
        }
        object[pair.key] = items.length > 1 ? items : items[0];
    });
    yield object;
}

export function *PairIterator(key: Iterator<any>, value: Iterator<any>): Iterable<{}> {
    yield { key: key.next().value, value: value };
}
