import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'select2'})
export class Select2Pipe implements PipeTransform {
  transform(value, id, name): any {
    return this.toSelect2Object(value, id, name)
  }
  toSelect2Object(data, id, name) {
    if(!data || !id || !name) return [];
    let res =  data.map( item => {
        return {
            id: item[id],
            text: item[name]
        }
    });
    return (res);
}
}