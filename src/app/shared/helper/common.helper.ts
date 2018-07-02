import { Injectable } from '@angular/core';

@Injectable()
export class Helper {
    constructor() { }

    isEmptyObject(obj) {
        return (obj && (Object.keys(obj).length === 0));
    }

    keyBoardConst() {
        const isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
        if (isIEOrEdge) {
            return 'shift';
        } else {
            return 'alt';
        }
    }

}
