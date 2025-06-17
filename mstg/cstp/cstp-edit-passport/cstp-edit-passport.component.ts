import { Component, OnInit, ViewChild, ViewContainerRef, Inject } from '@angular/core';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Params, Router, RouteReuseStrategy } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { VPassportCSTP, PassportCSTP, VTargeted, Targeted, SecurityLevel, VTechnologyCSTP, VTechnologyPassport } from '../../../../model/structures';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { HttpClient } from '@angular/common/http';
//import { tap } from 'rxjs/operators';
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
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { Sort, MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { VGroups } from '../../../../model/structures';
import { MasterService } from 'src/app/services/master.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { cnst } from '../../../../model/cnst';
//import {TranslateService} from '@ngx-translate/core';
//import {DateAdapter} from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { AddTargetedComponent } from '../add-targeted/add-targeted.component';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-cstp-edit-passport',
  templateUrl: './cstp-edit-passport.component.html',
  styleUrls: ['./cstp-edit-passport.component.css'],
})
export class CstpEditPassportComponent implements OnInit {
  //----------
  public show_archieved: boolean = false;
  public faUser = faUser;
  public faLayerGroup = faLayerGroup;
  public faShieldHalved = faShieldHalved;
  public faPen = faPen;
  public faEnvelope = faEnvelope;
  public faPhone = faPhone;
  public faShield = faShield;
  public faBoxArchive = faBoxArchive;
  public faTrash = faTrash;
  //-------targeted
  displayedColumnsTargeted: string[] = ['ID', 'TypeTargeted', 'Name', 'Volume', 'Remove'];
  dataSourceTargeted: any;
  targeted_list: any;
  registry_list: any;
  selected_targeted_row: any;
  selected_registry_row: any;
  //
  //-------RegistryList
  displayedColumnsRegistryList: string[] = ['ID', 'ShortTitle', 'SecurityLevel', 'ArchiveSign', 'Remove'];
  dataSourceRegistry: any;

  @ViewChild(MatPaginator) paginator_targeted !: MatPaginator;
  @ViewChild(MatSort) sort_targeted !: MatSort;
  //
  @ViewChild(MatPaginator) paginator_registry !: MatPaginator;
  @ViewChild(MatSort) sort_registry !: MatSort;

  //---------------------------

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
  public selected_tab: number = 0;
  selected_registry_array: number[] = [];
  //-------------------------------------
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private service: MasterService,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private storageService: AuthenticationService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
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
      if (params['passport_list'] != undefined) {//если прислали список для добавления в реестр, нужно активировать последний таб и в цикле добавить        
        this.selected_registry_array = JSON.parse(params['passport_list']);
        this.selected_tab = 2;
      }
      this.InitForm();
    });
  }
  //------------------------------------------------------------------------------
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
  //------------------------------------------------------------------------------

  //------------------------------------------------------------------------------
  Filterchange(event: Event) {
    const filvalue = (event.target as HTMLInputElement).value;
    this.dataSourceTargeted.filter = filvalue;
  }
  //------------------------------------------------------------------------------
  FilterchangeRegistry(event: Event) {
    const filvalue = (event.target as HTMLInputElement).value;
    this.dataSourceRegistry.filter = filvalue;
  }
  //------------------------------------------------------------------------------
  getrow(row: any) {
    this.selected_targeted_row = row;
    //console.log(row);
  }
  //------------------------------------------------------------------------------
  getrowRegistry(row: any) {
    this.selected_registry_row = row;
    //console.log(row);
  }
  //------------------------------------------------------------------------------
  FunctionRemove(_entity: any) {
    this.service.RemoveTargeted(_entity.ID).subscribe((result: any) => {
      if (result.res == 'success') {
        this._snackBar.open('Характеристика удалена', '', {
          duration: 1000,
          panelClass: ['blue-snackbar']
        });
        this.GetTargetedTable();
        //this.GetAll();
        //this.GetEntityStructure(this.parent_data.ID, false);
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
    /*
      console.log('');
      const dialogRef = this.dialog.open(EditGroupComponent, {
        width: '450px',
        data: _entity,
      });
      //------------------------------------------------------------------------------
      dialogRef.afterClosed().subscribe(result => {
        if (result != '') {
          this.service.RemoveTargeted(result).subscribe((result: any) => {
            if (result.res == 'success') {
              this._snackBar.open('Сущность успешно обновлена', '', {
                duration: 1000,
                panelClass: ['blue-snackbar']
              });
              this.GetAll();
              //this.GetEntityStructure(this.parent_data.ID, false);
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
      },
        err => {
          console.log('error: ' + err);
        });
    */
  }
  //----------------------------------------------------
  //------------------------------------------------------------------------------
  FunctionRemoveRegistry(_entity: any) {
    this.service.RemoveRegistry(_entity.ID, this.ID).subscribe((result: any) => {
      if (result.res == 'success') {
        this._snackBar.open('Паспорт технологии удален', '', {
          duration: 1000,
          panelClass: ['blue-snackbar']
        });
        this.GetTargetedTable();
        this.GetRegistryTable();
        //this.GetAll();
        //this.GetEntityStructure(this.parent_data.ID, false);
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
    /*
      console.log('');
      const dialogRef = this.dialog.open(EditGroupComponent, {
        width: '450px',
        data: _entity,
      });
      //------------------------------------------------------------------------------
      dialogRef.afterClosed().subscribe(result => {
        if (result != '') {
          this.service.RemoveTargeted(result).subscribe((result: any) => {
            if (result.res == 'success') {
              this._snackBar.open('Сущность успешно обновлена', '', {
                duration: 1000,
                panelClass: ['blue-snackbar']
              });
              this.GetAll();
              //this.GetEntityStructure(this.parent_data.ID, false);
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
      },
        err => {
          console.log('error: ' + err);
        });
    */

  }
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
  AddTargeted() {
    var entity = <Targeted>{};
    ///need to fill all fields!!!
    entity.ID = 0;//not used, auto
    entity.PassportCSTP = this.ID;
    //entity.TypeTargeted=
    entity.Name = '';
    entity.Volume = '';
    //user.ArchiveSign=false;
    /*if (this.parent_data != undefined) {
      entity.Parent = this.parent_data.ID;
    }
    else {
      entity.Parent = null;
    }  */

    const dialogRef = this.dialog.open(AddTargetedComponent, {
      width: '450px',
      data: entity,

    });
    //------------------------------------------------------------------------------
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {
        let _targeted: Targeted = structuredClone(result.data);
        _targeted.PassportCSTP = this.ID;
        _targeted.TypeTargeted = result.targeted.ID;
        this.service.CreateTargeted(_targeted).subscribe((result: any) => {
          if (result.res == 'success') {
            this._snackBar.open('Характеристика успешно добавлена', '', {
              duration: 1000,
              panelClass: ['blue-snackbar']
            });
            if (this.ID === undefined) {
              6
              //!!! this.UpdateEvent.next('Y');
            }
            //this.GetAll();
            this.GetTargetedTable();
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
    },
      err => {
        console.log('error: ' + err);
      });
  }
  //----------------------------------------------------
  SelectRegistry() {
    this.router.navigate(['home/add-registry', { parent_passport_id: this.ID }]);
  }
  //----------------------------------------------------
  AddRegistry() {
    this.service.CreateRegistryList(this.ID, this.selected_registry_array).subscribe((result: any) => {
      if (result.res == 'success') {
        this._snackBar.open('Реестр успешно обновлен', '', {
          duration: 1000,
          panelClass: ['blue-snackbar']
        });
        this.selected_registry_array = [];
        this.GetRegistryTable();
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
  //----------------------------------------------------

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
  //--------------------------------------------------------------------
  //------------------------------------------------------------------------------
  GetTargetedTable() {
    this.service.GetTargetedList(this.ID).subscribe((result: any) => {
      if (result.data != null) {
        this.storageService.saveToken(result.jwt);
        this.targeted_list = result.data;
        this.dataSourceTargeted = new MatTableDataSource<VTargeted>(this.targeted_list);
        this.dataSourceTargeted.paginator = this.paginator_targeted;
        this.dataSourceTargeted.sort = this.sort_targeted;
        //
      }
      /*else {
        this.router.navigate(['login']);
      }*/
    });
  }
  //--------------------------------------------------------------
  GetRegistryTable() {
    this.service.GetListRegistry(this.ID).subscribe((result: any) => {
      if (result.data != null) {
        this.storageService.saveToken(result.jwt);
        //this.registry_list = result.data;
        if (this.show_archieved) {
          this.registry_list = [];
          this.registry_list = result.data;
        }
        else {
          this.registry_list = result.data.filter((word: any) => word.ArchiveSign === false);
        }

        this.dataSourceRegistry = new MatTableDataSource<VTechnologyCSTP>(this.registry_list);
        this.dataSourceRegistry.paginator = this.paginator_registry;
        this.dataSourceRegistry.sort = this.sort_registry;
      }
      /*else {
        this.router.navigate(['login']);
      }*/
    });
  }
  //------------------------------------------------------------------------------
  ngOnChanges() {
    this.GetTargetedTable();
    this.GetRegistryTable();
    //this.InitForm();
    console.log('ngOnChanges users');
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
        Goal: '',
        Type: '',
        DateInitiation: '',
        Document: '',
        Members: '',
        StartDate: '',
        EndDate: '',
        Costs: ''
      });
      //---
      if (this.ID != undefined) {
        this.service.GetPassportCSTPbyID(this.ID).subscribe((result: any) => {
          if (result.data != null) {
            this.passport_common = result.data[0];
            
            let _spl=this.passport_common.DateInitiation.split('.');
            this.date_init=_spl[1]+'/'+_spl[0]+'/'+_spl[2];
            _spl=this.passport_common.StartDate.split('.');
            this.date_start=_spl[1]+'/'+_spl[0]+'/'+_spl[2];
            _spl=this.passport_common.EndDate.split('.');
            this.date_end=_spl[1]+'/'+_spl[0]+'/'+_spl[2];

            this.passport_common_form.setValue(
              {
                ID: this.passport_common.ID,
                ShortTitle: this.passport_common.ShortTitle,
                SecurityLevel: level.Level,
                Goal: this.passport_common.Goal,
                Type: this.passport_common.Type,
                DateInitiation: new Date (this.date_init),
                Document: this.passport_common.Document,
                Members: this.passport_common.Members,
                StartDate: new Date(this.date_start),
                EndDate: new Date(this.date_end),
                Costs: this.passport_common.Costs
              }
            );
          }
        });
      }
      this.GetTargetedTable();
      this.GetRegistryTable();
      //---
      /*this.service.GetTypeTargetedList().subscribe((result: any) => {
        this.type_targeted = result.data;
        let type = this.type_targeted[0];
        this.type_targeted_selected = type;
        //fill form        
        this.targeted_form.setValue({
          ID: '',
          Name: '',
          Value: '',
          TypeTargeted: type.Name,
        });
      });*/
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
  // Access formcontrols getter
  get Level() {
    return this.passport_common_form.get('SecurityLevel');
  }

  //------------------------------------------------------------------------------
  save() {
    this.passport_common.ShortTitle = this.passport_common_form.value.ShortTitle;//this.model.header.ShortTitle;
    this.passport_common.ArchiveSign = false;
    this.passport_common.SecurityLevel = this.security_level_selected.ID;//_y;//parseInt(this.security_data.filter((word: SecurityLevel) => (word.Level == this.passport_common_form.value.SecurityLevel))[0].ID);
    this.passport_common.SecurityID = 71;
    this.passport_common.Goal = this.passport_common_form.value.Goal;
    this.passport_common.Type = this.passport_common_form.value.Type;

    //var _StartDate = moment(this.passport_common_form.value.StartDate).valueOf();
    //var _StartDate2=moment.utc(this.passport_common_form.value.StartDate).format();

    this.passport_common.DateInitiation = moment(this.passport_common_form.value.DateInitiation).format('DD.MM.YYYY');//this.passport_common_form.value.DateInitiation;
    this.passport_common.Document = this.passport_common_form.value.Document;
    this.passport_common.Members = this.passport_common_form.value.Members;
    this.passport_common.StartDate = moment(this.passport_common_form.value.StartDate).format('DD.MM.YYYY');//this.passport_common_form.value.StartDate;//moment(this.passport_common_form.value.StartDate).format('DD.MM.YYYY');//this.passport_common_form.value.StartDate;

    this.passport_common.EndDate = moment(this.passport_common_form.value.EndDate).format('DD.MM.YYYY');//this.passport_common_form.value.EndDate;//moment(this.passport_common_form.value.EndDate).format('DD.MM.YYYY');//this.passport_common_form.value.EndDate;

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
