///<reference path='../definitions/jasmine/jasmine.d.ts'/>
///<reference path='../lib/stores/IndexedDBStore.ts' />
var IndexedDBStore = require("IndexedDBStore");

describe("IndexedDBStore", () => {

    beforeEach(function(done) {
        this.store = new IndexedDBStore();
        this.store
        .open("myapp", 4, (event, db) => {
            var store;
            if(event.newVersion > 3) {
                store = db.createObjectStore("books", { keyPath: "id" });
                store.put({ id: "80ac7430-2d1b-11e4-8c21-0800200c9a66", title: "XQuery 3.0" });
                store.put({ id: "86b80010-2d1b-11e4-8c21-0800200c9a66", title: "NoSQL" });
                store.put({ id: "93f98e10-2d1b-11e4-8c21-0800200c9a66", title: "JavaScript" });
            }
            if(event.newVersion >= 4) {
                store = db.createObjectStore("users", { keyPath: "id" });
                store.put({ id: "wcandillon" });
            }
        })
        .then(done)
        .catch(error => { console.error(error); });
    });

    it("Check collection names", function() {
        expect(this.store.collections().length).toBe(2);
    });
});
