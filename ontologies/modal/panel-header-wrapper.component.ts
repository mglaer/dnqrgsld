import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-panel',
  template: `
      <div class="card">
      <h3 class="card-header">{{ props.label }}</h3>
      <div class="card-body" >
        <ng-container class="p-2" #fieldComponent ></ng-container>
      </div>
    </div>
  `,
})
export class PanelHeaderWrapperComponent extends FieldWrapper {}


/**  Copyright 2021 Formly. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at https://github.com/ngx-formly/ngx-formly/blob/main/LICENSE */