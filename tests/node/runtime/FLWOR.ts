/// <reference path="../../../typings/tsd.d.ts" />
require("jasmine2-pit");
import * as u from "./Utils";

describe("Test FLWOR", () => {

    it("for 0", () => {
        var e = u.expectQuery("for $z in (2 to 5) return $z * $z");
        e.toEqual([4, 9, 16, 25]);
    });

    it("for 1", () => {
        var e = u.expectQuery("for $z at $y in (2 to 5) return $z * $y");
        e.toEqual([2, 6, 12, 20]);
    });

    it("for 2", () => {
        var e = u.expectQuery("for $i at $a in (1 to 2) for $z at $y in (2 to 5) return $z * $y * $a");
        e.toEqual([2, 6, 12, 20, 4, 12, 24, 40]);
    });

    it("for 3", () => {
        var e = u.expectQuery("for $z at $y in (for $i in (2 to 5) return $i) return $z * $y");
        e.toEqual([2, 6, 12, 20]);
    });

    it("for 3.1", () => {
        var e = u.expectQuery("for $z at $y in (for $i in (2 to 5) return $i) return (for $i in (1, 2) return $i + $z)");
        e.toEqual([ 3, 4, 4, 5, 5, 6, 6, 7 ]);
    });

    it("for 4", () => {
        var e = u.expectQuery("for $i in (1 to 2) for $z at $y in (2 to 5) return $z * $y");
        e.toEqual([2, 6, 12, 20, 2, 6, 12, 20]);
    });

    it("for 4 bis", () => {
        var e = u.expectQuery("for $w in (1 to 2) for $z at $y in (for $i in (2 to 5) return $i) return $z * $y");
        e.toEqual([2, 6, 12, 20, 2, 6, 12, 20]);
    });

    it("for 5", () => {
        var e = u.expectQuery("for $z in (for $i in (2 to 5) return $i) return $z");
        e.toEqual([2, 3, 4, 5]);
    });

    it("for 6", () => {
        var e = u.expectQuery("for $a at $i in (1 to 5) for $b at $j in $a return ($i, $j)");
        e.toEqual([1, 1, 2, 1, 3, 1, 4, 1, 5, 1]);
    });

    it("for 7", () => {
        var e = u.expectQuery("for $i in (1 to 5) return $i");
        e.toEqual([1, 2, 3, 4, 5]);
    });

    it("for 8", () => {
        var e = u.expectQuery("for $z in (1 to 2) for $i in (1 to 5) return $i");
        e.toEqual([1, 2, 3, 4, 5, 1, 2, 3, 4, 5]);
    });

    it("for 9", () => {
        var e = u.expectQuery("for $i in (for $a in (1 to 5) return $a) return $i");
        e.toEqual([1, 2, 3, 4, 5]);
    });

    it("for 10", () => {
        var e = u.expectQuery("for $i in (1 to 2) return ($i, $i)");
        e.toEqual([1, 1, 2, 2]);
    });

    it("for 11", () => {
        var e = u.expectQuery("for $i in (1 to 2) return (5 to 10)");
        e.toEqual([5, 6, 7, 8, 9, 10, 5, 6, 7, 8, 9, 10]);
    });

    it("for 12", () => {
        var e = u.expectQuery("for $i in (1 to 2) return ($i + $i * 2)");
        e.toEqual([3, 6]);
    });

    it("for 13", () => {
        var e = u.expectQuery("for $i in () return $i");
        e.toEqual([]);
    });

    it("for 14", () => {
        var e = u.expectQuery("for $i allowing empty in () return 1");
        e.toEqual([1]);
    });

    it("for 15", () => {
        var e = u.expectQuery("for $i in () return 1");
        e.toEqual([]);
    });

    it("let 1", () => {
        var e = u.expectQuery("let $i := 1 return $i");
        e.toEqual([1]);
    });

    it("let 2", () => {
        var e = u.expectQuery("let $i := 1 let $i := 2 return $i");
        e.toEqual([2]);
    });

    it("let 2.1", () => {
        var e = u.expectQuery("let $i := 1 let $i := $i + 2 return $i");
        e.toEqual([3]);
    });

    it("let 3", () => {
        var e = u.expectQuery("let $i := 1 let $i := (1, 2, 3) return ($i, $i)");
        e.toEqual([1, 2, 3, 1, 2, 3]);
    });

    it("flwor 1", () => {
        var e = u.expectQuery("let $a := for $i in (1 to 2) return $i let $b := for $i in (1 to 2) return $i return ($a, $b)");
        e.toEqual([1, 2, 1, 2]);
    });

    it("flwor 2", () => {
        var e = u.expectQuery("let $a := for $i in (1 to 2) return $i let $b := for $i in (1 to 2) return $i for $a in (1 to 2) for $i in (for $i in (1 to 2) return $i) return $i");
        e.toEqual([1, 2, 1, 2]);
    });

    it("flwor 3", () => {
        var e = u.expectQuery("for $a in (1,2) let $b := (1,2,3) for $c in $b return $a");
        e.toEqual([1, 1, 1, 2, 2, 2]);
    });

    it("flwor 3.1", () => {
        var e = u.expectQuery(`let $i := 1
        let $i := $i + 2
        order by $i
        return $i`);
        e.toEqual([3]);
    });

    it("flwor 4", () => {
        var source = `for $x in (4,1,2,3)
for $y in (4,1,2,3)
order by $x ascending, $y descending
return { x: $x, y: $y }`;
        var e = u.expectQuery(source, true);
        e.toEqual(
            [{"x":1,"y":4},{"x":1,"y":3},{"x":1,"y":2},{"x":1,"y":1},{"x":2,"y":4},{"x":2,"y":3},{"x":2,"y":2},{"x":2,"y":1},{"x":3,"y":4},{"x":3,"y":3},{"x":3,"y":2},{"x":3,"y":1},{"x":4,"y":4},{"x":4,"y":3},{"x":4,"y":2},{"x":4,"y":1}]
        );
    });
});
