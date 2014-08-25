import IStore = require("./stores/IStore");

class JSONiq {

    private store: IStore;

    constructor(store: IStore) {
        this.store = store;
    }
}

export = JSONiq;
