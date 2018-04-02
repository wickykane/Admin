import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { routerTransition } from '../../../router.animations';
import { DashboardService } from "../dashboard.service";

@Component({
    selector: 'app-promotion',
    templateUrl: './promotion.component.html',
    styleUrls: ['./promotion.component.scss'],
    animations: [routerTransition()]
})
export class PromotionComponent implements OnInit {

    // bar chart
    searchForm: FormGroup;

    public info: any = {};
    //chart 1
    public data1: any = [12, 5, 6];
    public label1: any = ['Red Wine', 'Wine', 'Sparkling'];
    public color1: any = [{ backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"] }];
    public option1: any = {
        tooltips: { enabled: true },
        legend: {
            display: false
        }
    };

    //chart 2
    public data2: any = [12, 5, 6];
    public label2: any = ['Red Wine', 'Wine', 'Sparkling'];
    public option2 = {
        tooltips: {enabled: true},
        legend: {
            display: false
        },
        scales: {
            yAxes: [{
                display: true
            }]
        }
    };

    //chart 3
    public data3: any = [12, 5, 6];
    public label3: any = ['Red Wine', 'Wine', 'Sparkling'];

    //chart 4
    public data4: any = [12, 5, 6];
    public label4: any = ['Red Wine', 'Wine', 'Sparkling'];

    //chart 4
    public data5: any = [7,3];
    public label5: any = ['New', 'Used'];
    public color5: any = [{ backgroundColor: ["#46BFBD","#DCDCDC"] }];
    public option5 = {
        cutoutPercentage: 60,
         animation: false,
         legend: {
             display: false
         },
         responsive: false,
         maintainAspectRatio: false,
         scales: {
             xAxes: [{
                 display: false,
                 ticks: {
                     beginAtZero: false,
                 }
             }],
             yAxes: [{
                 display: false,
                 ticks: {
                     beginAtZero: false,
                 }
             }]
         },
         tooltips: {
             callbacks: {
                 label: function(tooltipItem, data) {

                     var allData = data.datasets[tooltipItem.datasetIndex].data;
                       var tooltipLabel = data.labels[tooltipItem.index];
                       var tooltipData = allData[tooltipItem.index];
                     var total = 0;
                     for (var i in allData) {
                         total += allData[i];
                     }
                     var tooltipPercentage = Math.round((tooltipData / total) * 100);
                     return tooltipLabel + ': ' + tooltipData + ' (' + tooltipPercentage + '%)';
                 }
             }
         },
         elements: {
             center: {
                 text: this.data5[0] + '%',
                 color: '#000000', // Default is #000000
                 fontStyle: 'Arial', // Default is Arial
                 sidePadding: 15 // Defualt is 20 (as a percentage)
             }
        }
    }

    //chart 6
    public data6: any = [12, 5, 6];
    public label6: any = ['Red Wine', 'Wine', 'Sparkling'];



    constructor(public fb: FormBuilder,
        public router: Router,
        private dashboardService: DashboardService) {
        this.searchForm = fb.group({
            'from': [null, Validators.required],
            'to': [null, Validators.required]
        });
    }

    ngOnInit() {
        // this.topEffectCampaignSaleAmount();
        // this.topProductRevenue();
        // this.topProductSoldByCategory();
        // this.topCustomerCampaignPeriod();
        // this.topBuyerBySaleAmount();
    }

    topProductSoldByCategory() {
        this.dashboardService.topProductSoldByCategory().subscribe(res => {
            try {

                let data = res.data.results;
                data.forEach(function(element) {
                    this.label1.push(element.category_name);
                    this.data1.push(element.qty_used);
                });
            } catch (e) {
                console.log(e);
            }
        })
    }

    searchAction() {
        let params = {
            from: [this.searchForm.value.from.year, this.searchForm.value.from.month, this.searchForm.value.from.day].join('-'),
            to: [this.searchForm.value.from.year, this.searchForm.value.from.month, this.searchForm.value.from.day].join('-')
        }

        this.dashboardService.getOverAllCount(params).subscribe(res => {
            try {
                this.info['budgets'] = res.results.total_budget;
                this.info['campaign'] = res.results.total_campaign;
                this.info['programs'] = res.results.total_program;
            } catch (e) {

            }
        })
    }

    resetAction() {
        this.searchForm.reset();
    }
    showTableSO(){
        
    }

}
