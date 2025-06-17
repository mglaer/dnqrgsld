import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { cnst } from '../../../../model/cnst';
import { Params, Router, RouteReuseStrategy } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MasterService } from 'src/app/services/master.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { TechnologyPassport, SecurityLevel } from '../../../../model/structures';
import { faCoffee, faShieldHalved, faPen, faEnvelope, faPhone, faShield, faBoxArchive } from '@fortawesome/free-solid-svg-icons';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { JsonEditorOptions } from "@maaxgr/ang-jsoneditor";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-technology-passport-edit-template',
  templateUrl: './technology-passport-edit-template.component.html',
  styleUrls: ['./technology-passport-edit-template.component.css']
})
export class TechnologyPassportEditTemplateComponent implements OnInit {
//---
public editorOptions: JsonEditorOptions = new JsonEditorOptions();
public initialData: any;
public visibleData: any;
public DataSave: any;
//---
public faShieldHalved = faShieldHalved;
public faPen = faPen;
public faEnvelope = faEnvelope;
public faPhone = faPhone;
public faShield = faShield;
public faBoxArchive = faBoxArchive;

//public parent_id: any;
public ID: any;
public Passport!: TechnologyPassport;
public security_data!: SecurityLevel[];
public security_level_selected: any;
//-----------FormFly--------------
form = new FormGroup({});
model: any;
options: FormlyFormOptions = {};

fields: FormlyFieldConfig[] = [];
template: any;
public content: any = {};
submit() {
  if (this.form.valid) {
    console.log(JSON.stringify(this.model));
  }
}
constructor(private router: Router,
  private service: MasterService,
  private storageService: AuthenticationService,
  private _formBuilder: FormBuilder,
  private route: ActivatedRoute,
  private http: HttpClient,
  private _snackBar: MatSnackBar) {
  //
  this.Passport = {
    ID: 0,
    ShortTitle: "",
    ArchiveSign: false,
    EntityStructure:0,
    Content: "",
    SecurityLevel: 0,
    SecurityID: 0,
    TemplateSign: true,
    Template: 0
  };

  //
  this.editorOptions = new JsonEditorOptions();
  //this.editorOptionsOpen.modes = ['code', 'text', 'tree', 'view'];
  this.editorOptions.modes = ['code'];
  this.editorOptions.mode = 'code';
  this.editorOptions.language = 'ru';


  this.initialData = {};
  this.visibleData = this.initialData;
  //
  
}
//----------------------------------
showJson(d: Event) {
  this.visibleData = d;
  this.DataSave = d;
}
//----------------------------------
ngOnInit(): void {
  this.route.params.subscribe((params: Params) => {
    this.ID = params['ID'];
    //this.Passport.EntityStructure = params['parent_id'];
    this.load_root_template();
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
        if (this.ID != 'null') {
          this.LoadSelectedTemplate();
        }
      });
      /*this.service.GetSecurityList().subscribe((result: any) => {
        this.security_data = result.data;
        let level = this.security_data[0];
        this.security_level_selected = level;
        //---
        let _tmp = structuredClone(this.template);
        delete _tmp[1];
        this.fields = _tmp;
        //let _header = { header: { ID: "", ShortTitle: "", Description: "", SecurityLevel: "100" } };
        let _header = { header: { ID: "", ShortTitle: "", SecurityLevel: this.security_level_selected.Level.toString() } };
        this.model = _header;
        this.DataSave = structuredClone(this.content);
        //---          
      });*/
      //--------------
    });
}
//------------------------------------------------------------------------------
public LoadSelectedTemplate() {
  this.service.GetTechPassportTemplate(this.ID).subscribe((result: any) => {
    if (result.data != null) {
      //
      let level = this.security_data[0];
      this.security_level_selected = level;
      //        
      let _tmp = structuredClone(this.template);
      delete _tmp[1];
      this.fields = _tmp;
      //
      this.Passport = result.data[0];
      this.storageService.saveToken(result.jwt);
      if(result.data[0].Content!='undefined')
      {
        this.content = JSON.parse(result.data[0].Content);
      }
      else
      {
        this.content = '{}';
      }
      this.DataSave = structuredClone(this.content);
      let _header = {
        header: {
          ID: result.data[0].ID,
          ShortTitle: result.data[0].ShortTitle,
          SecurityLevel: this.security_data.filter((word: any) => (word.ID == this.Passport.SecurityLevel))[0].Level.toString()
        }
      };

      this.model = _header;
      this.initialData = this.content;
      this.visibleData = this.content;
      
    }
    else {
      console.log('error');
      //this.router.navigate(['login']);
    }
  });
}

//------------------------------------------------------------------------------
save() {
  this.Passport.ShortTitle = this.model.header.ShortTitle;
  this.Passport.ArchiveSign=false;
  //this.Passport.EntityStructure=this.parent_id;
  this.Passport.SecurityLevel = this.security_data.filter((word: SecurityLevel) => (word.Level == this.model.header.SecurityLevel))[0].ID!;
  this.Passport.Content = structuredClone(this.DataSave);
  this.Passport.TemplateSign=true;
  //this.Passport.Template=n;

  //TODO
  //this.service.CreateTechPasport(this.Passport, "Template").subscribe((result: any) => {
    this.service.UpdateTechPasport(this.Passport).subscribe((result: any) => {
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
      console.log('error: ' + err0);
    }

  );
}
//----------------------------------  
exit() {
  if (this.form.valid) {
    console.log(JSON.stringify(this.model));
  }
  //this.router.navigate(['home/technology_passport']);
  window.top!.close();
}
//------------------------------------------------------------------------------

}
