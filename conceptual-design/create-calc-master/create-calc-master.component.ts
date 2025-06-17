import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { cnst } from '../../../model/cnst';
import { Params, Router, RouteReuseStrategy } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MasterService } from 'src/app/services/master.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { VEntities, Entities, SecurityLevel, VModule, Calculation } from '../../../model/structures';
import { faCoffee, faShieldHalved, faPen, faEnvelope, faPhone, faShield, faBoxArchive } from '@fortawesome/free-solid-svg-icons';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwDialogContentAlreadyAttachedError } from '@angular/cdk/dialog';


@Component({
  selector: 'app-create-calc-master',
  templateUrl: './create-calc-master.component.html',
  styleUrls: ['./create-calc-master.component.css']
})
export class CreateCalcMasterComponent implements OnInit {
  public parent_id!: number;
  //---
  public faShieldHalved = faShieldHalved;
  public faPen = faPen;
  public faEnvelope = faEnvelope;
  public faPhone = faPhone;
  public faShield = faShield;
  public faBoxArchive = faBoxArchive;

  //public parent_id: any;
  public Entity = <Calculation>{};
  public module_list: VModule[] = [];
  public security_data!: SecurityLevel[];
  public security_level_selected: any;

  DataSourceTable: any;
  //displayedColumns: string[] = ['ID', 'ShortTitle', 'Description', 'ArchiveSign', 'SecurityLevel'];
  displayedColumns: string[] = ['ID', 'ShortTitle', 'ArchiveSign', 'SecurityLevel'];
  selected_module!: VModule;
  public show_archieved: boolean = false;
  //-----------Stepper--------------
  firstFormGroup = this._formBuilder.group({
    selected_module: ['', Validators.required],
    ///firstCtrl: [''],
  });
  calc_form: FormGroup;
  isEditable = true;
  //
  records: any[] = [];
  headers: any[] = [];
  //-----------Formly--------------
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [];
  template: any;
  public private_content: any = {};
  public open_content: any = {};
  submit() {
    if (this.form.valid) {
      console.log(JSON.stringify(this.model));
    }
  }
  //----------------------------------
  tmp: any;
  header: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: MasterService,
    private storageService: AuthenticationService,
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) {
    this.calc_form = this._formBuilder.group(
      {
        ID: new FormControl(''),
        ShortTitle: new FormControl('', Validators.required),
        Description: new FormControl(''),
        Module: new FormControl(''),
        InOutFile: new FormControl(''),
        Status: new FormControl(''),
        Path: new FormControl('')
      }
    );
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.parent_id = params['parent_id'];
      this.GetTemplateList();
      this.InitForm();
    });
  }
  //--------------------------------------------------------
  //----------------------------------
  public GetTemplateList() {
    this.service.RedKeyGetModulesList().subscribe((result: any) => {
      if (result.data != null) {
        this.storageService.saveToken(result.jwt);

        this.module_list = [];
        this.module_list = result.data;

        this.DataSourceTable = new MatTableDataSource<VModule>(this.module_list);
      }
      else {
        console.log('error');
        //this.router.navigate(['login']);
      }
    });
  }
  //--------------------------------------------------------
  InitForm() {

  }
  //------------------------------------------------------------------------------
  getrow(row: any) {
    this.selected_module = row;
    //this.LoadSelectedTemplate();
    this.firstFormGroup.setValue({
      selected_module: this.selected_module.ShortTitle
    });//.selected_module=this.selected_module.ShortTitle;
    console.log(row);
  }
  //--------------------------------------------------------
  onSubmit() {

  }
  //--------------------------------------------------------
  exit() {
    this.router.navigate(['home/calculation_list', { id: this.parent_id }]);
  }
  //------------------------------------------------------------------------------
  changeListener(_event: any) {
    console.log(_event);
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.calc_form.controls['InOutFile'].setValue(event.target.result);
      //
      let csvToRowArray = event.target.result.split("\n");
      this.headers = csvToRowArray[0].split(",").map((e: any) => e.trim());
      this.records = csvToRowArray.slice(1).map((row: any) => row.split(","));
      //
    };
    reader.onerror = (event: any) => {
      console.log("File could not be read: " + event.target.error.code);
    };
    reader.readAsText(_event.files[0]);
  }
  //----------------------------------
  save() {
    this.Entity.ShortTitle = this.calc_form.value.ShortTitle;
    this.Entity.Description = this.calc_form.value.Description;
    this.Entity.Project = this.parent_id;
    this.Entity.Module = this.selected_module.ID;
    this.Entity.InOutFile = this.calc_form.value.InOutFile;
    this.Entity.Status = "Черновик";
    this.Entity.Path = this.calc_form.value.Path;
    this.service.RedKeyCreateCalculation(this.Entity).subscribe((result: any) => {
      if (result.res == 'success') {
        this._snackBar.open('Сущность успешно добавлена', '', {
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
  //-----------------------------------------------------------------
}