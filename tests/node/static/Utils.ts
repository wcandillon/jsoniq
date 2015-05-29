/// <reference path="../../../typings/tsd.d.ts" />
import JSONiq = require("../../../lib/JSONiq");
import Marker = require("../../../lib/compiler/Marker");

export function getMarkers(source: string, jsoniq?: boolean): Marker[] {
    var query = new JSONiq(source);
    if(jsoniq) {
        query.setFileName("test.jq");
    } else {
        query.setFileName("test.xq");
    }
    query.compile();
    return query.getMarkers();
}
