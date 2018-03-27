import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminPanelService } from '../admin-panel.service';
import { TableService } from "../../../services/index";
import { routerTransition } from '../../../router.animations';

@Component({
    selector: 'work-flow',
    providers: [AdminPanelService],
    templateUrl: 'work-flow.component.html',
    styleUrls: ['work-flow.component.scss'],    
    animations: [routerTransition()]
})

export class WorkFlowComponent implements OnInit {
    constructor(
        private TableService: TableService,
        private activeRouter: ActivatedRoute,
        private router: Router,
        private AdminPanelService: AdminPanelService) { }
    ngOnInit(): void {

    }

    goDetail() {
        this.router.navigate(['/admin-panel/work-flow/edit']);
    }
}
