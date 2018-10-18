import { Injectable } from '@angular/core';
import { ROUTE_PERMISSION } from './route-permission.config';

@Injectable()
export class StorageService {
    public data = {};

    constructor() { }

    setData(key, value) {
        this.data[key] = value;
    }

    getValue(key) {
        return this.data[key];
    }

    getPermission(key) {
        const permission = this.getValue('permission');
        const index = Object.keys(ROUTE_PERMISSION).find(_key => key.indexOf(_key) !== -1);
        return (index) ? ROUTE_PERMISSION[index] : {};
    }
}
