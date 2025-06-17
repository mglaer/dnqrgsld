import { Component, OnInit, Inject, Input, ViewChild } from '@angular/core';
import { Users, VUsers } from '../../../../model/structures';
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
import { VGroups } from '../../../../model/structures';
import { MasterService } from 'src/app/services/master.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-redkey-create-project',
  templateUrl: './redkey-create-project.component.html',
  styleUrls: ['./redkey-create-project.component.css']
})
export class RedkeyCreateProjectComponent implements OnInit {
  public faUser = faUser;
  public faLayerGroup = faLayerGroup;
  public faShieldHalved = faShieldHalved;
  public faPen = faPen;
  public faEnvelope = faEnvelope;
  public faPhone = faPhone;
  public faShield = faShield;
  public faBoxArchive = faBoxArchive;
  public user_data: any;
  public security_data: any;
  public security_level_selected: any;
  //
  project_edit_form: FormGroup;
  submitted = false;
  //-----------------------------------------------------------------------------  
  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RedkeyCreateProjectComponent>,
    private service: MasterService,
    private storageService: AuthenticationService,
    private router: Router,
  ) {
    this.project_edit_form = this.formBuilder.group(
      {
        ID: new FormControl(''),
        //ShortTitle: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z][A-Za-z0-9]*$/)]),
        ShortTitle: new FormControl('', Validators.required),
        Description: new FormControl(''),
        SecurityLevel: new FormControl('', Validators.required),        
      },
    );
  }

  ngOnInit(): void {
    this.project_edit_form = this.formBuilder.group(
      {
        ID: new FormControl(''),
        //ShortTitle: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z][A-Za-z0-9]*$/)]),
        ShortTitle: new FormControl('', Validators.required),
        Description: new FormControl(''),
        SecurityLevel: new FormControl('', Validators.required)
      }
    );
    this.InitForm(this.data.ID);
  }
  //----------------------------------------------------
  get f(): { [key: string]: AbstractControl } {
    return this.project_edit_form.controls;
  }
  //----------------------------------------------------
  onSubmit(): void {
    this.submitted = true;
    if (this.project_edit_form.invalid) {
      return;
    }
    this.dialogRef.close({ data: this.project_edit_form.value, security_level: this.security_level_selected });
  }
  //--------------------------------------------------------------
  onReset() {
    this.submitted = false;
    this.project_edit_form.reset();
  }
  //--------------------------------------------------------------
  //--------------------------------------------------------------

  //------------------------------------------------------------------------------
  InitForm(_id: any) {
    //get_user_modal_form
    this.service.GetSecurityList().subscribe((result: any) => {
      //this.user_data = result.user_data;
      this.security_data = result.data;
      let level = this.security_data[0];
      this.security_level_selected = level;
      //fill form
      this.project_edit_form.setValue({
        ID: '',
        ShortTitle: '',
        Description: '',
        SecurityLevel: level.ShortTitle        
      });

    });
  }
  //------------------------------------------------------------------------------
  changeLevel(e: any) {
    this.Level?.setValue(e.target.value, {
      onlySelf: true,
    });
    let split_array: string[] = e.target.value.split(": ");
    this.security_level_selected = this.security_data[split_array[0]];
  }
  //------------------------------------------------------------------------------
  // Access formcontrols getter
  get Level() {
    return this.project_edit_form.get('SecurityLevel');
  }
  //------------------------------------------------------------------------------

}
