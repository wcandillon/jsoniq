/// <reference path="../../../definitions/node-uuid/node-uuid.d.ts" />
/// <reference path="../../../definitions/lodash/lodash.d.ts" />
///<reference path='../../../definitions/jasmine/jasmine.d.ts'/>
import _ = require("lodash");
import uuid = require("node-uuid");
import PUL = require("../../../lib/updates/PUL");
import jerr = require("../../../lib/errors");

describe("PUL", () => {
    it("Should build a simple PUL", () => {
        var pul = new PUL();
        pul
            .insertIntoObject(uuid.v4(), [], { b: 2 })
            .insertIntoArray(uuid.v4(), [], 0, ["a"])
            .deleteFromObject(uuid.v4(), [], ["a", "b"])
            .replaceInObject(uuid.v4(), [], "a", 1);
    });

    it("Two or more ReplaceInObject primitives have the same target object and selector.", () => {

        expect(() => {
            var pul = new PUL();
            pul.replaceInObject(uuid.v4(), [], "a", 1);
            pul.replaceInObject(uuid.v4(), [], "a", 2);
        }).not.toThrow();

        expect(() => {
            try {
                var target = uuid.v4();
                var pul = new PUL();
                pul.replaceInObject(target, [], "a", 1);
                pul.replaceInObject(target, [], "a", 2);
            } catch(e) {
                expect(e instanceof jerr.JNUP0009).toBe(true);
                throw e;
            }
        }).toThrow();
    });

    it("Two or more RenameInObject primitives have the same target object and selector.", () => {
        expect(() => {
            var pul = new PUL();
            pul.renameInObject(uuid.v4(), [], "a", "b");
            pul.renameInObject(uuid.v4(), [], "a", "b");
        }).not.toThrow();

        expect(() => {
            try {
                var target = uuid.v4();
                var pul = new PUL();
                pul.renameInObject(target, [], "a", "b");
                pul.renameInObject(target, [], "a", "c");
            } catch(e) {
                expect(e instanceof jerr.JNUP0009).toBe(true);
                throw e;
            }
        }).toThrow();
    });

    it("Two or more ReplaceInArray primitives have the same target object and selector.", () => {
        expect(() => {
            var pul = new PUL();
            pul.replaceInArray(uuid.v4(), [], 1, "b");
            pul.replaceInArray(uuid.v4(), [], 1, "a");
        }).not.toThrow();

        expect(() => {
            try {
                var target = uuid.v4();
                var pul = new PUL();
                pul.replaceInArray(target, [], 1, "b");
                pul.replaceInArray(target, [], 1, "c");
            } catch(e) {
                expect(e instanceof jerr.JNUP0009).toBe(true);
                throw e;
            }
        }).toThrow();
    });

    it("insertIntoObject Normalization", () => {
        var target = uuid.v4();
        var pul = new PUL();
        pul.insertIntoObject(target, [], { a: 1, b: 2});
        pul.insertIntoObject(target, [], { c: 3 });
        pul.insertIntoObject(target, [], { d: 4 });
        expect(pul.udps.insertIntoObject.length).toBe(1);
        expect(pul.udps.insertIntoObject[0].pairs["a"]).toBe(1);
        expect(pul.udps.insertIntoObject[0].pairs["b"]).toBe(2);
        expect(pul.udps.insertIntoObject[0].pairs["c"]).toBe(3);
        expect(pul.udps.insertIntoObject[0].pairs["d"]).toBe(4);

        expect(() => {
            try {
                var pul = new PUL();
                pul.insertIntoObject(target, [], { a: 1, b: 2 });
                pul.insertIntoObject(target, [], { b: 3, c: 3 });
                pul.insertIntoObject(target, [], { c: 3, d: 4 });
            } catch(e) {
                expect(e instanceof jerr.JNUP0005).toBe(true);
                throw e;
            }
        }).toThrow();
    });

    it("InsertIntoArray Normalization", () => {
        var target = uuid.v4();
        var pul = new PUL();
        pul.insertIntoArray(target, [], 1, ["a"]);
        pul.insertIntoArray(target, [], 0, ["a"]);
        pul.insertIntoArray(target, [], 0, ["a"]);
        expect(pul.udps.insertIntoArray.length).toBe(2);
    });

    it("DeleteFromObject Normalization", () => {
        var target = uuid.v4();
        var pul = new PUL();
        pul.deleteFromObject(target, [], ["a"]);
        pul.deleteFromObject(target, [], ["a"]);
        pul.deleteFromObject(target, [], ["b"]);
        pul.deleteFromObject(target, [], ["b"]);

        expect(pul.udps.deleteFromObject.length).toBe(1);
        expect(pul.udps.deleteFromObject[0].keys.length).toBe(2);
        expect(pul.udps.deleteFromObject[0].keys.indexOf("a") !== -1).toBe(true);
        expect(pul.udps.deleteFromObject[0].keys.indexOf("b") !== -1).toBe(true);
    });

    it("DeleteFromArray Normalization", () => {
        var target = uuid.v4();
        var pul = new PUL();
        pul.deleteFromArray(target, [], 0);
        pul.deleteFromArray(target, [], 0);
        pul.deleteFromArray(target, [], 0);
        pul.deleteFromArray(target, [], 1);
        pul.deleteFromArray(target, [], 1);

        expect(pul.udps.deleteFromArray.length).toBe(2);
    });

    it("ReplaceInArray Normalization", () => {
        var target = uuid.v4();
        var pul = new PUL();
        pul.deleteFromArray(target, [], 0);
        pul.replaceInArray(target, [], 0, 1);
        expect(pul.normalize().udps.replaceInArray.length).toBe(0);

        pul = new PUL();
        pul.replaceInArray(target, [], 0, 1);
        pul.deleteFromArray(target, [], 0);
        expect(pul.normalize().udps.replaceInArray.length).toBe(0);

        //The presence of multiple UPs of this type with the same (array,index) target raises an error.
        expect(() => {
            try {
                var pul = new PUL();
                pul.replaceInArray(target, [], 0, 1);
                pul.replaceInArray(target, [], 0, 1);
            } catch(e) {
                expect(e instanceof jerr.JNUP0009).toBe(true);
                throw e;
            }
        }).toThrow();

        expect(() => {
            try {
                var pul = new PUL();
                pul.deleteFromArray(target, [], 0);
                pul.replaceInArray(target, [], 0, 1);
                pul.replaceInArray(target, [], 0, 1);
            } catch(e) {
                expect(e instanceof jerr.JNUP0009).toBe(true);
                throw e;
            }
        }).toThrow();

        expect(() => {
            try {
                var pul = new PUL();
                pul.replaceInArray(target, [], 0, 1);
                pul.deleteFromArray(target, [], 0);
                pul.replaceInArray(target, [], 0, 1);
            } catch(e) {
                expect(e instanceof jerr.JNUP0009).toBe(true);
                throw e;
            }
        }).toThrow();
    });

    it("ReplaceInObject Normalization", () => {
        var target = uuid.v4();
        var pul = new PUL();
        pul.deleteFromObject(target, [], ["foo"]);
        pul.replaceInObject(target, [], "foo", "bar");
        expect(pul.normalize().udps.replaceInObject.length).toBe(0);

        pul = new PUL();
        pul.replaceInObject(target, [], "foo", "bar");
        pul.deleteFromObject(target, [], ["foo"]);
        expect(pul.normalize().udps.replaceInObject.length).toBe(0);

        //The presence of multiple UPs of this type with the same (array,index) target raises an error.
        expect(() => {
            try {
                var pul = new PUL();
                pul.replaceInObject(target, [], "foo", "bar");
                pul.replaceInObject(target, [], "foo", "bar");
            } catch(e) {
                expect(e instanceof jerr.JNUP0009).toBe(true);
                throw e;
            }
        }).toThrow();

        expect(() => {
            try {
                var pul = new PUL();
                pul
                    .deleteFromObject(target, [], ["foo"])
                    .replaceInObject(target, [], "foo", "bar")
                    .replaceInObject(target, [], "foo", "bar");

            } catch(e) {
                expect(e instanceof jerr.JNUP0009).toBe(true);
                throw e;
            }
        }).toThrow();

        expect(() => {
            try {
                var pul = new PUL();
                pul
                    .replaceInObject(target, [], "foo", "bar")
                    .deleteFromObject(target, [], ["foo"])
                    .replaceInObject(target, [], "foo", "bar");

            } catch(e) {
                expect(e instanceof jerr.JNUP0009).toBe(true);
                throw e;
            }
        }).toThrow();

    });

    it("RenameInObject Normalization", () => {
        var target = uuid.v4();
        var pul = new PUL();
        pul
            .deleteFromObject(target, [], ["foo"])
            .renameInObject(target, [], "foo", "bar");
        expect(pul.normalize().udps.replaceInObject.length).toBe(0);

        pul = new PUL();
        pul
            .renameInObject(target, [], "foo", "bar")
            .deleteFromObject(target, [], ["foo"]);
        expect(pul.normalize().udps.replaceInObject.length).toBe(0);

        //The presence of multiple UPs of this type with the same (array,index) target raises an error.
        expect(() => {
            try {
                var pul = new PUL();
                pul
                    .renameInObject(target, [], "foo", "bar")
                    .renameInObject(target, [], "foo", "bar");
            } catch(e) {
                expect(e instanceof jerr.JNUP0009).toBe(true);
                throw e;
            }
        }).toThrow();

        expect(() => {
            try {
                var pul = new PUL();
                pul
                    .deleteFromObject(target, [], ["foo"])
                    .renameInObject(target, [], "foo", "bar")
                    .renameInObject(target, [], "foo", "bar");
            } catch(e) {
                expect(e instanceof jerr.JNUP0009).toBe(true);
                throw e;
            }
        }).toThrow();

        expect(() => {
            try {
                var pul = new PUL();
                pul
                    .renameInObject(target, [], "foo", "bar")
                    .deleteFromObject(target, [], ["foo"])
                    .renameInObject(target, [], "foo", "bar");
            } catch(e) {
                expect(e instanceof jerr.JNUP0009).toBe(true);
                throw e;
            }
        }).toThrow();
    });

    it("Insert Conflict", () => {
       expect(() => {
           try {
               var target = uuid.v4();
               var pul = new PUL();
               pul.insert(target, { id: 1 });
               pul.insert(target, { id: 2 });
           } catch(e) {
               expect(e instanceof jerr.JNUP0005).toBe(true);
               throw e;
           }
       }).toThrow();
    });

    it("Remove Normalization", () => {
        var pul = new PUL();
        pul.insert("1", { a: 1 });
        pul.remove("1");
        pul.normalize();
        expect(pul.udps.insert.length).toBe(0);
        expect(pul.udps.remove.length).toBe(1);
    });

    it("Normalization Example", () => {
        var target = uuid.v4();
        var pul = new PUL();
        pul.insertIntoArray(target, [], 0, [{ id: 1 }]);
        pul.insertIntoArray(target, [], 0, [{ id: 2 }]);
        pul.deleteFromArray(target, [], 1);
        pul.deleteFromArray(target, [], 2);
        pul.deleteFromArray(target, [], 2);
        pul.deleteFromArray(target, [], 3);
        pul.renameInObject(target, ["0"], "title", "obsolete");
        pul.deleteFromObject(target, ["0"], ["title"]);
        pul.insertIntoObject(target, ["0"], { a: 1 });
        pul.insertIntoObject(target, ["0"], { b: 2 });
        pul.normalize();
        expect(pul.udps.insertIntoArray.length).toBe(1);
        expect(pul.udps.insertIntoArray[0].items.length).toBe(2);
        expect(_.isEqual(pul.udps.insertIntoArray[0].items, [{ id: 1 }, { id: 2 }])).toBe(true);
        expect(pul.udps.insertIntoObject.length).toBe(1);
        expect(_.isEqual(pul.udps.insertIntoObject[0].pairs, {"a":1,"b":2})).toBe(true);
        expect(pul.udps.deleteFromArray.length).toBe(3);
        var positions = [];
        pul.udps.deleteFromArray.forEach((udp) => {
            positions.push(udp.position);
        });
        expect(_.isEqual(positions.sort(), [1, 2, 3].sort()));
        expect(pul.udps.deleteFromObject.length).toBe(1);
        expect(pul.udps.deleteFromObject[0].keys.length).toBe(1);
        expect(pul.udps.deleteFromObject[0].keys["0"]).toBe("title");
    });

    it("Test PUL parsing and serialization", () => {
        var pul = new PUL();
        pul
            .insertIntoObject(uuid.v4(), [], { a: 1 })
            .insertIntoArray(uuid.v4(), [], 0, [1, 2])
            .deleteFromObject(uuid.v4(), [], ["a"])
            .replaceInObject(uuid.v4(), [], "a", 1)
            .deleteFromArray(uuid.v4(), [], 0)
            .replaceInArray(uuid.v4(), [], 0, 1)
            .renameInObject(uuid.v4(), [], "a", "b")
            .insert(uuid.v4(), { hello: "world" })
            .remove(uuid.v4());

        var serializedPUL = pul.serialize();
        var pul1 = new PUL();
        pul1.parse(serializedPUL);
        var pul2 = new PUL();
        pul2.parse(serializedPUL);
        expect(pul1.serialize()).toBe(pul2.serialize());
        expect(pul1.serialize()).toBe(serializedPUL);
        expect(pul2.serialize()).toBe(serializedPUL);
    });
});
