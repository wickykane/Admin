import { Injectable } from '@angular/core';

@Injectable()
export class TableService {
    getListFnName: any;
    context: any;
    constructor() { }

    itemPerPageOptions = [15, 30, 50,100];
    maxSize = 5;
    sortParams = {
        order: null,
        sort: null
    };
    pagination = {
        page: 1,
        length: this.itemPerPageOptions[0],
        total_record: 0
    };

    changeLength() {
        this.pagination['page'] = 1;
        return this.context[this.getListFnName]();
    };

    getParams() {
        var params = {};
        params['page'] = this.pagination['page'] || 1;
        params['length'] = this.pagination['length'] || 15;

        /* check sort */
        if (this.sortParams['order']) {
            params['order'] = this.sortParams['order'];
        } /*else {
            params['order'] = 'name';
        }*/

        if (this.sortParams['sort']) {
            params['sort'] = this.sortParams['sort'] === 1 ? 'asc' : 'desc';
        }

        return params;
    }

    sortAction(data) {
        return this.context[this.getListFnName]();
    }

    matchPagingOption(options) {
        try {
            this.pagination['total_page'] = options['total_page'];
            this.pagination['total_record'] = options['total_record'];
            this.pagination['page'] = options['page'];
        } catch (e) {
            console.log('pagination', e);
        }
    }

    searchAction() {
        this.pagination['page'] = 1;
        return this.context[this.getListFnName]();
    }

    resetAction(form?) {
        if (form) {
            form.reset();
        }
        this.pagination['page'] = 1;
        return this.context[this.getListFnName]();
    }


    changePage(index) {
        this.pagination['page'] = index;
        return this.context[this.getListFnName]();
    }

    getTableConfig() {
        return {
            pagination: this.pagination,
            itemPerPageOptions: this.itemPerPageOptions
        }
    }
}