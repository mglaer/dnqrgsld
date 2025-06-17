import { Component, OnInit, ViewChild, ViewContainerRef, Inject } from '@angular/core';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Params, Router, RouteReuseStrategy } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { VPassportCSTP, PassportCSTP, VTargeted, Targeted, SecurityLevel } from '../../../../model/structures';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  faLayerGroup,
  faL
} from '@fortawesome/free-solid-svg-icons';
import { Sort, MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { VGroups } from '../../../../model/structures';
import { MasterService } from 'src/app/services/master.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { cnst } from '../../../../model/cnst';
//import {TranslateService} from '@ngx-translate/core';
//import {DateAdapter} from '@angular/material/core';

import moment from 'moment';
import { DateAdapter } from '@angular/material/core';



@Component({
  selector: 'app-cstp-create-passport',
  templateUrl: './cstp-create-passport.component.html',
  styleUrls: ['./cstp-create-passport.component.css'],
})
export class CstpCreatePassportComponent implements OnInit {
  //----------
  public faUser = faUser;
  public faLayerGroup = faLayerGroup;
  public faShieldHalved = faShieldHalved;
  public faPen = faPen;
  public faEnvelope = faEnvelope;
  public faPhone = faPhone;
  public faShield = faShield;
  public faBoxArchive = faBoxArchive;
  //

  //
  public ID!: number;
  passport_common = <PassportCSTP>{};
  submitted = false;
  //passport_target_characteristics!:Targeted;

  public security_data: any;
  public security_level_selected: any;
  //
  public type_targeted: any;
  public type_targeted_selected: any;
  //
  passport_common_form: FormGroup;
  targeted_form: FormGroup;
  //passport_target_characteristics_form: FormGroup;
  public date_init: string = '';
  public date_start: string = '';
  public date_end: string = '';
  //  
  //-------------------------------------
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private service: MasterService,
    private _formBuilder: FormBuilder,
    private storageService: AuthenticationService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    //public translate: TranslateService, private dateAdapter: DateAdapter<Date>    
    private dateAdapter: DateAdapter<any>
  ) {
    this.dateAdapter.setLocale('ru');
    this.passport_common_form = this.formBuilder.group(
      {
        ID: new FormControl(''),
        ShortTitle: new FormControl('', Validators.required),
        SecurityLevel: new FormControl('', Validators.required),
        //ArchiveSign: new FormControl(''),
        //SecurityID: new FormControl(''),
        Goal: new FormControl(''),
        Type: new FormControl(''),
        DateInitiation: new FormControl('', Validators.required),
        Document: new FormControl(''),
        Members: new FormControl(''),
        StartDate: new FormControl('', Validators.required),
        EndDate: new FormControl('', Validators.required),
        Costs: new FormControl('')
      }
    );
    //
    this.targeted_form = this.formBuilder.group(
      {
        ID: new FormControl(''),
        TypeTargeted: new FormControl('', Validators.required),
        Name: new FormControl('', Validators.required),
        Value: new FormControl('')
      }
    );
  }
  //---------------------------------------------------------------------------------
  ngOnInit(): void {

    //this.languageList = Object.keys(Languages).filter(String);
    this.route.params.subscribe((params: Params) => {
      this.ID = params['id'];
      this.InitForm();
    });


    //this.translate.use('ru');
    //this.dateAdapter.setLocale('ru');
  }
  //----------------------------------------------------

  //----------------------------------------------------
  /*public useLanguage(language: Languages): void {
    this.translate.use('ru');
    this.dateAdapter.setLocale('ru');
    //this.translate.use(language);
    //this.dateAdapter.setLocale(language);
  }*/
  //----------------------------------------------------
  get f(): { [key: string]: AbstractControl } {
    return this.passport_common_form.controls;
  }
  //----------------------------------------------------
  onSubmit(): void {
    /*
    this.submitted = true;
    if (this.passport_common_form.invalid) {
      return;
    }
    this.dialogRef.close({ data: this.passport_common_form.value, security_level: this.security_level_selected });
    */
  }
  //-------------------
  AddTargeted()
  {
    console.log('FunctionCreateTemplate');
    //this.router.navigate(['home/create-entity-master', { parent_id: this.parent_data.ID }]);
  }    
  //----------------------------------------------------
  onSubmitAdd(): void {
    /*
    this.submitted = true;
    if (this.passport_common_form.invalid) {
      return;
    }
    this.dialogRef.close({ data: this.passport_common_form.value, security_level: this.security_level_selected });
    */
  }
  //-------------------------------------------------------------
  GetAll() {

  }
  //--------------------------------------------------------------
  InitForm() {
    this.service.GetSecurityList().subscribe((result: any) => {
      this.security_data = result.data;
      let level = this.security_data[0];
      this.security_level_selected = level;
      //fill form
      this.passport_common_form.setValue({
        ID: '',
        ShortTitle: '',
        SecurityLevel: level.Level,
        //ArchiveSign: false,
        //SecurityID: '',
        Goal: '',
        Type: '',
        DateInitiation: '',//new Date,
        Document: '',
        Members: '',
        StartDate: '',
        EndDate: '',
        Costs: ''
      });
      //---      
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
  /*changeType(e: any) {
    this.Type?.setValue(e.target.value, {
      onlySelf: true,
    });
    let split_array: string[] = e.target.value.split(": ");
    this.security_level_selected = this.security_data[split_array[0]];
  }*/
  //------------------------------------------------------------------------------
  // Access formcontrols getter
  get Level() {
    return this.passport_common_form.get('SecurityLevel');
  }
  //------------------------------------------------------------------------------
  // Access formcontrols getter
  /*
  get Type() {
    return this.targeted_form.get('TypeTargeted');
  }*/
  //------------------------------------------------------------------------------
  save() {
    //let _dt='26/01/2023';
    //let _f = this.passport_common_form.getRawValue();
    this.passport_common.ShortTitle = this.passport_common_form.value.ShortTitle;//this.model.header.ShortTitle;
    this.passport_common.ArchiveSign = false;
    //let _y =parseInt(this.security_data.filter((word: SecurityLevel) => (word.Level == this.passport_common_form.value.SecurityLevel))[0].ID);
    this.passport_common.SecurityLevel = this.security_level_selected.ID;//_y;//parseInt(this.security_data.filter((word: SecurityLevel) => (word.Level == this.passport_common_form.value.SecurityLevel))[0].ID);
    this.passport_common.SecurityID = 71;
    this.passport_common.Goal = this.passport_common_form.value.Goal;
    this.passport_common.Type = this.passport_common_form.value.Type;
    this.passport_common.DateInitiation = moment(this.passport_common_form.value.DateInitiation).format('DD.MM.YYYY');//this.passport_common_form.value.DateInitiation;
    this.passport_common.Document = this.passport_common_form.value.Document;
    this.passport_common.Members = this.passport_common_form.value.Members;
    this.passport_common.StartDate = moment(this.passport_common_form.value.StartDate).format('DD.MM.YYYY');//this.passport_common_form.value.StartDate;
    this.passport_common.EndDate = moment(this.passport_common_form.value.EndDate).format('DD.MM.YYYY');//this.passport_common_form.value.EndDate;
    this.passport_common.Costs = this.passport_common_form.value.Costs;
    if (this.ID != undefined) {//update
      this.service.UpdatePassportCSTP(this.passport_common).subscribe((result: any) => {
        if (result.res == 'success') {
          this._snackBar.open('Паспорт КНТП успешно обновлен', '', {
            duration: 1000,
            panelClass: ['blue-snackbar']
          });
        }
        else {
          this._snackBar.open('Ошибка сервера', '', {
            duration: 1000,
            panelClass: ['red-snackbar']
          })
        }
      },
        err0 => {
          console.log('error: ' + err0);
        }
      );
    }
    else {//create
      this.service.CreatePassportCstp(this.passport_common).subscribe((result: any) => {
        if (result.res == 'success') {
          this._snackBar.open('Паспорт КНТП успешно создан', '', {
            duration: 1000,
            panelClass: ['blue-snackbar']
          });
        }
        else {
          this._snackBar.open('Ошибка сервера', '', {
            duration: 1000,
            panelClass: ['red-snackbar']
          })
        }
      },
        err0 => {
          console.log('error: ' + err0);
        }
      );
    }
  }
  //----------------------------------  
  exit() {
    /*if (this.form.valid) {
      console.log(JSON.stringify(this.model));
    }*/
    this.router.navigate(['home/cstp']);
  }
  //---------------------------------------------------------
}
