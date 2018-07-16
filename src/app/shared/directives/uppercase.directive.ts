import { Directive } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[uppercaseText]',
    providers: [NgModel],
    // tslint:disable-next-line:use-host-property-decorator
    host: {
        '(ngModelChange)': 'onInputChange($event)'
    }
})
export class UppercaseDirective {
    constructor(private model: NgModel) { }

    onInputChange(event) {
        this.model.valueAccessor.writeValue(event.toUpperCase());
    }
}
