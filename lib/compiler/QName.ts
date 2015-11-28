export default class QName {

    private prefix: string;
    private uri: string;
    private local: string;

    constructor(prefix: string, uri: string, local: string) {
        this.prefix = prefix;
        this.uri = uri;
        this.local = local;
    }

    getPrefix(): string {
        return this.prefix;
    }

    getURI(): string {
        return this.uri;
    }

    getLocalName(): string {
        return this.local;
    }

    toString(): string {
        if(this.prefix !== "") {
            return this.prefix + ":" + this.local;
        } else {
            return "Q{" + this.uri + "}" + this.local;
        }
    }
}
