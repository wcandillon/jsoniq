module jerr {

    export declare class Error {
        public name: string;
        public message: string;
        public stack: string;
        constructor(message?: string);
    }

    export class Exception extends Error {

        constructor(public name: string, public message: string) {
            super(message);
            this.name = name;
            this.message = message;
            this.stack = (<any>new Error("[" + name + "] " + message)).stack;
        }

        toString() {
            return "[" + this.name + "] " + this.message;
        }
    }

    export class DynamicError extends Exception {
        constructor(code: string, message: string) {
            super(code, message);
        }
    }

    export class StaticError extends Exception {
        constructor(code: string, message: string) {
            super(code, message);
        }
    }

    export class JNUP0005 extends DynamicError {
        constructor() {
            super("JNUP0005", "It is a dynamic error if a pending update list contains two inserting update primitives on the same object and pair name.");
        }
    }

    export class JNUP0006 extends DynamicError {
        constructor(key) {
            super("JNUP0006", "\"" + key + "\" pair to insert already exists in object");
        }
    }

    export class JNUP0007 extends DynamicError {
        constructor() {
            super("JNUP0007", "It is a type error if, in an updating expression, an array selector cannot be cast to xs:integer or if an object selector cannot be cast to xs:string");
        }
    }

    export class JNUP0008 extends DynamicError {
        constructor() {
            super("JNUP0008", "It is a dynamic error if the target of a JSON delete or JSON replace expression is not an array or an object");
        }
    }

    export class JNUP0009 extends DynamicError {
        constructor() {
            super("JNUP0009", "It is a dynamic error if a pending update list contains two JSON replacing update primitives on the same object or array, and with the same selector.");
        }
    }
}

export = jerr;
