import { Component, Input, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { TaxTypesService } from '../tax-types.service';

@Component({
  selector: 'app-tax-types-modal',
  templateUrl: './tax-types.modal.html',
  providers: [TaxTypesService]
})
export class TaxTypesModalComponent implements OnInit {
  // Resolve Data
  public taxType: FormGroup;
  @Input() item;
  @Input() modalTitle;
  @Input() isEdit;

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder, private taxTypeService: TaxTypesService) {
    this.taxType = fb.group({
      'tax_code': [null],
      'tax_rate': [null, Validators.required],
      'description': [null, Validators.required],
    });
  }

  ngOnInit() {
    if (this.item.id) {
      this.getDetailTaxTypes(this.item.id);
    } else {
      this.generateTaxTypes();
    }
  }

  getDetailTaxTypes(id) {
    this.taxTypeService.getDetailTaxTypeById(id).subscribe((res) => {
      this.taxType.patchValue(res.data);
    });
  }
  generateTaxTypes() {
    this.taxTypeService.generateCode().subscribe((res) => {
      this.taxType.get('tax_code').patchValue(res.data.code);
    });
  }
  numberMaskObjectDecimal(max?) {
    return createNumberMask({
        allowDecimal: true,
        includeThousandsSeparator: false,
        prefix: '',
        integerLimit: max || null
    });
}

  ok() {
    this.activeModal.close(this.taxType.value);
  }

  cancel() {
    this.activeModal.dismiss();
  }
}
