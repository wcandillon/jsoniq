/// <reference path="../../../typings/lodash/lodash.d.ts" />
import * as jerr from "../../errors";

import { IPUL } from "../IPUL";
import { ITransaction } from "../../stores/ITransaction";

export default class UpdatePrimitive {

    public id: string;
    public ordPath: string[];
    private target: any;
    private document: any;

    constructor(id: string, ordPath: string[]) {
        this.id = id;
        this.ordPath = ordPath;
    }

    private goTo(item: any, ordPath: string[]): any {
        if(ordPath.length === 0) {
            return item;
        } else {
            return this.goTo(item[ordPath[0]], ordPath.slice(1));
        }
    }

    lockTarget(transaction: ITransaction): Promise<any> {
        return transaction.get(this.id).then(document => {
            this.document = document;
            var item = this.goTo(this.document, this.ordPath);
            if(!item) {
                throw new jerr.JNUP0008();
            } else {
                this.target = item;
            }
        });
    }

    getDocument(): any {
        return this.document;
    }

    getTarget(): any {
        return this.target;
    }

    apply(): UpdatePrimitive {
        throw new Error("This method is abstract");
    }

    merge(udp: UpdatePrimitive): UpdatePrimitive {
        throw new Error("This method is abstract");
    }

    invert(target: any, pul: IPUL): UpdatePrimitive {
        throw new Error("This method is abstract");
    }
}
