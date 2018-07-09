import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { AdminPanelService } from './admin-panel.service';

@Component({
    selector: 'app-dmin-panel',
    providers: [AdminPanelService],
    templateUrl: 'admin-panel.component.html',
    styleUrls: ['admin-panel.component.scss'],
    animations: [routerTransition()]
})

export class AdminPanelComponent implements OnInit {
    constructor(private activeRouter: ActivatedRoute,
        private router: Router,
        ) {}

    ngOnInit(): void {

    }


}
