class QName {

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
}

export = QName;
