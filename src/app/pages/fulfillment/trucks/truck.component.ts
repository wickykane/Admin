import { environment } from './../../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: 'selector-name',
    templateUrl: 'truck.component.html'
})

export class TruckComponent implements OnInit {
    constructor(public sanitizer: DomSanitizer) { }
    ngOnInit() { }
    SRS_URL = environment.srs_url;
}