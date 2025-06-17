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
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  public faUser = faUser;
  public faLayerGroup = faLayerGroup;
  public faShieldHalved = faShieldHalved;
  public faPen = faPen;
  public faEnvelope = faEnvelope;
  public faPhone = faPhone;
  public faShield = faShield;
  public faBoxArchive = faBoxArchive;
  displayedColumns: string[] = ['ID', 'ShortTitle'];
  dataSourceGroups: any;
  group_data: any;
  selected_group: any;
  public user_data: any;
  public security_data: any;
  public security_level_selected: any;
  //
  user_edit_form: FormGroup;
  submitted = false;
  //
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  //-----------------------------------------------------------------------------  
  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateUserComponent>,
    private service: MasterService,
    private _formBuilder: FormBuilder,
    private storageService: AuthenticationService,
    private router: Router,
  ) { 
    this.user_edit_form = this.formBuilder.group(
      {
        ID: new FormControl(''),
        Login: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z][A-Za-z0-9]*$/)]),
        FirstName: new FormControl('', Validators.required),
        LastName: new FormControl('', Validators.required),
        MiddleName: new FormControl('', Validators.required),
        //Email: new FormControl('', [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]),
        Email: new FormControl('', Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)),
        //Phone: new FormControl('', Validators.required),
        Phone: new FormControl(''),
        SecurityLevel: new FormControl('', Validators.required),
        //Password: new FormControl('', Validators.required),
        //password_confirm: ['', Validators.required, MustMatch],
        Password: new FormControl(''),
        password_confirm: ['', MustMatch],
      },

      /*{
        validator: MustMatch('password', 'password_confirm')
      }*/
    );
    //this.user_edit_form.setValue({ login: 'preved' });
  }

  ngOnInit(): void {
    this.user_edit_form = this.formBuilder.group(
      {
        ID: new FormControl(''),
        Login: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z][A-Za-z0-9]*$/)]),
        FirstName: new FormControl('', Validators.required),
        LastName: new FormControl('', Validators.required),
        MiddleName: new FormControl('', Validators.required),
        //Email: new FormControl('', [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]),
        Email: new FormControl('', Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)),
        //Phone: new FormControl('', Validators.required),
        Phone: new FormControl(''),
        SecurityLevel: new FormControl('', Validators.required),
        //Password: ['', Validators.required],
        //password_confirm: ['', [Validators.required, MustMatch]],        
        Password: [''],
        password_confirm: ['', [MustMatch]],

      },
      {
        validator: MustMatch('Password', 'password_confirm')
      }
    );
    this.InitForm(this.data.ID);
  }
//----------------------------------------------------
get f(): { [key: string]: AbstractControl } {
  return this.user_edit_form.controls;
}
//----------------------------------------------------
onSubmit(): void {
  this.submitted = true;
  if (this.user_edit_form.invalid) {
    return;
  }
  this.dialogRef.close({ data: this.user_edit_form.value, security_level: this.security_level_selected });
}
//--------------------------------------------------------------
onReset() {
  this.submitted = false;
  this.user_edit_form.reset();
}
//--------------------------------------------------------------
//--------------------------------------------------------------

//------------------------------------------------------------------------------
InitForm(_id: any) {
  //get_user_modal_form
  this.service.GetSecurityList().subscribe((result: any) => {
    //this.user_data = result.user_data;
    this.security_data = result.data;
    let level =  this.security_data[0];
    this.security_level_selected = level;
    //fill form
    this.user_edit_form.setValue({
      ID: '',
      Login: '',
      FirstName: '',
      LastName: '',
      MiddleName: '',
      Email: '',
      Phone: '',
      SecurityLevel: level.ShortTitle,
      Password: "",
      password_confirm: ""      
    });
    
    /*if (result.membership_data != null) {
      this.storageService.saveToken(result.jwt);
      //
      this.security_level_selected = level;
      //
      this.group_data = result.membership_data;
      this.dataSourceGroups = new MatTableDataSource<VGroups>(this.group_data);
      this.dataSourceGroups.paginator = this.paginator;
      this.dataSourceGroups.sort = this.sort;
    }*/
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
  return this.user_edit_form.get('SecurityLevel');
}
//------------------------------------------------------------------------------
Filterchange(event: Event) {
  const filvalue = (event.target as HTMLInputElement).value;
  this.dataSourceGroups.filter = filvalue;
}
//------------------------------------------------------------------------------
getrow(row: any) {
  this.selected_group = row;
  //console.log(row);
}
//------------------------------------------------------------------------------

}
