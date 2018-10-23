import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { ROUTE_PERMISSION } from '../../services/route-permission.config';
import { StorageService } from './../../services/storage.service';
import { AdminPanelService } from './admin-panel.service';

@Component({
    selector: 'app-dmin-panel',
    providers: [AdminPanelService],
    templateUrl: 'admin-panel.component.html',
    styleUrls: ['admin-panel.component.scss'],
    animations: [routerTransition()]
})

export class AdminPanelComponent implements OnInit {

  routePermission = {};

    constructor(private activeRouter: ActivatedRoute,
        private router: Router,
        private storage: StorageService,
        ) {}

    ngOnInit(): void {
      console.log(this.storage);
      this.routePermission = { ...ROUTE_PERMISSION['menu'] };
      const userPermission = this.storage.getValue('permission');
      Object.keys(this.routePermission).forEach(item => {
          this.routePermission[item] = (userPermission.indexOf(item) !== -1) ? true : false;
      });
    }


}
