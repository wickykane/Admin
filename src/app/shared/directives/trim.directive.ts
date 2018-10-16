import { Directive } from '@angular/core';
import { NgControl, NgModel } from '@angular/forms';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: 'input[type=text]',
    // tslint:disable-next-line:use-host-property-decorator
    host: {
        '(blur)': 'onBlur($event)',
    },
    providers: [NgModel],
})
export class TrimDirective {
    constructor(private ngModel: NgModel, private formControl: NgControl) { }

    onBlur($event) {
        const value = ($event.target.value || '').trim();
        this.ngModel.viewToModelUpdate(value);
        this.ngModel.valueAccessor.writeValue(value);
        this.formControl.control.setValue(value);
    }
}
