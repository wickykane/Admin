import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { CustomerService } from '../../customer.service';


@Component({
    selector: 'app-customer-address-tab',
    templateUrl: './address-tab.component.html',
    styleUrls: ['./information-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerAddressTabComponent implements OnInit {

    /**
     * letiable Declaration
     */
    @Input() set listData(data) {
        this.list.items = data || [];
    }

    public list = {
        items: []
    };

    constructor(private customerService: CustomerService, private cd: ChangeDetectorRef) {

    }

    ngOnInit() {
        this.customerService.getRoute().subscribe(res => {
            let t = setInterval(() => {
                for (let i = 0; i < this.list.items.length; i++) {
                    if (this.list.items[i].route_id > 0) {
                        clearInterval(t);
                        console.log(this.list.items[i]);
                        for (let j = 0; j < res.data.length; j++) {
                            if (res.data[j].id == this.list.items[i].route_id) {
                                this.list.items[i]['route_name'] = res.data[j].route_gatetime;
                                console.log(res.data[j].route_gatetime);
                            }
                        }
                    }
                }
            }, 500);
            this.refresh();
        });

    }

    refresh() {
        this.cd.detectChanges();
    }
}
