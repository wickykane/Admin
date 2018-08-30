import { Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Injectable()

export class NgbUTCStringAdapter extends NgbDateAdapter<string> {

    fromModel(date: string): NgbDateStruct {
        if (date) { date = moment(new Date(date)).format('YYYY-MM-DD'); }
        return (date && Number(date.substring(0, 4)) && Number(date.substring(5, 7) + 1) && Number(date.substring(8, 10))) ?
            {
                year: Number(date.substring(0, 4)),
                month: Number(date.substring(5, 7)),
                day: Number(date.substring(8, 10))
            } : null;
    }

    toModel(date: NgbDateStruct): string {
        return date ? date.year.toString() + '-' + String('00' + date.month).slice(-2)
            + '-' + String('00' + date.day).slice(-2) : null;
    }
}
