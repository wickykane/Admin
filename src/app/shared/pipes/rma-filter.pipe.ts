import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'returnfilter',
    pure: false
})
export class ReturnFilterPipe implements PipeTransform {
    transform(items, filter) {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be kept, false will be filtered out
        return items.filter((item) => this.applyFilter(item, filter));
    }

    applyFilter(item, filter): boolean {
        for (const field in filter) {
            if (filter[field]) {
                if (typeof filter[field] === 'string') {
                    if (item[field].toLowerCase().indexOf(filter[field].toLowerCase()) === -1) {
                        return false;
                    }
                } else if (typeof filter[field] === 'number') {
                    if (item[field] !== filter[field]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}
