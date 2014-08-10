import InsertIntoObject = require("./primitives/InsertIntoObject");
import InsertIntoArray  = require("./primitives/InsertIntoArray");
import DeleteFromObject = require("./primitives/DeleteFromObject");
import DeleteFromArray  = require("./primitives/DeleteFromArray");
import ReplaceInObject  = require("./primitives/ReplaceInObject");
import ReplaceInArray   = require("./primitives/ReplaceInArray");
import RenameInObject   = require("./primitives/RenameInObject");

class UpdatePrimitives {
    insertIntoObject : InsertIntoObject[] = [];
    insertIntoArray  : InsertIntoArray[]  = [];
    deleteFromObject : DeleteFromObject[] = [];
    deleteFromArray  : DeleteFromArray[]  = [];
    replaceInObject  : ReplaceInObject[]  = [];
    replaceInArray   : ReplaceInArray[]   = [];
    renameInObject   : RenameInObject[]   = [];

    parse(udps: UpdatePrimitives): UpdatePrimitives {
        udps.insertIntoObject.forEach((udp) => {
            this.insertIntoObject.push(new InsertIntoObject(udp.id, udp.ordPath, udp.pairs));
        });
        udps.insertIntoArray.forEach((udp) => {
            this.insertIntoArray.push(new InsertIntoArray(udp.id, udp.ordPath, udp.position, udp.items));
        });
        udps.deleteFromObject.forEach((udp) => {
            this.deleteFromObject.push(new DeleteFromObject(udp.id, udp.ordPath, udp.keys));
        });
        udps.replaceInObject.forEach((udp) => {
            this.replaceInObject.push(new ReplaceInObject(udp.id, udp.ordPath, udp.key, udp.item));
        });
        udps.deleteFromArray.forEach((udp) => {
            this.deleteFromArray.push(new DeleteFromArray(udp.id, udp.ordPath, udp.position));
        });
        udps.replaceInArray.forEach((udp) => {
            this.replaceInArray.push(new ReplaceInArray(udp.id, udp.ordPath, udp.position, udp.item));
        });
        udps.renameInObject.forEach((udp) => {
            this.renameInObject.push(new RenameInObject(udp.id, udp.ordPath, udp.key, udp.newKey));
        });
        return this;
    }
}

export = UpdatePrimitives;
