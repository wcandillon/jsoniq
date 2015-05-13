/// <reference path="../../../typings/tsd.d.ts" />
require("jasmine2-pit");
import u = require("./Utils");

declare function pit(expectation: string, assertion?: (done: () => void) => any): void;

describe("Test FLWOR", () => {

    pit("for 1", () => {
        return u.expectQuery("for $z at $y in (2 to 5) return $z * $y").then(e => {
            e.toEqual([2, 6, 12, 20]);
        });
    });

    pit("for 2", () => {
        return u.expectQuery("for $i at $a in (1 to 2) for $z at $y in (2 to 5) return $z * $y * $a").then(e => {
            e.toEqual([2, 6, 12, 20, 4, 12, 24, 40]);
        });
    });

    pit("for 3", () => {
        return u.expectQuery("for $z at $y in (for $i in (2 to 5) return $i) return $z * $y").then(e => {
            e.toEqual([2, 6, 12, 20]);
        });
    });

    pit("for 4", () => {
        return u.expectQuery("for $i in (1 to 2) for $z at $y in (2 to 5) return $z * $y").then(e => {
            e.toEqual([2, 6, 12, 20, 2, 6, 12, 20]);
        });
    });

    pit("for 4 bis", () => {
        return u.expectQuery("for $w in (1 to 2) for $z at $y in (for $i in (2 to 5) return $i) return $z * $y").then(e => {
            e.toEqual([2, 6, 12, 20, 2, 6, 12, 20]);
        });
    });

    pit("for 5", () => {
        return u.expectQuery("for $z in (for $i in (2 to 5) return $i) return $z").then(e => {
            e.toEqual([2, 3, 4, 5]);
        });
    });

    pit("for 6", () => {
        return u.expectQuery("for $a at $i in (1 to 5) for $b at $j in $a return ($i, $j)").then(e => {
            e.toEqual([1, 1, 2, 1, 3, 1, 4, 1, 5, 1]);
        });
    });

    pit("for 7", () => {
        return u.expectQuery("for $i in (1 to 5) return $i").then(e => {
            e.toEqual([1, 2, 3, 4, 5]);
        });
    });

    pit("for 8", () => {
        return u.expectQuery("for $z in (1 to 2) for $i in (1 to 5) return $i").then(e => {
            e.toEqual([1, 2, 3, 4, 5, 1, 2, 3, 4, 5]);
        });
    });

    pit("for 9", () => {
        return u.expectQuery("for $i in (for $a in (1 to 5) return $a) return $i").then(e => {
            e.toEqual([1, 2, 3, 4, 5]);
        });
    });

    pit("for 10", () => {
        return u.expectQuery("for $i in (1 to 2) return ($i, $i)").then(e => {
            e.toEqual([1, 1, 2, 2]);
        });
    });

    pit("for 11", () => {
        return u.expectQuery("for $i in (1 to 2) return (5 to 10)").then(e => {
            e.toEqual([5, 6, 7, 8, 9, 10, 5, 6, 7, 8, 9, 10]);
        });
    });

    pit("for 12", () => {
        return u.expectQuery("for $i in (1 to 2) return ($i + $i * 2)").then(e => {
            e.toEqual([3, 6]);
        });
    });

    pit("for 13", () => {
        return u.expectQuery("for $i in () return $i").then(e => {
            e.toEqual([]);
        });
    });

    pit("for 14", () => {
        return u.expectQuery("for $i allowing empty in () return 1").then(e => {
            e.toEqual([1]);
        });
    });

    pit("for 15", () => {
        return u.expectQuery("for $i in () return 1").then(e => {
            e.toEqual([]);
        });
    });

    pit("let 1", () => {
        return u.expectQuery("let $i := 1 return $i").then(e => {
            e.toEqual([1]);
        });
    });

    pit("let 2", () => {
        return u.expectQuery("let $i := 1 let $i := 2 return $i").then(e => {
            e.toEqual([2]);
        });
    });

    pit("let 3", () => {
        return u.expectQuery("let $i := 1 let $i := (1, 2, 3) return ($i, $i)").then(e => {
            e.toEqual([1, 2, 3, 1, 2, 3]);
        });
    });
});
