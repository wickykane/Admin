import { Injectable } from '@angular/core';

@Injectable()
export class TableService {
    getList = function() {

    };

    constructor() {
      
    }

    itemPerPageOptions = [15, 30, 50, 100, 200];
    maxSize = 5;
    sortParams = {};
    pagination = {
        page: 1,
        length: this.itemPerPageOptions[0],
        total_record: 0
    };

    changeLength() {
        this.pagination['page'] = 1;
        return this.getList();
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

    sortAction() {
        return this.getList();
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

    searchAction(params) {
        this.pagination['page'] = 1;
        return this.getList();
    }

    changePage(index) {
        console.log("page index", index)
        // this.pagination['page'] = this.pagination['page'] || 1;
        return this.getList();
    }

    getTableConfig() {
        return {
            pagination: this.pagination,
            itemPerPageOptions: this.itemPerPageOptions
        }
    }
}