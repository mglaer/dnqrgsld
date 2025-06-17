import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { MasterService, FileItem } from 'src/app/services/master.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { Entities, SecurityLevel } from '../../../model/structures';
import { faShieldHalved, faPen, faEnvelope, faPhone, faShield, faBoxArchive } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ImageUploadComponent } from '../modal/image-upload/image-upload.component';
import { ImageFullSizeComponent } from '../modal/image-full-size/image-full-size.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-edit-entity',
  templateUrl: './edit-entity.component.html',
  styleUrls: ['./edit-entity.component.css']
})
export class EditEntityComponent implements OnInit, AfterViewInit {
  public img_path: string = "";
  public faShieldHalved = faShieldHalved;
  public faPen = faPen;
  public faEnvelope = faEnvelope;
  public faPhone = faPhone;
  public faShield = faShield;
  public faBoxArchive = faBoxArchive;

  public ID: any;
  displayedColumns: string[] = ['ID', 'ShortTitle', 'Description', 'ArchiveSign', 'SecurityLevel'];
  selected_template = <Entities>{};
  public Entity!: Entities;
  public security_data!: SecurityLevel[];
  public security_level_selected: any;

  public submit(): void {
    if (this.form.valid) {
      console.log("Header form data:", JSON.stringify(this.model_header));
    }
    if (this.form_body.valid) {
      console.log("Body form data:", JSON.stringify(this.model_body));
    }
  }

  public removeMainImage(): void {
    if (this.Entity && this.Entity.URLPicture) {
      this.service.deleteMainImage(this.Entity.ID.toString(), this.Entity.URLPicture).subscribe(
        (res: any) => {
          if (res.res === 'success') {
            this.img_path = '';
            this.Entity.URLPicture = '';
            this._snackBar.open('Главное изображение удалено', '', { duration: 2000, panelClass: ['blue-snackbar'] });
          } else {
            this._snackBar.open('Ошибка при удалении изображения', '', { duration: 2000, panelClass: ['red-snackbar'] });
          }
        },
        error => {
          console.error('Error deleting main image:', error);
          this._snackBar.open('Ошибка при удалении изображения', '', { duration: 2000, panelClass: ['red-snackbar'] });
        }
      );
    } else {
      this.img_path = '';
    }
  }

  // Форма редактирования (header)
  form = new FormGroup({});
  model_header: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [];
  template: any;
  public template_private_content: any;
  public template_open_content: any;

  // Форма для "Знаний" (body)
  form_body = new FormGroup({});
  model_body: any = {};
  options_body: FormlyFormOptions = {};
  fields_body: FormlyFieldConfig[] = [];
  tmp_header: any;
  tmp_body: any;
  header: any;
  body: any;

  // Управление прикреплёнными файлами
  files: FileItem[] = [];
  displayedFileColumns: string[] = ['ShortTitle', 'Actions'];
  dataSourceFiles = new MatTableDataSource<FileItem>(this.files);
  selectedFile: File | null = null;
  shortTitle: string = '';
  selectedFileName: string = '';
  isUploading: boolean = false;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('mainImageInput') mainImageInput!: ElementRef<HTMLInputElement>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private service: MasterService,
    private storageService: AuthenticationService,
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.ID = params['ID'];
      this.load_root_template();
    });
  }

  ngAfterViewInit() {
    this.dataSourceFiles.paginator = this.paginator;
  }

  public load_root_template() {
    this.http.get<any>(`/assets/root_template.json`).subscribe(JsonSchema => {
      this.template = JsonSchema;
      this.service.GetSecurityList().subscribe((result: any) => {
        this.security_data = result.data;
        this.LoadSelectedEntity();
      });
    });
  }

  public LoadSelectedEntity() {
    this.service.GetTemplate(this.ID).subscribe((result: any) => {
      if (result.data != null) {
        this.storageService.saveToken(result.jwt);
        this.Entity = result.data[0];
        this.service.GetTemplate(this.Entity.Template).subscribe((result: any) => {
          if (result.data != null) {
            const _top_level = this.security_data.filter((w: any) => w.ID == result.data[0].SecurityLevel)[0].Level;
            this.security_data = this.security_data.filter((w: any) => w.Level <= _top_level);
            this.security_level_selected = this.security_data[0];
            this.selected_template = result.data[0];
            this.template_private_content = JSON.parse(result.data[0].PrivateContent);
            this.template_open_content = JSON.parse(result.data[0].OpenContent);
            this.template[0].fieldGroup[0].fieldGroup[2].props.options = [];
            for (let i = 0; i < this.security_data.length; i++) {
              const _row = { label: this.security_data[i].ShortTitle, value: this.security_data[i].Level.toString() };
              this.template[0].fieldGroup[0].fieldGroup[2].props.options.push(_row);
            }
            this.tmp_header = structuredClone(this.template);
            this.tmp_header[1] = [];
            this.tmp_body = structuredClone(this.template);
            this.tmp_body[0] = [];
            this.tmp_body[1].fieldGroup[0].fieldGroup[0].fieldGroup.push(this.template_open_content);
            this.tmp_body[1].fieldGroup[0].fieldGroup[1].fieldGroup.push(this.template_private_content);

            if (this.Entity.URLPicture && this.Entity.URLPicture !== 'undefined') {
              this.service.downloadMainImage(this.Entity.URLPicture).subscribe((rdn: any) => {
                this.img_path = 'data:' + rdn.mimeType + ';base64,' + rdn.data;
              },
              err0 => {
                console.log('Error loading main image: ' + err0);
              });
            }

            let _open = {};
            let _private = {};
            if (this.Entity.OpenContent != 'undefined') {
              _open = JSON.parse(this.Entity.OpenContent);
            }
            if (this.Entity.PrivateContent != 'undefined') {
              _private = JSON.parse(this.Entity.PrivateContent);
            }
            this.header = {
              header: {
                ID: this.Entity.ID,
                ShortTitle: this.Entity.ShortTitle,
                Description: this.Entity.Description,
                SecurityLevel: this.security_data.filter((w: any) => w.ID == this.selected_template.SecurityLevel)[0].Level.toString()
              },
              tabs_root: {
                tabs: {
                  open_content: _open,
                  private_content: _private
                }
              }
            };
            this.loadSqlData(this.tmp_header, 'type');
            this.model_header = structuredClone(this.header);
            this.fields = structuredClone(this.tmp_header);
            this.model_body = structuredClone(this.header);
            this.fields_body = structuredClone(this.tmp_body);

            this.fetchFiles();
          }
        });
      } else {
        console.log('Error loading entity');
      }
    });
  }

  loadSqlData = (obj: any, key: any) => {
    let newObj: any = {};
    for (const ogKey in obj) {
      if (ogKey === key) {
        let _select_db: string = '';
        if (obj[key] === 'select' && obj['props'] && obj['props']['options']) {
          obj['props']['options'].forEach((element: any) => {
            if (element['select_db'] != undefined) {
              _select_db = element['select_db'];
              this.service.CustomRequest(_select_db).subscribe((result: any) => {
                obj['props']['options'] = [];
                for (let i = 0; i < result.data.length; i++) {
                  obj['props']['options'].push(result.data[i]);
                }
                this.model_header = structuredClone(this.header);
                this.fields = structuredClone(this.tmp_header);
                this.model_body = structuredClone(this.header);
                this.fields_body = structuredClone(this.tmp_body);
              });
            }
          });
        }
      } else if (typeof obj[ogKey] === 'object') {
        newObj[ogKey] = this.loadSqlData(obj[ogKey], key);
      } else {
        newObj[ogKey] = obj[ogKey];
      }
    }
    return newObj;
  }

  onMainImageSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.img_path = e.target.result;
        if (!this.model_header.header) {
          this.model_header.header = {};
        }
        this.model_header.header.imageFile = event.target.files;
      };
      reader.onerror = (error) => {
        console.error('Ошибка при чтении файла:', error);
      };
      reader.readAsDataURL(file);
    }
  }

  save() {
    if (this.model_header.header.imageFile != undefined) {
      this.service.uploadMainImage(this.Entity.ID.toString(), this.model_header.header.imageFile[0]).subscribe(
        (rup: any) => {
          delete this.model_header.header.imageFile;
          this.save_func(rup.data);
        },
        err0 => {
          console.log('Error uploading main image: ' + err0);
        }
      );
    } else {
      this.save_func(null);
    }
  }

  save_func(_url_picture: string | null) {
    this.Entity.ShortTitle = this.model_header.header.ShortTitle;
    this.Entity.Description = this.model_header.header.Description;
    this.Entity.SecurityLevel = this.security_data.filter((w: SecurityLevel) => w.Level == this.model_header.header.SecurityLevel)[0].ID!;
    this.Entity.OpenContent = this.model_body.tabs_root.tabs.open_content;
    this.Entity.PrivateContent = this.model_body.tabs_root.tabs.private_content;
    if (_url_picture) {
      this.Entity.URLPicture = _url_picture;
    }
    this.service.UpdateOntologyEntity(this.Entity, "Entity").subscribe((result: any) => {
      if (result.res == 'success') {
        this._snackBar.open('Entity successfully updated', '', {
          duration: 1000,
          panelClass: ['blue-snackbar']
        });
        this.fetchFiles();
      } else {
        this._snackBar.open('Server error', '', {
          duration: 1000,
          panelClass: ['red-snackbar']
        });
      }
    },
    err0 => {
      console.log('Error updating entity: ' + err0.message);
    });
  }

  exit() {
    window.top!.close();
  }

  show_full() {
    const dialogRef = this.dialog.open(ImageFullSizeComponent, {
      data: this.img_path,
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('Dialog closed');
    }, err => {
      console.log('Error: ' + err);
    });
  }

  fetchFiles(): void {
    if (!this.Entity.ID) return;
    this.service.getFiles(this.Entity.ID.toString()).subscribe(
      response => {
        this.files = response.data;
        this.dataSourceFiles.data = this.files;
        this.dataSourceFiles.paginator = this.paginator;
        this.storageService.saveToken(response.jwt);
      },
      error => {
        console.error('Error fetching files:', error);
        this._snackBar.open('Failed to load files', '', {
          duration: 3000,
          panelClass: ['red-snackbar']
        });
      }
    );
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        this._snackBar.open('File is too large. Maximum size is 10 MB.', '', {
          duration: 3000,
          panelClass: ['red-snackbar']
        });
        return;
      }
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        this._snackBar.open('Invalid file type.', '', {
          duration: 3000,
          panelClass: ['red-snackbar']
        });
        return;
      }
      this.selectedFile = file;
      this.selectedFileName = file.name;
      this.shortTitle = this.shortTitle || file.name;
    }
  }

  uploadFile(): void {
    if (this.selectedFile && this.shortTitle) {
      this.isUploading = true;
      this.service.addFile(this.Entity.ID.toString(), this.selectedFile, this.shortTitle).subscribe(
        response => {
          this.isUploading = false;
          if (response.res === 'success') {
            this._snackBar.open('File uploaded successfully', '', {
              duration: 2000,
              panelClass: ['blue-snackbar']
            });
            this.fetchFiles();
            this.selectedFile = null;
            this.selectedFileName = '';
            this.shortTitle = '';
            this.fileInput.nativeElement.value = '';
          } else {
            this._snackBar.open('Error uploading file: ' + response.res, '', {
              duration: 3000,
              panelClass: ['red-snackbar']
            });
          }
        },
        error => {
          this.isUploading = false;
          console.error('Error uploading file:', error);
          this._snackBar.open('Failed to upload file', '', {
            duration: 3000,
            panelClass: ['red-snackbar']
          });
        }
      );
    } else {
      this._snackBar.open('Please select a file and enter a display name', '', {
        duration: 3000,
        panelClass: ['yellow-snackbar']
      });
    }
  }

  deleteFile(fileId: string): void {
    if (confirm('Are you sure you want to delete this file?')) {
      this.service.deleteFile(fileId).subscribe(
        response => {
          if (response.res === 'success') {
            this._snackBar.open('File deleted successfully', '', {
              duration: 2000,
              panelClass: ['blue-snackbar']
            });
            this.fetchFiles();
          } else {
            this._snackBar.open('Error deleting file: ' + response.res, '', {
              duration: 3000,
              panelClass: ['red-snackbar']
            });
          }
        },
        error => {
          console.error('Error deleting file:', error);
          this._snackBar.open('Failed to delete file', '', {
            duration: 3000,
            panelClass: ['red-snackbar']
          });
        }
      );
    }
  }

  downloadFile(fileId: string, shortTitle: string, url: string): void {
    this.service.downloadFile(fileId).subscribe(
      blob => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        const extension = this.getFileExtension(url);
        let filename = shortTitle;
        if (!shortTitle.endsWith(extension)) {
          filename += extension;
        }
        a.download = filename;
        a.click();
        URL.revokeObjectURL(objectUrl);
        this._snackBar.open('File downloaded successfully', '', {
          duration: 2000,
          panelClass: ['blue-snackbar']
        });
      },
      error => {
        console.error('Error downloading file:', error);
        this._snackBar.open('Failed to download file', '', {
          duration: 3000,
          panelClass: ['red-snackbar']
        });
      }
    );
  }

  getFileExtension(url: string): string {
    const index = url.lastIndexOf('.');
    return index !== -1 ? url.substring(index) : '';
  }
}

