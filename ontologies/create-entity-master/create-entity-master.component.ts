import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { cnst } from '../../../model/cnst';
import { Params, Router, RouteReuseStrategy } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MasterService } from 'src/app/services/master.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { VEntities, Entities, SecurityLevel } from '../../../model/structures';
import { faCoffee, faShieldHalved, faPen, faEnvelope, faPhone, faShield, faBoxArchive } from '@fortawesome/free-solid-svg-icons';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwDialogContentAlreadyAttachedError } from '@angular/cdk/dialog';
import { UNDER_LINE } from 'angular-mydatepicker';
import { MatDialog } from '@angular/material/dialog';
import { ImageFullSizeComponent } from '../modal/image-full-size/image-full-size.component';

@Component({
  selector: 'app-create-entity-master',
  templateUrl: './create-entity-master.component.html',
  styleUrls: ['./create-entity-master.component.css']
})
export class CreateOntologyMasterComponent implements OnInit {
  public img_path: string = "";
  //---
  public faShieldHalved = faShieldHalved;
  public faPen = faPen;
  public faEnvelope = faEnvelope;
  public faPhone = faPhone;
  public faShield = faShield;
  public faBoxArchive = faBoxArchive;

  //public parent_id: any;
  public Entity!: Entities;
  public template_list: VEntities[] = [];
  public security_data!: SecurityLevel[];
  public security_level_selected: any;

  DataSourceTable: any;
  displayedColumns: string[] = ['ID', 'ShortTitle', 'Description', 'ArchiveSign', 'SecurityLevel'];
  selected_template: any;
  public show_archieved: boolean = false;
  //-----------Stepper--------------
  firstFormGroup = this._formBuilder.group({
    selected_template: ['', Validators.required],
    ///firstCtrl: [''],
  });
  secondFormGroup = this._formBuilder.group({
    //secondCtrl: ['', Validators.required],
    secondCtrl: [''],
  });
  isEditable = true;
  //-----------Formly--------------
  form = new FormGroup({});
  model_header: any = {};
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [];
  template: any;
  public private_content: any = {};
  public open_content: any = {};
  submit() {
    if (this.form.valid) {
      console.log(JSON.stringify(this.model_header));
    }
  }
    //
  //----------------------------------
  form_body = new FormGroup({});
  model_body: any = {};
  options_body: FormlyFormOptions = {};
  fields_body: FormlyFieldConfig[] = [];
  //----------------------------------

  //----------------------------------
  tmp_header: any;
  tmp_body: any;

  header: any;
  body: any;
  //----------------------------------
  constructor(
    private router: Router,
    private service: MasterService,
    private storageService: AuthenticationService,
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar) {
    //
    this.Entity = {
      ID: 0,
      EntityStructure: 0,
      ShortTitle: "",
      Description: "",
      OpenContent: "",
      PrivateContent: "",
      ArchiveSign: false,
      SecurityLevel: 0,
      SecurityID: 0,
      TemplateSign: false,
      Template: 0,
      URLPicture: ""
    };
    //
    this.form.valueChanges.subscribe((params: any) => {
      if (this.model_header.header.file != undefined) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.img_path = event.target.result;
        };
        reader.onerror = (event: any) => {
          console.log("File could not be read: " + event.target.error.code);
        };
        reader.readAsDataURL(this.model_header.header.file[0]);
      }
    });
  }
    //----------------------------------
    show_full()
    {
      const dialogRef = this.dialog.open(ImageFullSizeComponent, {
        //width: '450px',
        data: this.img_path,
      });
      //------------------------------------------------------------------------------
      dialogRef.afterClosed().subscribe(result => {
        console.log('closed');
      },
        err => {
          console.log('error: ' + err);
        });
    }
  //----------------------------------
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      //this.parent_id = params['template_id'];
      this.Entity.EntityStructure = params['parent_id'];
      this.GetTemplateList();
      this.load_root_template();
      //this.load_open_content();
    });
  }
  //----------------------------------
  public GetTemplateList() {
    this.service.GetTemplateList(this.Entity.EntityStructure, false).subscribe((result: any) => {
      if (result.data != null) {
        this.storageService.saveToken(result.jwt);

        if (this.show_archieved) {
          this.template_list = [];
          this.template_list = result.data;
        }
        else {
          this.template_list = result.data.filter((word: any) => word.ArchiveSign === false);
        }

        this.DataSourceTable = new MatTableDataSource<VEntities>(this.template_list);
      }
      else {
        console.log('error');
        //this.router.navigate(['login']);
      }
    });
  }
  //------------------------------------------------------------------------------
  public load_root_template() {
    this.http
      .get<any>(`/assets/root_template.json`)
      .subscribe(JsonSchema => {
        this.template = JsonSchema;
        //---security---
        this.service.GetSecurityList().subscribe((result: any) => {
          this.security_data = result.data;
        });
      });
  }
  //------------------------------------------------------------------------------
  public LoadSelectedTemplate() {
    this.service.GetTemplate(this.selected_template.ID).subscribe((result: any) => {
      if (result.data != null) {
        let _top_level = this.security_data.filter((word: any) => (word.ID == result.data[0].SecurityLevel))[0].Level;
        this.security_data = this.security_data.filter((word: any) => (word.Level <= _top_level));
        let level = this.security_data[0];
        this.security_level_selected = level;
        //
        this.storageService.saveToken(result.jwt);
        this.private_content = JSON.parse(result.data[0].PrivateContent);
        this.open_content = JSON.parse(result.data[0].OpenContent);
        //
        this.template[0].fieldGroup[0].fieldGroup[2].props.options = [];
        for (let i = 0; i < this.security_data.length; i++) {
          let _row = { label: this.security_data[i].ShortTitle, value: this.security_data[i].Level.toString() };
          this.template[0].fieldGroup[0].fieldGroup[2].props.options.push(_row);
        }
        //
        //let _tmp = structuredClone(this.template);
        this.tmp_header = structuredClone(this.template);
        //this.tmp[1].fieldGroup[0].fieldGroup[0].fieldGroup.push(this.open_content);
        //this.tmp[1].fieldGroup[0].fieldGroup[1].fieldGroup.push(this.private_content);
        this.tmp_header[1] = [];
        this.header = {
          header: {
            ID: "",
            ShortTitle: "",
            Description: "",
            SecurityLevel: this.security_data.filter((word: any) => (word.ID == result.data[0].SecurityLevel))[0].Level.toString()
          }
        };
        this.tmp_body = structuredClone(this.template);
            this.tmp_body[0] = [];
            this.tmp_body[1].fieldGroup[0].fieldGroup[0].fieldGroup.push(this.open_content);
            this.tmp_body[1].fieldGroup[0].fieldGroup[1].fieldGroup.push(this.private_content);
            
        //
        //console.log(this._tmp[1].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[1].fieldGroup[0].fieldGroup[0].props.options);
        this.loadSqlData(this.tmp_header, 'type');
        //
        //this.model = _header;
        //this.fields = this._tmp;
        this.model_header = structuredClone(this.header);
        this.fields = structuredClone(this.tmp_header);
        //
        this.model_body = structuredClone(this.header);
        this.fields_body = structuredClone(this.tmp_body);
      }
      else {
        console.log('error');
        //this.router.navigate(['login']);
      }
    });
  }
  //------------------------------------------------------------------------------
  loadSqlData = (obj: any, key: any) => {
    let newObj: any = {};
    for (var ogKey in obj) {
      if (ogKey === key) {
        let _select_db: string = '';
        if (obj[key] === 'select') {
          if (obj['props']['options'] != undefined) {
            obj['props']['options'].forEach((element: any) => {
              if (element['select_db'] != undefined) {
                _select_db = element['select_db'];
                //TODO SQL Request
                this.service.CustomRequest(_select_db).subscribe((result: any) => {
                  obj['props']['options'] = [];
                  for (let i = 0; i < result.data.length; i++) {
                    //obj['props']['options'].push(JSON.parse(result.data[i]['col']));
                    obj['props']['options'].push(result.data[i]);
                  }
                  this.fields = structuredClone(this.tmp_header);
                  this.model_body = structuredClone(this.header);
                  this.fields_body = structuredClone(this.tmp_body);
                });
              }
            });
            //console.log(_select_db);
          }
        }
        //
      } else if (typeof obj[ogKey] === 'object') {
        newObj[ogKey] = this.loadSqlData(obj[ogKey], key);
      } else {
        newObj[ogKey] = obj[ogKey]
      }
    }
    return newObj
  }
  //------------------------------------------------------------------------------
  replaceRequestKeysInObj = (obj: any, key: any) => {
    let newObj: any = {};
    for (var ogKey in obj) {
      if (ogKey === key) {
        //newObj[newKey] = obj[ogKey]
        //obj[ogKey] = "Y";
        //obj=[];
        //obj.push({label:1});
        //obj.push({label:2});
        //delete obj['select_db'];
        obj['preved'] = { medved: 1 };
        //
      } else if (typeof obj[ogKey] === 'object') {
        newObj[ogKey] = this.replaceRequestKeysInObj(obj[ogKey], key);
      } else {
        newObj[ogKey] = obj[ogKey]
      }
    }
    return newObj
  };
  //------------------------------------------------------------------------------
  replaceKeysInObj = (obj: any, key: any, newKey: any) => {
    let newObj: any = {};
    for (var ogKey in obj) {
      if (ogKey === key) {
        newObj[newKey] = obj[ogKey]
      } else if (typeof obj[ogKey] === 'object') {
        newObj[ogKey] = this.replaceKeysInObj(obj[ogKey], key, newKey);
      } else {
        newObj[ogKey] = obj[ogKey]
      }
    }
    return newObj
  };
  //------------------------------------------------------------------------------
  recursiveSearch = (obj: any, searchKey: any, results = []) => {
    var r: any = results;
    Object.keys(obj).forEach(key => {
      var value: any = obj[key];
      if (key === searchKey && typeof value !== 'object') {
        r.push(value);
      } else if (typeof value === 'object') {
        this.recursiveSearch(value, searchKey, r);
      }
    });
    return r;
  };
  //------------------------------------------------------------------------------
  getrow(row: any) {
    this.selected_template = row;
    this.LoadSelectedTemplate();
    this.firstFormGroup.setValue({
      selected_template: this.selected_template.ShortTitle
    });//.selected_template=this.selected_template.ShortTitle;
    console.log(row);
  }
  //----------------------------------
  exit() {
    if (this.form.valid) {
      //console.log(JSON.stringify(this.model_header));
    }
    //this.router.navigate(['home/ontologies_structure']);
    window.top!.close();
  }
  //----------------------------------
  save() {
    if (this.model_header.header.file != undefined) {
      //---
      this.service.upload_file(this.model_header.header.file[0]).subscribe((rup: any) => {
        //---
        this.save_func(rup.data);
        //---
      },
        err0 => {
          console.log('error: ' + err0);
        }
      );
      //---
    }
    else {
      this.save_func('');
    }
  }
  //--------------------------------------------------------
  save_func(_url_picture: string) {
    //---
    this.Entity.ShortTitle = this.model_header.header.ShortTitle;
    this.Entity.Description = this.model_header.header.Description;
    this.Entity.Template = this.selected_template.ID;
    this.Entity.SecurityLevel = this.security_data.filter((word: SecurityLevel) => (word.Level == this.model_header.header.SecurityLevel))[0].ID!;
    this.Entity.URLPicture = _url_picture;
    if (this.model_body.tabs_root?.tabs.open_content != undefined) {
      this.Entity.OpenContent = this.model_body.tabs_root.tabs.open_content;
    }
    else {
      this.Entity.OpenContent = JSON.stringify({});
    }
    if (this.model_body.tabs_root?.tabs.private_content != undefined) {
      this.Entity.PrivateContent = this.model_body.tabs_root.tabs.private_content;
    }
    else {
      this.Entity.PrivateContent = JSON.stringify({});;
    }
    this.service.CreateOntology(this.Entity, "Entity").subscribe((result: any) => {
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
    //---
  }
}
