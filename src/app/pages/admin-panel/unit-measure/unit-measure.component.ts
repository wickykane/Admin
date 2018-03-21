import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminPanelService } from '../admin-panel.service';
import { routerTransition } from '../../../router.animations';

@Component({
    selector: 'unit-measure',
    providers: [AdminPanelService],
    templateUrl: 'unit-measure.component.html',
    animations: [routerTransition()]
})

export class UnitMeasureComponent implements OnInit {
    constructor(private activeRouter: ActivatedRoute,
        private router: Router,       
        private AdminPanelService: AdminPanelService) {}   

    ngOnInit(): void {
     
    }

  
}
