class Item {
    private item: any;

    constructor(item: any) {
        this.item = item;
    }

    get(): any {
        return this.item;
    }
}

export = Item;