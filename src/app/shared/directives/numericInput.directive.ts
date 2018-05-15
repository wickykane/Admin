import { Directive, OnInit, Input } from '@angular/core';
import { NgModel } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

@Directive({ selector: '[appNumeric]', providers: [NgModel] })
export class NumericDirective implements OnInit {
    @Input() allowDecimal;
    @Input() decimalDigit;
    @Input() maxValue;
    @Input() minValue;
    constructor( private ngModel: NgModel, private number: DecimalPipe) {
    }

    NUMBER_REGEXP = /^\s*[-+]?(\d+|\d*\.\d*)\s*$/;
    min = 1;
    max;
    lastValidValue;
    dotSuffix;
    firstDecimalZero;
    positiveInteger = true;
    minNotEqual;
    maxNotEqual;
    maxLength = 9;
    precision = 0;

    ngOnInit(): void {
        if (this.minValue) {
            this.min = this.minValue;
        }

        if (this.maxValue) {
            this.max = this.maxValue;
        }

        if (this.allowDecimal) {
            this.positiveInteger = false;
            this.precision = 2;
            this.min = 0;
        }
    }

    round(value) {
        const num = parseFloat(value);
        const d = Math.pow(10, this.precision);
        return Math.round(num * d) / d;
    }

    formatPrecision(value) {
        return parseFloat(value).toFixed(this.precision);
    }

    getCommaCount(value) {
        let length = 0;
        const matchResult = (value + '').match(/,/g);
        if (matchResult) {
            length = matchResult.length;
        }
        return length;
    }

    formatViewValue(value) {
        return (value) ? '' : '' + value;
    }

    formatToNumber(value) {
        return this.number.transform(value);
    }

     numberLength(value) {
        let  length = 0;
        const matchResult = (value + '').match(/\d/g);
        if (matchResult) {
            length = matchResult.length;
        }
        return length;
    }

    minValidator(value) {
        const invalid = value <= this.min ;
        if (!value && invalid) {
            // ngModelCtrl.$setValidity('min', false);
        } else {
            // ngModelCtrl.$setValidity('min', true);
        }
        return value;
    }

     maxValidator(value) {
        const invalid = value >= this.max;
        // if (!ngModelCtrl.$isEmpty(value) && invalid) {
        //     ngModelCtrl.$setValidity('max', false);
        // } else {
        //     ngModelCtrl.$setValidity('max', true);

        // }
        return value;
    }

}
