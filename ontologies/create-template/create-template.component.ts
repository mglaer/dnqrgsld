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
import { Entities, SecurityLevel } from '../../../model/structures';
import { faCoffee, faShieldHalved, faPen, faEnvelope, faPhone, faShield, faBoxArchive } from '@fortawesome/free-solid-svg-icons';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { JsonEditorOptions } from "@maaxgr/ang-jsoneditor";
import { MatSnackBar } from '@angular/material/snack-bar';
import { stringify } from 'querystring';
import { ImageFullSizeComponent } from '../modal/image-full-size/image-full-size.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-create-template',
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.css']
})
export class CreateTemplateMasterComponent implements OnInit {
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

  //public parent_id: any;
  public Entity!: Entities;
  public security_data!: SecurityLevel[];
  public security_level_selected: any;
  //-----------FormFly--------------
  form = new FormGroup({});
  model_header: any;
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
      TemplateSign: true,
      Template: 0,
      URLPicture: ""
    };

    //
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
      //this.parent_id = params['ID'];
      this.Entity.EntityStructure = params['ID'];
      this.load_root_template();
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
          let level = this.security_data[0];
          this.security_level_selected = level;
          //---
          let _tmp = structuredClone(this.template);
          delete _tmp[1];
          this.fields = _tmp;
          //let _header = { header: { ID: "", ShortTitle: "", Description: "", SecurityLevel: "100" } };
          let _header = { header: { ID: "", ShortTitle: "", Description: "", SecurityLevel: this.security_level_selected.Level.toString() } };
          this.model_header = _header;
          this.service.download_file(this.Entity.URLPicture).subscribe((rdn: any) => {
            this.img_path = 'data:image/png;base64, ' + rdn.data;
          },
            err0 => {
              console.log('error: ' + err0);
            }
          );
          this.DataPrivateSave = structuredClone(this.private_content);
          this.DataOpenSave = structuredClone(this.open_content);
          //---          
        });
        //--------------
      });
  }
  //------------------------------------------------------------------------------
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
  //----
  save_func(_url_picture: string) {
    this.Entity.ShortTitle = this.model_header.header.ShortTitle;
    this.Entity.Description = this.model_header.header.Description;
    this.Entity.SecurityLevel = this.security_data.filter((word: SecurityLevel) => (word.Level == this.model_header.header.SecurityLevel))[0].ID!;
    this.Entity.OpenContent = structuredClone(this.DataOpenSave);
    this.Entity.PrivateContent = structuredClone(this.DataPrivateSave);
    this.Entity.URLPicture = _url_picture;
    this.service.CreateOntology(this.Entity, "Template").subscribe((result: any) => {
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
      err00 => {
        console.log('error: ' + err00);
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
