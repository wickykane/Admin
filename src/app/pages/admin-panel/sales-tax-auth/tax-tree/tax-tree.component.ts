import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-tax-tree',
    templateUrl: 'tax-tree.component.html',
    styleUrls: ['tax-tree.component.scss']
})

export class TaxTreeComponent implements OnInit {

    @Input() taxAuthorityCountries;
    @Input() listPermission = {};

    @Output() selectedCountry = new EventEmitter();
    @Output() selectedState = new EventEmitter();

    constructor() { }

    ngOnInit() { }

    selectCountry(country) {
        this.selectedCountry.emit(country);
    }

    onClickCountry(event, country) {
        event.stopPropagation();
        this.selectCountry(country);
    }

    selectState(state) {
        this.selectedState.emit(state);
    }

    onClickState(event, state) {
        event.stopPropagation();
        this.selectState(state);
    }
}
