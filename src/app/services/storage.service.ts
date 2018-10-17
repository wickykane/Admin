import { Injectable } from '@angular/core';

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
}
