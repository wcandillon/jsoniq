///<reference path='../definitions/jasmine/jasmine.d.ts'/>
///<reference path='../lib/stores/IndexedDBStore.ts' />
var IndexedDBStore = require("IndexedDBStore");

describe("IndexedDBStore", () => {

    beforeEach(function(done) {
        this.store = new IndexedDBStore();
        this.store.open("myapp", 1).then(() => {
            done();
        }).catch((error) => {
            console.error(error);
        });
    });

    it("Opens a database", function() {
        expect(this.store.collections().length).toBe(0);
    });
});
