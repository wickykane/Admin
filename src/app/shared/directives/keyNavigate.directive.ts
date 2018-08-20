import { Directive, ElementRef, HostListener, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from 'events';
declare var jQuery: any;

@Directive({ selector: '[appKeyNavigate]' })
export class KeyNavigateDirective implements OnInit {
    public _element;
    public _config;

    @Input() set keyConfig(config) {
        this._config = config;
    }

    @Output() keyConfigChange = new EventEmitter();

    @Input('appKeyNavigate') appKeyNavigate;
    constructor(element: ElementRef) {
        this._element = element;
    }

    @HostListener('keydown', ['$event'])
    onkeydown(event) {
        if (event.shiftKey && event.key === 'Tab') {
            event.preventDefault();
            const prev = this._config[this._config[this.appKeyNavigate].prev].element.nativeElement;
            if (prev) {
                prev.focus();
            }
        }
        if (!event.shiftKey && event.key === 'Tab') {
            event.preventDefault();
            const next = this._config[this._config[this.appKeyNavigate].next].element.nativeElement;
            if (next) {
                next.focus();
            }
        }

    }
    ngOnInit(): void {
        if (this._config) {
            this._config[this.appKeyNavigate].element = this._element;
            this.keyConfigChange.emit(this._config);
        }
    }
}
