import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminPanelService } from './admin-panel.service';
import { routerTransition } from '../../router.animations';

@Component({
    selector: 'admin-panel',
    providers: [AdminPanelService],
    templateUrl: 'admin-panel.component.html',
    animations: [routerTransition()]
})

export class AdminPanelComponent implements OnInit {
    constructor(private activeRouter: ActivatedRoute,
        private router: Router,       
        private AdminPanelService: AdminPanelService) {}   

    ngOnInit(): void {
     
    }

  
}
