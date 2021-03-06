import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { routerTransition } from '../../../router.animations';
import { DashboardService } from '../dashboard.service';


@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss'],
    animations: [routerTransition()]
})
export class ReportComponent implements OnInit {

    //  bar chart
    partForm: FormGroup;
    repairForm: FormGroup;
    rmaForm: FormGroup;
    saleOrderForm: FormGroup;
    categoryForm: FormGroup;

    // chart1
    public color1: any = [{ backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] }];
    public data1: any = [];
    public label1: any = [];
    public option1 = {
        tooltips: { enabled: true },
        legend: {
            display: false
        },
        scales: {
            yAxes: [{
                display: true
            }]
        }
    };


    // chart2
    public label2: string[] = [];
    public data2: any[] = [{ data: [], label: 'Total sale orders', yAxisID: 'yAxis1' }, { data: [], label: 'Total Revenues', yAxisID: 'yAxis2' }];
    public color2: any = [{ //  green
        backgroundColor: 'rgb(0%, 46%, 0%)',
        pointBackgroundColor: 'rgb(0%, 46%, 0%)',
        pointHoverBackgroundColor: 'rgb(0%, 46%, 0%)',
        borderColor: 'rgb(0%, 46%, 0%)',
        pointBorderColor: '#fff',
        pointHoverBorderColor: 'rgb(0%, 46%, 0%)'
    },
    { //  blue
        backgroundColor: 'rgb(2%, 85%, 92%)',
        pointBackgroundColor: 'rgb(2%, 85%, 92%)',
        pointHoverBackgroundColor: 'rgb(2%, 85%, 92%)',
        borderColor: 'rgb(2%, 85%, 92%)',
        pointBorderColor: '#fff',
        pointHoverBorderColor: 'rgb(2%, 85%, 92%)'
    }];
    public option2: any = {
        legend: { display: true },
        //  title: { display: true, text: 'Top Selling Repair Shop Chart' },
        scales: {
            yAxes: [
                {
                    id: 'yAxis1',
                    type: 'linear',
                    display: true,
                    position: 'left',
                    ticks: {
                        beginAtZero: true
                    }
                },
                {
                    id: 'yAxis2',
                    type: 'linear',
                    display: true,
                    position: 'right',
                    ticks: {
                        callback(value, index, values) {
                            return '$' + value;
                        },
                        beginAtZero: true,
                        min: 0
                    },
                    scaleLabel: {
                        display: true,
                    }
                }
            ],
            xAxes: [{
                display: true,
                ticks: {
                }
            }]
        },
        responsive: true
    };


    // chart3
    public data3: any = [];
    public label3: any = [];
    public option3: any = {
        tooltips: { enabled: true },
        legend: {
            display: false
        }
    };
    // chart4
    public data4: any = [];
    public label4: any = [];

    public filterDate: any[] = [{ id: 1, name: 'Week' }, { id: 2, name: 'Month' }, { id: 3, name: 'Year' }, { id: 4, name: 'Date Range' }];
    public topRank: any[] = [5, 10, 15];
    public listCategory: any = [];
    public listSubCategory: any = [];
    public listPart: any = [];
    public listRepair: any = [];
    public listSaleOrder: any = [];
    public listCat: any = [];

    constructor(public fb: FormBuilder,
        public router: Router,
        private dashboardService: DashboardService) {
        this.partForm = fb.group({
            'order': [null, Validators.required],
            'from_date': [null, Validators.required],
            'to_date': [null, Validators.required],
            'length': [null, Validators.required]
        });
        this.repairForm = fb.group({
            'order': [null, Validators.required],
            'from_date': [null, Validators.required],
            'to_date': [null, Validators.required],
            'length': [null, Validators.required]
        });
        this.rmaForm = fb.group({
            'order': [null, Validators.required],
            'from_date': [null, Validators.required],
            'to_date': [null, Validators.required],
        });
        this.saleOrderForm = fb.group({
            'order': [null, Validators.required],
            'from_date': [null, Validators.required],
            'to_date': [null, Validators.required]
        });
        this.categoryForm = fb.group({
            'order': [null, Validators.required],
            'category': [null, Validators.required],
            'category_id': [null, Validators.required],
            'from_date': [null, Validators.required],
            'to_date': [null, Validators.required],
            'length': [null, Validators.required]
        });
    }

    ngOnInit() {
        this.getListCategory();
    }

    // Initialize function
    getListCategory() {
        this.dashboardService.getRefenceCategory().subscribe(res => {
            try {
                this.listCategory = res.data;
            } catch (e) {

            }
        });
    }

    changeCategory() {
        this.listSubCategory = this.categoryForm.value.category.sub_categories;
    }

    // change Date range
    changeDate(id, flag) {
        if (id !== 4 && id != null && id !== '' && id !== undefined) {
            switch (id) {
                case 1:
                    this.calWeek(flag);
                    break;
                case 2:
                    this.calMonth(flag);
                    break;
                case 3:
                    this.calYear(flag);
                    break;
            }

        }
    }

    calWeek(flag) {
        const d = new Date();
        switch (flag) {
            case 'partForm':
                this.partForm.patchValue({ 'to_date': d.toISOString().slice(0, 10) });
                d.setDate(d.getDate() - 7);
                this.partForm.patchValue({ 'from_date': d.toISOString().slice(0, 10) });
                break;
            case 'repairForm':
                this.repairForm.patchValue({ 'to_date': d.toISOString().slice(0, 10) });
                d.setDate(d.getDate() - 7);
                this.repairForm.patchValue({ 'from_date': d.toISOString().slice(0, 10) });
                break;
            case 'saleOrderForm':
                this.saleOrderForm.patchValue({ 'to_date': d.toISOString().slice(0, 10) });
                d.setDate(d.getDate() - 7);
                this.saleOrderForm.patchValue({ 'from_date': d.toISOString().slice(0, 10) });
                break;
            case 'categoryForm':
                this.categoryForm.patchValue({ 'to_date': d.toISOString().slice(0, 10) });
                d.setDate(d.getDate() - 7);
                this.categoryForm.patchValue({ 'from_date': d.toISOString().slice(0, 10) });
                break;
        }
    }

    calMonth(flag) {
        const d = new Date();
        switch (flag) {
            case 'partForm':
                this.partForm.patchValue({ 'to_date': d.toISOString().slice(0, 10) });
                d.setDate(d.getDate() - 30);
                this.partForm.patchValue({ 'from_date': d.toISOString().slice(0, 10) });
                break;
            case 'repairForm':
                this.repairForm.patchValue({ 'to_date': d.toISOString().slice(0, 10) });
                d.setDate(d.getDate() - 30);
                this.repairForm.patchValue({ 'from_date': d.toISOString().slice(0, 10) });
                break;
            case 'saleOrderForm':
                this.saleOrderForm.patchValue({ 'to_date': d.toISOString().slice(0, 10) });
                d.setDate(d.getDate() - 30);
                this.saleOrderForm.patchValue({ 'from_date': d.toISOString().slice(0, 10) });
                break;
            case 'categoryForm':
                this.categoryForm.patchValue({ 'to_date': d.toISOString().slice(0, 10) });
                d.setDate(d.getDate() - 30);
                this.categoryForm.patchValue({ 'from_date': d.toISOString().slice(0, 10) });
                break;
        }
    }

    calYear(flag) {
        const d = new Date();
        switch (flag) {
            case 'partForm':
                this.partForm.patchValue({ 'to_date': d.toISOString().slice(0, 10) });
                d.setDate(d.getDate() - 365);
                this.partForm.patchValue({ 'from_date': d.toISOString().slice(0, 10) });
                console.log(this.partForm.value);
                break;
            case 'repairForm':
                this.repairForm.patchValue({ 'to_date': d.toISOString().slice(0, 10) });
                d.setDate(d.getDate() - 365);
                this.repairForm.patchValue({ 'from_date': d.toISOString().slice(0, 10) });
                break;
            case 'saleOrderForm':
                this.saleOrderForm.patchValue({ 'to_date': d.toISOString().slice(0, 10) });
                d.setDate(d.getDate() - 365);
                this.saleOrderForm.patchValue({ 'from_date': d.toISOString().slice(0, 10) });
                break;
            case 'categoryForm':
                this.categoryForm.patchValue({ 'to_date': d.toISOString().slice(0, 10) });
                d.setDate(d.getDate() - 365);
                this.categoryForm.patchValue({ 'from_date': d.toISOString().slice(0, 10) });
                break;
        }
    }


    // draw chart
    getListPart() {
        if (this.partForm.value.order === 4) {
            this.partForm.patchValue({ 'from_date': [this.partForm.value.from_date.year, this.partForm.value.from_date.month, this.partForm.value.from_date.day].join('-') });
                this.partForm.patchValue({ 'to_date': [this.partForm.value.to_date.year, this.partForm.value.to_date.month, this.partForm.value.to_date.day].join('-') });
        }

        delete this.partForm.value.order;
        const params = this.partForm.value;
        this.dashboardService.getListPart(params).subscribe(res => {
            try {
                this.listPart = res.data;

                const arr = [];
                for (const i of res.data) {
                    this.label1.push(res.data[i].sku);
                    arr.push(res.data[i].total_qty);
                }

                this.data1 = arr;

            } catch (e) {

            }
        });
    }

    getListRepair() {
        if (this.repairForm.value.order === 4) {
            this.repairForm.patchValue({ 'from_date': [this.repairForm.value.from_date.year, this.repairForm.value.from_date.month, this.repairForm.value.from_date.day].join('-') });
                this.repairForm.patchValue({ 'to_date': [this.repairForm.value.to_date.year, this.repairForm.value.to_date.month, this.repairForm.value.to_date.day].join('-') });
        }

        //  delete this.repairForm.value.order;
        const params = this.repairForm.value;
        this.dashboardService.getListRepair(params).subscribe(res => {
            try {
                this.listRepair = res.data;

                const first = [];
                 const second = [];
                for (const i of res.data) {
                    this.label2.push(res.data[i].buyer_name);
                    first.push(res.data[i].total_ordered);
                    second.push(res.data[i].total_revenue);
                }

                this.data2 = [{ data: first, label: 'Total sale orders', yAxisID: 'yAxis1' }, { data: second, label: 'Total Revenues', yAxisID: 'yAxis2' }];
            } catch (e) {

            }
        });
    }

    getListSaleOrder() {
        if (this.saleOrderForm.value.order === 4) {
            this.saleOrderForm.patchValue({ 'from_date': [this.saleOrderForm.value.from_date.year, this.saleOrderForm.value.from_date.month, this.saleOrderForm.value.from_date.day].join('-') });
                this.saleOrderForm.patchValue({ 'to_date': [this.saleOrderForm.value.to_date.year, this.saleOrderForm.value.to_date.month, this.saleOrderForm.value.to_date.day].join('-') });
        }

        //  delete this.saleOrderForm.value.order;
        const  params = this.saleOrderForm.value;

        this.dashboardService.getListSaleOrder(params).subscribe(res => {
            try {
                this.listSaleOrder = res.data;

                const arr = [];
                for (const i of res.data) {
                    this.label3.push(res.data[i].status_label);
                    arr.push(res.data[i].total_order);
                }

                this.data3 = arr;
            } catch (e) {

            }
        });
    }

    getCategorySold() {
        if (this.categoryForm.value.order) {
            this.categoryForm.patchValue({ 'from_date': [this.categoryForm.value.from_date.year, this.categoryForm.value.from_date.month, this.categoryForm.value.from_date.day].join('-') });
                this.categoryForm.patchValue({ 'to_date': [this.categoryForm.value.to_date.year, this.categoryForm.value.to_date.month, this.categoryForm.value.to_date.day].join('-') });
        }

        //  delete this.categoryForm.value.order;
        //  delete this.categoryForm.value.category;

        const  params = this.categoryForm.value;
        this.dashboardService.getCategorySold(params).subscribe(res => {
            try {
                this.listCat = res.data;
                const arr = [];
                for (const i of res.data) {
                    this.label4.push(res.data[i].brand_name);
                    arr.push(res.data[i].total_qty);
                }

                this.data4 = arr;
            } catch (e) {

            }
        });
    }

    searchAction(flag) {
        switch (flag) {
            case 'partForm':
                this.getListPart();
                break;
            case 'repairForm':
                this.getListRepair();
                break;
            case 'saleOrderForm':
                this.getListSaleOrder();
                break;
            case 'categoryForm':
                this.getCategorySold();
                break;
        }
    }

    resetAction(flag) {
        switch (flag) {
            case 'partForm':
                this.partForm.reset();
                break;
            case 'repairForm':
                this.repairForm.reset();
                break;
            case 'saleOrderForm':
                this.saleOrderForm.reset();
                break;
            case 'categoryForm':
                this.categoryForm.reset();
                break;
        }
    }



}
