module jerr {
    export class Error {
        code: string;
        message: string;
        constructor(code: string, message: string) {
            this.code = code;
            this.message = message;
        }
    }

    export class DynamicError extends Error {
        constructor(code: string, message: string) {
            super(code, message);
        }
    }

    export class StaticError extends Error {
        constructor(code: string, message: string) {
            super(code, message);
        }
    }

    export class JNUP0005 extends DynamicError {
        constructor() {
            super("JNUP0005", "It is a dynamic error if a pending update list contains two inserting update primitives on the same object and pair name.");
        }
    }

    export class JNUP0009 extends DynamicError {
        constructor() {
            super("JNUP0009", "It is a dynamic error if a pending update list contains two JSON replacing update primitives on the same object or array, and with the same selector.");
        }
    }
}
