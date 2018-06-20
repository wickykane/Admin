import { TableService } from './../../../services/table.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from "../product-mgmt.service";
import { ToastrService } from 'ngx-toastr';
//modal
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemModalContent } from "../../../shared/modals/item.modal";

@Component({ selector: 'app-ecatalog-create', templateUrl: './e-catalog-create.component.html' })
export class ECatalogCreateComponent implements OnInit {
    /**
     * Variable Declaration
     */
    public generalForm: FormGroup;
    public listMaster = {};
    public data = {};
    public items: any = [];
    public listFile: any = [];
    public imageSelected: string = '';

    /**
     * Init Data
     */
    constructor(private fb: FormBuilder, private productService: ProductService, public toastr: ToastrService, private router: Router,
        private modalService: NgbModal) {
        this.generalForm = fb.group({
            'name': [null, Validators.required],
            'is_sync': [null, Validators.required],

        });
    }

    ngOnInit() {
    }
    /**
     * Mater Data
     */

    /**
     * Internal Function
     */
    onFileChange(event) {
        this.listFile = [];
        this.imageSelected = '';
        let reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            let files = event.target.files;
            this.listFile = Object.assign([], files);
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                reader.readAsDataURL(file);
                reader.onload = (e) => {
                    this.imageSelected = e.target['result'];
                }
            }

        }
    }

    // clickAdd() {
    //     this
    //         .data['products']
    //         .push({});
    // };
    // removeRow(index) {
    //     this
    //         .data['products']
    //         .splice(index, 1);
    // }

    toDateObject(date) {
        if (!date)
            return null;
        const dateObject = new Date(date);
        return {
            day: dateObject.getDate(),
            month: dateObject.getMonth() + 1,
            year: dateObject.getFullYear()
        }
    }
    addNewProduct(id) {
        this.items = [];
        const modalRef = this.modalService.open(ItemModalContent, { size: 'lg' });
        modalRef.result.then(res => {
            if (res.length > 0) {
                this.items = Object.assign([], res);
                this.items.forEach(function (item) {
                    if (item.resale_price) item.resale_price = Number(item.resale_price);
                    item['products'] = [];
                    item.qty = 1;
                    item.totalItem = item.resale_price;
                })

            }
        });
        modalRef.componentInstance.id = id;
        modalRef.componentInstance.flagBundle = false;
    }

    createECatalog = function () {
        let params = this.generalForm.value;
        let listID = [];
        this.items.forEach(item => {
            listID.push(item.id);
        });
        params.items = listID;
        let data = {
            data: JSON.stringify(params),
            image: this.listFile[0] || null
        }
        console.log(data);
        this
            .productService
            .postECatalog(data)
            .subscribe(res => {
                try {
                    this
                        .toastr
                        .success(res.message);
                    setTimeout(() => {
                        this
                            .router
                            .navigate(['/product-management/bundle']);
                    }, 500)
                } catch (e) {
                    console.log(e);
                }
            }, err => {
                this
                    .toastr
                    .error(err);
            })

    }

}
