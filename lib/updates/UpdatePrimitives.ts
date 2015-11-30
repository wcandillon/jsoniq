import UpdatePrimitive from "./primitives/UpdatePrimitive";

import InsertIntoObject from "./primitives/InsertIntoObject";
import InsertIntoArray  from "./primitives/InsertIntoArray";
import DeleteFromObject from "./primitives/DeleteFromObject";
import DeleteFromArray  from "./primitives/DeleteFromArray";
import ReplaceInObject  from "./primitives/ReplaceInObject";
import ReplaceInArray   from "./primitives/ReplaceInArray";
import RenameInObject   from "./primitives/RenameInObject";
import Insert           from "./primitives/Insert";
import Remove           from "./primitives/Remove";

export default class UpdatePrimitives {
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

    forEach(fn: (udp: UpdatePrimitive, udps: UpdatePrimitive[], index: number) => void): UpdatePrimitives {
        var containers = [
            this.insertIntoObject, this.insertIntoArray, this.deleteFromObject, this.renameInObject,
            this.deleteFromArray, this.replaceInArray, this.insert, this.remove
        ];
        containers.forEach(udps => {
            udps.forEach((udp, index) => {
                fn(udp, udps, index);
            });
        });
        return this;
    }
}
