import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { cnst } from '../../../model/cnst';
import { Params, Router, RouteReuseStrategy } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MasterService } from 'src/app/services/master.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { Entities, SecurityLevel } from '../../../model/structures';
import { faCoffee, faShieldHalved, faPen, faEnvelope, faPhone, faShield, faBoxArchive } from '@fortawesome/free-solid-svg-icons';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { JsonEditorOptions } from "@maaxgr/ang-jsoneditor";
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileValueAccessor } from '../modal/file-value-accessor';
import { MatDialog } from '@angular/material/dialog';
import { ImageFullSizeComponent } from '../modal/image-full-size/image-full-size.component';

@Component({
  selector: 'app-edit-template',
  templateUrl: './edit-template.component.html',
  styleUrls: ['./edit-template.component.css']
})
export class EditTemplateComponent implements OnInit {
  public img_path: string = "";
  //---
  public editorOptionsOpen: JsonEditorOptions = new JsonEditorOptions();
  public initialDataOpen: any;
  public visibleDataOpen: any;
  public DataOpenSave: any;
  public DataPrivateSave: any;
  //
  public editorOptionsPrivate: JsonEditorOptions = new JsonEditorOptions();
  public initialDataPrivate: any;
  public visibleDataPrivate: any;
  //---
  public faShieldHalved = faShieldHalved;
  public faPen = faPen;
  public faEnvelope = faEnvelope;
  public faPhone = faPhone;
  public faShield = faShield;
  public faBoxArchive = faBoxArchive;

  public ID: any;
  public Entity!: Entities;
  public security_data!: SecurityLevel[];
  public security_level_selected: any;
  //-----------FormFly--------------
  form = new FormGroup({});
  //model: any = { header: { ShortTitle: "Zagolovok", Description: "opisalovo", SecurityLevel: "0" } };
  model_header: any = { header: { ShortTitle: "", Description: "", SecurityLevel: "0" } };
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [];
  //
  //----------------------------------
  //form_body = new FormGroup({});
  //model_body: any = {};
  //options_body: FormlyFormOptions = {};
  //fields_body: FormlyFieldConfig[] = [];
  //----------------------------------
  //
  template: any;
  public private_content: any;
  public open_content: any;
  submit() {
    if (this.form.valid) {
      console.log(JSON.stringify(this.model_header));
    }
  }
  //----------------------------------
  constructor(private router: Router,
    private service: MasterService,
    private storageService: AuthenticationService,
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog    
  ) {
    this.editorOptionsOpen = new JsonEditorOptions();
    //this.editorOptionsOpen.modes = ['code', 'text', 'tree', 'view'];
    this.editorOptionsOpen.modes = ['code'];
    this.editorOptionsOpen.mode = 'code';
    this.editorOptionsOpen.language = 'ru';


    this.initialDataOpen = {};
    this.visibleDataOpen = this.initialDataOpen;
    //
    this.editorOptionsPrivate = new JsonEditorOptions();
    //this.editorOptionsPrivate.modes = ['code', 'text', 'tree', 'view'];
    this.editorOptionsPrivate.modes = ['code'];
    this.editorOptionsPrivate.mode = 'code';
    this.editorOptionsPrivate.language = 'ru';

    this.initialDataPrivate = {};
    this.visibleDataPrivate = this.initialDataPrivate;
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
  showJsonOpen(d: Event) {
    this.visibleDataOpen = d;
    this.DataOpenSave = d;
  }
  //----------------------------------
  showJsonPrivate(d: Event) {
    this.visibleDataPrivate = d;
    this.DataPrivateSave = d;
  }
  //----------------------------------
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.ID = params['ID'];
      this.load_root_template();
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
  //------------------------------------------------------------------------------    
  public load_root_template() {
    this.http
      .get<any>(`/assets/root_template.json`)
      .subscribe(JsonSchema => {
        this.template = JsonSchema;
        //---security---
        this.service.GetSecurityList().subscribe((result: any) => {
          this.security_data = result.data;
          if (this.ID != 'null') {
            this.LoadSelectedTemplate();
          }
        });

      });
  }
  //------------------------------------------------------------------------------
  public LoadSelectedTemplate() {
    this.service.GetTemplate(this.ID).subscribe((result: any) => {
      if (result.data != null) {
        //
        let level = this.security_data[0];
        this.security_level_selected = level;
        //        
        let _tmp = structuredClone(this.template);
        delete _tmp[1];
        this.fields = _tmp;
        //
        this.Entity = result.data[0];
        this.storageService.saveToken(result.jwt);
        if (result.data[0].PrivateContent != 'undefined') {
          this.private_content = JSON.parse(result.data[0].PrivateContent);
        }
        else {
          this.private_content = '{}';
        }
        if (result.data[0].OpenContent != 'undefined') {
          this.open_content = JSON.parse(result.data[0].OpenContent);
        }
        else {
          this.open_content = '{}';
        }
        this.DataPrivateSave = structuredClone(this.private_content);
        this.DataOpenSave = structuredClone(this.open_content);
        let _header = {
          header: {
            ID: result.data[0].ID,
            ShortTitle: result.data[0].ShortTitle,
            Description: result.data[0].Description,
            SecurityLevel: this.security_data.filter((word: any) => (word.ID == this.Entity.SecurityLevel))[0].Level.toString()
          }
        };

        this.model_header = _header;
        this.service.download_file(this.Entity.URLPicture).subscribe((rdn: any) => {
          this.img_path = 'data:image/png;base64, ' + rdn.data;
        },
          err0 => {
            console.log('error: ' + err0);
          }
        );
        this.initialDataOpen = this.open_content;
        this.visibleDataOpen = this.open_content;
        this.initialDataPrivate = this.private_content;
        this.visibleDataPrivate = this.private_content;
        ////
        /*this.service.download_file(this.Entity.URLPicture).subscribe((rdn: any) => {
        //this.model.header.files[0]=rdn.data;      
        },
          err0 => {
            console.log('error: ' + err0);
          }
        );*/
        ////
      }
      else {
        console.log('error');
        //this.router.navigate(['login']);
      }
    });
  }
  //----------------------------------
  save() {
    if (this.model_header.header.file != undefined) {
      this.service.upload_file(this.model_header.header.file[0]).subscribe((rup: any) => {
        this.save_func(rup.data);
      },
        err0 => {
          console.log('error: ' + err0);
        }
      );
    }
    else {
      this.save_func('');
    }
  }
  //----------------------------------
  save_func(_url_picture: string) {
    this.Entity.ShortTitle = this.model_header.header.ShortTitle;
    this.Entity.Description = this.model_header.header.Description;
    this.Entity.SecurityLevel = this.security_data.filter((word: SecurityLevel) => (word.Level == this.model_header.header.SecurityLevel))[0].ID!;
    this.Entity.OpenContent = structuredClone(this.DataOpenSave);
    this.Entity.PrivateContent = structuredClone(this.DataPrivateSave);
    this.Entity.URLPicture = _url_picture;//this.model.header.file[0].name;
    this.service.UpdateOntologyEntity(this.Entity, "Entity").subscribe((result: any) => {
      if (result.res == 'success') {
        this._snackBar.open('Сущность успешно обновлена', '', {
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
      //console.log(JSON.stringify(this.model_header));
    }
    //this.router.navigate(['home/ontologies_structure']);
    window.top!.close();
  }
  //------------------------------------------------------------------------------
}
