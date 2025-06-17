import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-panel',
  host: {
    '(change)': 'onChange($event)',
    '(blur)': 'onTouched()',
  },
  template: `
  <div class="row">

    <div class="col-12">
    <!--<div class="col-10">-->
    
    <div class="card">
        <h3 class="card-header">{{ props.label }}</h3>        
        <div class="card-body row" >
          <ng-container class="p-2" #fieldComponent ></ng-container>  
        </div>
      </div>
    </div>

    <!--<div class="col-2"> 
    <img id="preview" src="{{ img_path }}" style="object-fit: cover;max-width: 95%; max-height: 95%; background-color:gray;">
    </div>-->
  </div>      
  `
})
export class HeaderTemplateWrapperComponent extends FieldWrapper {
  public img_path:string="";
  
  value: any;
  onChange = (event: any) => {
    //console.log('changed');
    //---
    var reader = new FileReader();

    reader.onload = (event: any) => {
      this.img_path = event.target.result;
    };

    reader.onerror = (event: any) => {
      console.log("File could not be read: " + event.target.error.code);
    };

    reader.readAsDataURL(event.target.files[0]);

    //---
  };
  onTouched = () => {
    console.log('touched');
  };

  writeValue(_value: any) {}
  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}


/**  Copyright 2021 Formly. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at https://github.com/ngx-formly/ngx-formly/blob/main/LICENSE */