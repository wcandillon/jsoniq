/// <reference path="../../../typings/tsd.d.ts" />
import JSONiq from "../../../lib/JSONiq";
import Marker from "../../../lib/compiler/Marker";

export function getMarkers(source: string, jsoniq?: boolean): Marker[] {
    var query = new JSONiq(source);
    if(jsoniq) {
        query.setFileName("test.jq");
    } else {
        query.setFileName("test.xq");
    }
    try {
        query.compile();
    } catch(e) {
        console.error(e.stack);
    }
    return query.getMarkers();
}
