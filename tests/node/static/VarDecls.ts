/// <reference path="../../../typings/tsd.d.ts" />
import * as u from "./Utils";

describe("Test Variable declarations: ", () => {

    it("XPST0081 (1)", () => {
        var markers = u.getMarkers("let $bar:hello := 1 return 1");
        expect(markers.length).toBe(2);
        expect(markers[0].getType()).toBe("error");
        expect(markers[0].getMessage().indexOf("[XPST0081]")).toBe(0);
    });

    it("XPST0081 (2)", () => {
        var markers = u.getMarkers("declare namespace bar = \"http://www.example.com\"; let $bar:hello := 1 return 1");
        expect(markers.length).toBe(1);
        expect(markers.filter(marker => { return marker.getType() === "error"; }).length).toBe(0);
        expect(markers.filter(marker => { return marker.getType() === "warning"; }).length).toBe(1);
    });

    it("XPST0081 (3)", () => {
        var markers = u.getMarkers("let $hello := 1 return 1");
        expect(markers.length).toBe(1);
        expect(markers.filter(marker => { return marker.getType() === "warning"; }).length).toBe(1);
    });
});
