import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class Helper {
    constructor() { }

    isEmptyObject(obj) {
        return (obj && (Object.keys(obj).length === 0));
    }

    keyBoardConst() {
        const isIEOrEdge = /msie\s|trident\//i.test(window.navigator.userAgent);
        if (isIEOrEdge) {
            return 'ctrl+alt';
        } else {
            return 'alt';
        }
    }
    changeNumberToZero(num) {
        if (_.isNumber(num)) {
            return num;
        }
        return 0;
    }
    sortArrayOfObj(arr, key_sort, order) {
        return arr = _.orderBy(arr, [key_sort], [order]);
    }

}
