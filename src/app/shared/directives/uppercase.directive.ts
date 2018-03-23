import { Directive } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({ 
    selector: '[uppercaseText]',
    providers: [NgModel],
    host: {
      '(ngModelChange)' : 'onInputChange($event)'
    }
  })
  export class UppercaseDirective{
    constructor(private model:NgModel){}
  
    onInputChange(event){
      this.model.valueAccessor.writeValue(event.toUpperCase());
    }
  }