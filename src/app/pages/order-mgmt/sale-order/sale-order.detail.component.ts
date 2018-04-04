import { PrintHtmlService } from './../../../services/print.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { OrderService } from "../order-mgmt.service";
import { ToastrService } from 'ngx-toastr';
import { InvoiceModalContent } from "./modals/invoice.modal";

@Component({
  selector: 'app-detail-order',
  templateUrl: './sale-order.detail.component.html',
  styleUrls: ['./sale-order.component.scss'],
  providers: [PrintHtmlService]
})

export class SaleOrderDetailComponent implements OnInit {
  /**
   * Variable Declaration
   */
  public detail = {
    information: [],
    history: [],
    subs: [],
    general: [],
    buyer_info: [],
    billing: []
  };
  public linkIframe;
  public invList;
  data = {};
  /**
   * Init Data
   */
  constructor(public sanitizer: DomSanitizer, private modalService: NgbModal, private printService: PrintHtmlService, public toastr: ToastrService, private router: Router, private orderService: OrderService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.data["id"] = this.route.snapshot.paramMap.get('id');
    this.getDetail(this.data["id"]);
    this.getInvoice(this.data["id"]);
  }
  /**
   * Mater Data
   */
  getDetail(id) {
    if (id) {
      this.orderService.getOrderDetail(id).subscribe(res => {
        try {
          this.detail.information = res.data.order_detail;
          this.detail['billing'] = res.data.billing_info[0];
          this.detail['general'] = res.data;
          this.detail['subs'] = res.data.subs;
          this.detail['buyer_info'] = res.data.buyer_info;
          this.getHistoryByOrder(this.detail['general']['code']);
          this.linkIframe = this.getSrcIframe(this.detail['general']['code']);
        } catch (e) {
          console.log(e);
        }
      })
    }
  };

  /**
   * Internal Function
   */
  showDetail(objInv) {
    const modalRef = this.modalService.open(InvoiceModalContent, { size: 'lg' });
    modalRef.result.then(
      res => {
        if (res) {
          this.printInvoice();
        }
      },
      reason => { }
    );
    modalRef.componentInstance.detail = objInv;
    modalRef.componentInstance.name = "INVOICE NO :" + objInv.general.invoice_num;
  }

  getInvoice(order_id) {
    this.orderService.getInvoice(order_id).subscribe((res) => {
      this.data['invList'] = res.results.rows;
    })
  }

  getHistoryByOrder(code) {
    this.orderService.getHistoryByCode(code).subscribe((res) => {
      this.data['history'] = res.results.rows;
    })
  }

  getSrcIframe(order_num) {
    let url = 'http://wms360.nabp-demo.seldatdirect.com/fe-upload/?transaction=' + order_num;
    return url;
  }

  printInvoice() {
    var innerContents = document.getElementById('printInvoice').innerHTML;
    var popupWinindow = window.open('', '_blank', 'width=860,height=600,fullscreen=yes,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
    popupWinindow.document.open();
    popupWinindow.document.write('' +
      '<html>' +
      '<head>' +
      '<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400italic,600,700%7COpen+Sans:300,400,400italic,600,700"/>' +
      '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">' +
      '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>' +
      '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>' +
      '<style type="text/css">' +
      'body{-webkit-print-color-adjust: exact; overflow: scroll; font-size: 9px;}' +
      '@media print{body{font-size: 9px;} thead {display: table-header-group;}}' +
      '@media print {table >tr.vendorListHeading {background-color:#cccccc !important; -webkit-print-color-adjust: exact; font-weight:normal; border-top:1px solid grey}}' +
      '@media print { th{background-color:#cccccc !important; height: 30px; padding: 5px; font-size: 9px;}}' +
      '@media print {' +
      'table {tbody>tr>td {padding: 5px;}} ' +
      '.pagebreak { page-break-before: always; }' +
      '}' +
      '.row {margin: 0;} .txt-title {color: #646464; font-weight: bold;}' +
      'table{margin-bottom:15px; }' +
      'table>tr.vendorListHeading>td { font-weight: normal; padding:10px; font-size:13px;line-height: 1.42857143;vertical-align: top;} ' +
      'table>tr>td {padding:10px; font-size:13px;line-height: 1.42857143;vertical-align: top;} ' +
      '.mrg-top {margin-top: 20px;} .mrg-none {margin: 0;}' +
      '.float-l {float: left; width: 50%;} ' +
      '.float-r {float: right; width: 50%;} ' +
      '.float-l3 {float: left; width: 33%;} .float-r3 {float: right; width: 33%;} ' +
      '.float-lcol-2 {float: left; min-width: 100px;} .float-rcol-2 {float: right; min-width: 100px;} ' +
      '.float-l100 {float: left; width: 100%;} .float-r100 {float: right; width: 100%}' +
      '.padding-none {padding: 0;} ' +
      '.padding-t {padding-top: 3%}' +
      'thead {background-color: #dddddd; } .bg-gray {background-color: #dddddd;}' +
      'thead >tr{border-bottom:grey} ' +
      'table>tbody>tr>td {padding: 5px; font-size: 9px;}' +
      '#table-total>tr>td{ padding:10px;}' +
      '#table-total>tr>td>span{font-weight:600 }' +
      '#table-total>tr.remove-boder>td{border-left:none;border-right:none}' +
      'table.table-footer>thead>tr>th{padding:5px;border:none}' +
      'table.table-footer>tbody>tr>td{padding:5px;border:none}' +
      '#footer p{margin-bottom:5px;}' +
      '</style>' +
      '<title>' + this.detail.general['invoice_num'] + '</title>' +
      '</head>' +
      '<body onload="window.print()">' + innerContents + '</html>');
    popupWinindow.document.close();
  };

  printOrder() {
    var innerContents = document.getElementById('printOrder').innerHTML;
    var popupWinindow = window.open('', '_blank', 'width=860,height=600,fullscreen=yes,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
    popupWinindow.document.open();
    popupWinindow.document.write('' +
      '<html>' +
      '<head>' +
      '<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400italic,600,700%7COpen+Sans:300,400,400italic,600,700"/>' +
      '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">' +
      '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>' +
      '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>' +
      '<style type="text/css">' +
      'body{-webkit-print-color-adjust: exact; overflow: scroll; font-size: 9px;}' +
      '@media print{body{font-size: 9px;} thead {display: table-header-group;}}' +
      '@media print {table >tr.vendorListHeading {background-color:#cccccc !important; -webkit-print-color-adjust: exact; font-weight:normal; border-top:1px solid grey}}' +
      '@media print { th{background-color:#cccccc !important; height: 30px; padding: 5px; font-size: 9px;}}' +
      '@media print {' +
      'table {tbody>tr>td {padding: 5px;}} ' +
      '.pagebreak { page-break-before: always; }' +
      '}' +
      '.row {margin: 0;} .txt-title {color: #646464; font-weight: bold;}' +
      'table{margin-bottom:15px; }' +
      'table>tr.vendorListHeading>td { font-weight: normal; padding:10px; font-size:13px;line-height: 1.42857143;vertical-align: top;} ' +
      'table>tr>td {padding:10px; font-size:13px;line-height: 1.42857143;vertical-align: top;} ' +
      '.mrg-top {margin-top: 20px;} .mrg-none {margin: 0;}' +
      '.float-l {float: left; width: 50%;} ' +
      '.float-r {float: right; width: 50%;} ' +
      '.float-l3 {float: left; width: 33%;} .float-r3 {float: right; width: 33%;} ' +
      '.float-lcol-2 {float: left; min-width: 100px;} .float-rcol-2 {float: right; min-width: 100px;} ' +
      '.float-l100 {float: left; width: 100%;} .float-r100 {float: right; width: 100%}' +
      '.padding-none {padding: 0;} ' +
      '.padding-t {padding-top: 3%}' +
      'thead {background-color: #dddddd; } .bg-gray {background-color: #dddddd;}' +
      'thead >tr{border-bottom:grey} ' +
      'table>tbody>tr>td {padding: 5px; font-size: 9px;}' +
      '#table-total>tr>td{ padding:10px;}' +
      '#table-total>tr>td>span{font-weight:600 }' +
      '#table-total>tr.remove-boder>td{border-left:none;border-right:none}' +
      'table.table-footer>thead>tr>th{padding:5px;border:none}' +
      'table.table-footer>tbody>tr>td{padding:5px;border:none}' +
      '#footer p{margin-bottom:5px;}' +
      '</style>' +
      '<title>' + this.detail.general['code'] + '</title>' +
      '</head>' +
      '<body onload="window.print()">' + innerContents + '</html>');
    popupWinindow.document.close();
  };

}
