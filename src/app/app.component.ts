import { Component, OnInit } from '@angular/core';
import { CustomSpinnerComponent } from './shared/modules/custom-spinner/spinner.component';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    entryComponents: [CustomSpinnerComponent]
})
export class AppComponent implements OnInit {
    constructor() {
    }
    public customSpinnerComponent = CustomSpinnerComponent;
    ngOnInit() {
    }
}
