import { Component, OnInit, Inject, Input, ViewChild } from '@angular/core';
import { Groups, VGroups } from '../../../../model/structures';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import Validation from '../../../../utils/validation';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MustMatch } from '../../../../_helpers/must-match.validator';
import {
  faShieldHalved,
  faPen,
  faEnvelope,
  faPhone,
  faShield,
  faBoxArchive,
  faUser,
  faLayerGroup
} from '@fortawesome/free-solid-svg-icons';
import { MatTableDataSource } from '@angular/material/table';
import { Sort, MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MasterService } from 'src/app/services/master.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-add-targeted',
  templateUrl: './add-targeted.component.html',
  styleUrls: ['./add-targeted.component.css']
})
export class AddTargetedComponent implements OnInit {
  public faUser = faUser;
  public faLayerGroup = faLayerGroup;
  public faShieldHalved = faShieldHalved;
  public faPen = faPen;
  public faEnvelope = faEnvelope;
  public faPhone = faPhone;
  public faShield = faShield;
  public faBoxArchive = faBoxArchive;
  //displayedColumns: string[] = ['Name','Value'];
  //dataSourceGroups: any;
  type_targeted_selected: any;
  public group_data: any;
  //public security_data: any;
  //public security_level_selected: any;
  //
  targeted_form: FormGroup;
  public type_targeted: any;
  
  submitted = false;
  //
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  //-----------------------------------------------------------------------------  
  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddTargetedComponent>,
    private service: MasterService,
    private _formBuilder: FormBuilder,
    private storageService: AuthenticationService,
    private router: Router,
  ) { 
    this.targeted_form = this.formBuilder.group(
      {
        ID: new FormControl(''),
        PassportCSTP: new FormControl(''),
        Name: new FormControl('', Validators.required),
        Volume: new FormControl(''),
        TypeTargeted: new FormControl(''),        
      }
    )
  }

  ngOnInit(): void {
    this.targeted_form = this.formBuilder.group(
      {
        ID: new FormControl(''),
        PassportCSTP: new FormControl(''),
        Name: new FormControl('', Validators.required),
        Volume: new FormControl(''),
        TypeTargeted: new FormControl(''),        
      }
    );
    this.InitForm(this.data.ID);
  }
//----------------------------------------------------
get f(): { [key: string]: AbstractControl } {
  return this.targeted_form.controls;
}
//----------------------------------------------------
onSubmit(): void {
  this.submitted = true;
  if (this.targeted_form.invalid) {
    return;
  }
  this.dialogRef.close({ data: this.targeted_form.value, targeted: this.type_targeted_selected });
}
//--------------------------------------------------------------
onReset() {
  this.submitted = false;
  this.targeted_form.reset();
}
//--------------------------------------------------------------
//--------------------------------------------------------------

//------------------------------------------------------------------------------
InitForm(_id: any) {
  //---
  this.service.GetTypeTargetedList().subscribe((result: any) => {
    this.type_targeted = result.data;
    let type = this.type_targeted[0];
    this.type_targeted_selected = type;
    //fill form        
    this.targeted_form.setValue({
      ID: '',
      PassportCSTP: '',
      Name: '',
      Value: '',
      TypeTargeted: type.Name,
    });
  });
  //---
}
//------------------------------------------------------------------------------
changeType(e: any) {
  this.Type?.setValue(e.target.value, {
    onlySelf: true,
  });
  let split_array: string[] = e.target.value.split(": ");
  this.type_targeted_selected = this.type_targeted[split_array[0]];
}
//------------------------------------------------------------------------------
 // Access formcontrols getter
 get Type() {
  return this.targeted_form.get('TypeTargeted');
}
//------------------------------------------------------------------------------
/*Filterchange(event: Event) {
  const filvalue = (event.target as HTMLInputElement).value;
  this.dataSourceGroups.filter = filvalue;
}*/
//------------------------------------------------------------------------------
/*getrow(row: any) {
  this.selected_group = row;
  //console.log(row);
}*/
//------------------------------------------------------------------------------
}
