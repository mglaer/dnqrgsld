import { Component, OnInit, ViewChild, ViewContainerRef, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { cnst } from '../../../../model/cnst';
import { Params, Router, RouteReuseStrategy } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MasterService } from 'src/app/services/master.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { Entities, SecurityLevel, TechnologyPassport } from '../../../../model/structures';
import { faCoffee, faShieldHalved, faPen, faEnvelope, faPhone, faShield, faBoxArchive, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
//import { ImageUploadComponent } from '../../../';

@Component({
  selector: 'app-technology-passport-edit-entity',
  templateUrl: './technology-passport-edit-entity.component.html',
  styleUrls: ['./technology-passport-edit-entity.component.css']
})
export class TechnologyPassportEditEntityComponent implements OnInit {
//---
public faShieldHalved = faShieldHalved;
public faPen = faPen;
public faEnvelope = faEnvelope;
public faPhone = faPhone;
public faShield = faShield;
public faBoxArchive = faBoxArchive;

public ID: any;
DataSourceTable: any;
displayedColumns: string[] = ['ID', 'ShortTitle', 'Description', 'ArchiveSign', 'SecurityLevel'];
//selected_template!: Entities;
selected_template = <Entities>{};
public Passport!: TechnologyPassport;
public security_data!: SecurityLevel[];
public security_level_selected: any;

//public preview:string="";
//-----------Formly--------------
form = new FormGroup({});
model: any = {};
options: FormlyFormOptions = {};

fields: FormlyFieldConfig[] = [];
template: any;
public template_content: any;
submit() {
  if (this.form.valid) {
    console.log(JSON.stringify(this.model));
  }
}

//----------------------------------
tmp: any;
header: any;
//----------------------------------
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private service: MasterService,
    private storageService: AuthenticationService,
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
  ) { }
//----------------------------------
ngOnInit(): void {
  this.route.params.subscribe((params: Params) => {
    this.ID = params['ID'];
    this.load_root_template();
  });
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
ngOnChanges() {

  console.log('ngOnChanges ');
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
        this.LoadSelectedEntity();
      });


    });
}
//------------------------------------------------------------------------------
public LoadSelectedEntity() {
  this.service.GetTemplateTechPassport(this.ID).subscribe((result: any) => {
    if (result.data != null) {
      this.storageService.saveToken(result.jwt);
      this.Passport = result.data[0];
      this.service.GetTemplateTechPassport(this.Passport.Template).subscribe((result: any) => {
        if (result.data != null) {
          let _top_level = this.security_data.filter((word: any) => (word.ID == result.data[0].SecurityLevel))[0].Level;
          this.security_data = this.security_data.filter((word: any) => (word.Level <= _top_level));
          let level = this.security_data[0];
          this.security_level_selected = level;
          //
          this.selected_template = result.data[0];
          this.template_content = JSON.parse(result.data[0].Content);
          //
          this.template[0].fieldGroup[0].fieldGroup[2].props.options = [];
          for (let i = 0; i < this.security_data.length; i++) {
            let _row = { label: this.security_data[i].ShortTitle, value: this.security_data[i].Level.toString() };
            this.template[0].fieldGroup[0].fieldGroup[2].props.options.push(_row);
          }
          //
          this.tmp = structuredClone(this.template);
          //this.tmp[1].fieldGroup[0].fieldGroup[0].fieldGroup.push(this.template_content);
          this.tmp[1].fieldGroup.push(this.template_content);
          
          let _open = {};
          //let _private = {};
          if (this.Passport.Content != 'undefined') {
            _open = JSON.parse(this.Passport.Content);
          }

          this.header = {
            header: {
              ID: this.Passport.ID,
              ShortTitle: this.Passport.ShortTitle,
              SecurityLevel: this.security_data.filter((word: any) => (word.ID == this.selected_template.SecurityLevel))[0].Level.toString()
            },
            tabs_root: _open//{                              _open                          }
          };
          this.loadSqlData(this.tmp, 'type');
          this.model = structuredClone(this.header);
          this.fields = structuredClone(this.tmp);
        }
      });
    }
    else {
      console.log('error');
      //this.router.navigate(['login']);
    }
  });
}
//------------------------------------------------------------------------------
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
                this.model = structuredClone(this.header);
                this.fields = structuredClone(this.tmp);                
                //
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
/*
toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});
*/
//------------------------------------------------------------------------------
save() {
  this.Passport.ShortTitle = this.model.header.ShortTitle;
  //this.Entity.
  this.Passport.SecurityLevel = this.security_data.filter((word: SecurityLevel) => (word.Level == this.model.header.SecurityLevel))[0].ID!;

  this.Passport.Content = this.model.tabs_root;
  //file
  //this.Entity.URLPicture = this.model.header.file[0].name;  
  this.service.UpdateTechPasport(this.Passport, ).subscribe((result: any) => {
    if (result.res == 'success') {
      this._snackBar.open('Паспорт технологии успешно обновлен', '', {
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
      console.log('error: ' + err0.message);
    }
  );
  //   
}
//----------------------------------
exit() {
  if (this.form.valid) {
    console.log(JSON.stringify(this.model));
  }
  //this.router.navigate(['home/technology_passport']);
  window.top!.close();
}
//----------------------------------
}
