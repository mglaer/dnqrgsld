import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Params, Router, RouteReuseStrategy } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MasterService } from 'src/app/services/master.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { TechnologyPassport,VTechnologyPassport,SecurityLevel } from '../../../../model/structures';
import { faCoffee, faShieldHalved, faPen, faEnvelope, faPhone, faShield, faBoxArchive } from '@fortawesome/free-solid-svg-icons';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-technology-passport-create-entity',
  templateUrl: './technology-passport-create-entity.component.html',
  styleUrls: ['./technology-passport-create-entity.component.css']
})
export class TechnologyPassportCreateEntityComponent implements OnInit {
  //---
  public faShieldHalved = faShieldHalved;
  public faPen = faPen;
  public faEnvelope = faEnvelope;
  public faPhone = faPhone;
  public faShield = faShield;
  public faBoxArchive = faBoxArchive;

  //passport_common!: PassportCSTP;
  //passport_target_characteristics!:Targeted;

  
  //public parent_id: any;
  public Entity!: TechnologyPassport;
  public template_list: VTechnologyPassport[] = [];
  public security_data!: SecurityLevel[];
  public security_level_selected: any;

  DataSourceTable: any;
  displayedColumns: string[] = ['ID', 'ShortTitle', 'ArchiveSign', 'SecurityLevel'];
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
  model: any = {};
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [];
  template: any;
  public content: any = {};
  submit() {
    if (this.form.valid) {
      console.log(JSON.stringify(this.model));
    }
  }
  //----------------------------------
  tmp: any;
  header: any;
  //----------------------------------
  //-------------------------------------
  constructor(
    private router: Router,
    private service: MasterService,
    private storageService: AuthenticationService,
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) { 
    this.Entity = {
      ID: 0,
      ShortTitle: "",
      EntityStructure: 0,
      Content: "",
      ArchiveSign: false,
      SecurityLevel: 0,
      SecurityID: 0,
      TemplateSign: false,
      Template: 0,
    };
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
  this.service.GetTemplateListTechPassport(this.Entity.EntityStructure, false).subscribe((result: any) => {
    if (result.data != null) {
      this.storageService.saveToken(result.jwt);

      if (this.show_archieved) {
        this.template_list = [];
        this.template_list = result.data;
      }
      else {
        this.template_list = result.data.filter((word: any) => word.ArchiveSign === false);
      }

      this.DataSourceTable = new MatTableDataSource<VTechnologyPassport>(this.template_list);
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
    .get<any>(`/assets/tech_passport_root_template.json`)
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
  this.service.GetTemplateTechPassport(this.selected_template.ID).subscribe((result: any) => {
    if (result.data != null) {
      let _top_level = this.security_data.filter((word: any) => (word.ID == result.data[0].SecurityLevel))[0].Level;
      this.security_data = this.security_data.filter((word: any) => (word.Level <= _top_level));
      let level = this.security_data[0];
      this.security_level_selected = level;
      //
      this.storageService.saveToken(result.jwt);
      this.content = JSON.parse(result.data[0].Content);
      //
      this.template[0].fieldGroup[0].fieldGroup[2].props.options = [];
      for (let i = 0; i < this.security_data.length; i++) {
        let _row = { label: this.security_data[i].ShortTitle, value: this.security_data[i].Level.toString() };
        this.template[0].fieldGroup[0].fieldGroup[2].props.options.push(_row);
      }
      //
      //let _tmp = structuredClone(this.template);
      this.tmp = structuredClone(this.template);
      //this.tmp[1].fieldGroup[0].fieldGroup[1].fieldGroup.push(this.content);
      //TODO
      this.tmp[1].fieldGroup.push(this.content);
      this.header = {
        header: {
          ID: "",
          ShortTitle: "",
          Description: "",
          SecurityLevel: this.security_data.filter((word: any) => (word.ID == result.data[0].SecurityLevel))[0].Level.toString()
        }
      };
      //
      //console.log(this._tmp[1].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[0].fieldGroup[1].fieldGroup[0].fieldGroup[0].props.options);
      this.loadSqlData(this.tmp, 'type');
      //
      //this.model = _header;
      //this.fields = this._tmp;
      this.model = structuredClone(this.header);
      this.fields = structuredClone(this.tmp);
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
                this.fields =structuredClone(this.tmp);
                this.model = structuredClone(this.header);
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
    //console.log(JSON.stringify(this.model));
  }
  //this.router.navigate(['home/technology_passport']);
  window.top!.close();
}
  //------------------------------------------------------------------------------
  save() {
    this.Entity.ShortTitle = this.model.header.ShortTitle;
    this.Entity.Template = this.selected_template.ID;
    this.Entity.SecurityLevel = this.security_data.filter((word: SecurityLevel) => (word.Level == this.model.header.SecurityLevel))[0].ID!;
    if (this.model.tabs_root != undefined) {
      this.Entity.Content = this.model.tabs_root;
    }
    else {
      this.Entity.Content = JSON.stringify({});
    }
    this.service.CreateTechPasport(this.Entity).subscribe((result: any) => {
      if (result.res == 'success') {
        this._snackBar.open('Паспорт успешно добавлен', '', {
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
    /*
    if (this.form.valid) {
      console.log(JSON.stringify(this.model));
    }
    this.router.navigate(['home/ontologies_structure']);
    */
    
  }
  //---------------------------------------------------------
}
