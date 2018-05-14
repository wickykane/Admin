import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dateObj' })
export class DateObjectPipe implements PipeTransform {
    transform(value): any {
        return this.toDateObject(value);
    }
    toDateObject(date) {
        if (!date) {
            return null;

        }
        const dateObject = new Date(date);
        return {
            day: dateObject.getDate(),
            month: dateObject.getMonth() + 1,
            year: dateObject.getFullYear()
        };
    }
}
