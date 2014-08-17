import UpdatePrimitive = require("./primitives/UpdatePrimitive");

import InsertIntoObject = require("./primitives/InsertIntoObject");
import InsertIntoArray  = require("./primitives/InsertIntoArray");
import DeleteFromObject = require("./primitives/DeleteFromObject");
import DeleteFromArray  = require("./primitives/DeleteFromArray");
import ReplaceInObject  = require("./primitives/ReplaceInObject");
import ReplaceInArray   = require("./primitives/ReplaceInArray");
import RenameInObject   = require("./primitives/RenameInObject");
import Insert           = require("./primitives/Insert");
import Remove           = require("./primitives/Remove");

class UpdatePrimitives {
    insertIntoObject : InsertIntoObject[] = [];
    insertIntoArray  : InsertIntoArray[]  = [];
    deleteFromObject : DeleteFromObject[] = [];
    deleteFromArray  : DeleteFromArray[]  = [];
    replaceInObject  : ReplaceInObject[]  = [];
    replaceInArray   : ReplaceInArray[]   = [];
    renameInObject   : RenameInObject[]   = [];
    insert           : Insert[]           = [];
    remove           : Remove[]           = [];

    getAll(): UpdatePrimitive[] {
        var primitives = [];
        primitives = this.insertIntoArray;
        primitives = primitives.concat(this.insertIntoObject);
        primitives = primitives.concat(this.insertIntoObject);
        primitives = primitives.concat(this.deleteFromObject);
        primitives = primitives.concat(this.deleteFromArray);
        primitives = primitives.concat(this.replaceInObject);
        primitives = primitives.concat(this.replaceInArray);
        primitives = primitives.concat(this.renameInObject);
        primitives = primitives.concat(this.insert);
        primitives = primitives.concat(this.remove);
        return primitives;
    }

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
        udps.insert.forEach((udp) => {
            this.insert.push(new Insert(udp.id, udp.item));
        });
        udps.remove.forEach((udp) => {
            this.remove.push(new Remove(udp.id));
        });
        return this;
    }
}

export = UpdatePrimitives;
