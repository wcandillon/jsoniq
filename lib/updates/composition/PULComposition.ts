import PUL  from "../PUL";

import InsertComposition  from "./InsertComposition";
import RemoveComposition  from "./RemoveComposition";
import DeleteFromObjectComposition  from "./DeleteFromObjectComposition";
import InsertIntoObjectComposition  from "./InsertIntoObjectComposition";
import ReplaceInObjectComposition  from "./ReplaceInObjectComposition";
import RenameInObjectComposition  from "./RenameInObjectComposition";
import ReplaceInArrayComposition  from "./ReplaceInArrayComposition";
import DeleteFromArrayComposition  from "./DeleteFromArrayComposition";
import InsertIntoArrayComposition  from "./InsertIntoArrayComposition";

export default class PULComposition {

    static compose(d0: PUL, d1: PUL, copy: boolean = false): PUL {

        if(copy === true) {
            d0 = (new PUL()).parse(d0.serialize());
            d1 = (new PUL()).parse(d1.serialize());
        }

        d0.normalize();
        d1.normalize();

        var insertComposition = new InsertComposition(d0);
        d1.udps.insert.forEach(udp => {
            insertComposition.compose(udp);
        });

        var removeComposition = new RemoveComposition(d0);
        d1.udps.remove.forEach(udp => {
            removeComposition.compose(udp);
        });

        var insertIntoObjectComposition = new InsertIntoObjectComposition(d0);
        d1.udps.insertIntoObject.forEach(udp => {
            insertIntoObjectComposition.compose(udp);
        });

        var deleteFromObjectComposition = new DeleteFromObjectComposition(d0);
        d1.udps.deleteFromObject.forEach(udp => {
            deleteFromObjectComposition.compose(udp);
        });

        var replaceInObjectComposition = new ReplaceInObjectComposition(d0);
        d1.udps.replaceInObject.forEach(udp => {
            replaceInObjectComposition.compose(udp);
        });

        var renameInObjectComposition = new RenameInObjectComposition(d0);
        d1.udps.renameInObject.forEach(udp => {
            renameInObjectComposition.compose(udp);
        });

        var replaceInArrayComposition = new ReplaceInArrayComposition(d0);
        d1.udps.replaceInArray.forEach(udp => {
            replaceInArrayComposition.compose(udp);
        });

        var insertIntoArrayComposition = new InsertIntoArrayComposition(d0);
        d1.udps.insertIntoArray.forEach(udp => {
            insertIntoArrayComposition.compose(udp);
        });

        var deleteFromArrayComposition = new DeleteFromArrayComposition(d0);
        d1.udps.deleteFromArray.forEach(udp => {
            deleteFromArrayComposition.compose(udp);
        });

        return d0.normalize();
    }
}
