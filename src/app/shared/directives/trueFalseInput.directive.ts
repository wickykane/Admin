import { Directive, Input, ElementRef, Renderer2, HostListener, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
@Directive(
    {
        selector: 'input[type=checkbox][trueFalseValue]',
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => TrueFalseValueDirective),
                multi: true
            }
        ]
    }
)
export class TrueFalseValueDirective implements ControlValueAccessor {
    @Input() trueValue = true;
    @Input() falseValue = false;
    private propagateChange = (_: any) => { };
    constructor(private elementRef: ElementRef, private renderer: Renderer2) { }
    writeValue(obj: any): void {
        if (obj === this.trueValue) {
            this.renderer.setProperty(this.elementRef.nativeElement, 'checked', true);
        } else {
            this.renderer.setProperty(this.elementRef.nativeElement, 'checked', false);
        }
    }
    @HostListener('change', ['$event'])
    onHostChange(ev) {
        this.propagateChange(ev.target.checked ? this.trueValue : this.falseValue);
    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {

    }

}