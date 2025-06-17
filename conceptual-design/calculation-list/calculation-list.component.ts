import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Sort, MatSort } from '@angular/material/sort';
import { faCoffee, faShieldHalved, faPen, faEnvelope, faPhone, faShield, faBoxArchive, faEye, faTrash, faPlay } from '@fortawesome/free-solid-svg-icons';
import { MatTableDataSource } from '@angular/material/table';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSelectChange } from '@angular/material/select';
import { Project, VUsers, FileItem, VModule, Calculation } from '../../../model/structures';
import { MatPaginator } from '@angular/material/paginator';
import { MasterService } from 'src/app/services/master.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../../../services/authentication.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CalRemoveConfirmComponent } from '../modal/cal-remove-confirm/cal-remove-confirm.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-calculation-list',
  templateUrl: './calculation-list.component.html',
  styleUrls: ['./calculation-list.component.css']
})
export class CalculationListComponent implements OnInit {
  public faCoffee = faCoffee;
  public faShieldHalved = faShieldHalved;
  public faPen = faPen;
  public faEnvelope = faEnvelope;
  public faPhone = faPhone;
  public faShield = faShield;
  public faBoxArchive = faBoxArchive;
  public faEye = faEye;
  public faTrash = faTrash;
  public faPlay = faPlay;
  public isDownloading: boolean = false;

  displayedColumns: string[] = ['ID', 'ShortTitle', 'Module', 'Status', 'Edit', 'View', 'Remove', 'Launch'];
  dataSourceCalculation: any;
  calculation_data: any;
  selected_calculation: any;
  public ID!: number;

  project_form: FormGroup;
  project_data!: Project;
  public security_data: any;
  public security_level_selected: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: MasterService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private storageService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.project_form = this.formBuilder.group({
      ID: new FormControl(''),
      ShortTitle: new FormControl(''),
      Description: new FormControl(''),
      SecurityLevel: new FormControl('', Validators.required)
    });
  }

  // Новые свойства для работы с файлами расчётного модуля
  public selectedModuleId: string = '';
  public showModuleFiles: boolean = false;
  public moduleFiles: FileItem[] = [];

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.ID = params['id'];
      this.service.GetSecurityList().subscribe((result: any) => {
        this.security_data = result.data;
        let level = this.security_data[0];
        this.security_level_selected = level;
        this.project_form = this.formBuilder.group({
          ID: new FormControl(''),
          ShortTitle: new FormControl(''),
          Description: new FormControl(''),
          SecurityLevel: new FormControl('', Validators.required)
        });
        this.GetCalculationTable();
        this.GetProjectData();
      });
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  GetProjectData() {
    this.service.RedKeyGetProjectById(this.ID).subscribe((result: any) => {
      if (result.data != null) {
        this.storageService.saveToken(result.jwt);
        this.project_data = result.data[0];
        let level = this.security_data.filter((word: any) => word.ID === this.project_data.SecurityLevel)[0];
        this.security_level_selected = level;
        this.project_form.setValue({
          ID: this.project_data.ID,
          ShortTitle: this.project_data.ShortTitle,
          Description: this.project_data.Description,
          SecurityLevel: level.ShortTitle
        });
      } else {
        this.router.navigate(['login']);
      }
    });
  }

  Filterchange(event: Event) {
    const filvalue = (event.target as HTMLInputElement).value;
    this.dataSourceCalculation.filter = filvalue;
  }

  getrow(row: any) {
    this.selected_calculation = row;
    // Можно сохранить выбранный модуль, если расчет связан с модулем
    if (row.Module) {
      this.selectedModuleId = row.Module;
    }
    console.log(row);
  }

  changeLevel(e: any) {
    this.Level?.setValue(e.target.value, { onlySelf: true });
    let split_array: string[] = e.target.value.split(": ");
    this.security_level_selected = this.security_data[split_array[0]];
  }

  get Level() {
    return this.project_form.get('SecurityLevel');
  }

  RefreshList() {
    this.GetCalculationTable();
  }

  FunctionCreateCalculation() {
    this.router.navigate(['home/create_calc_master', { parent_id: this.ID }]);
  }

  FunctionEdit(_entity: any) {
    this.router.navigate(['home/edit_calc', { parent_id: this.ID, id: _entity.ID }]);
  }

  FunctionView(_entity: any) {
    this.router.navigate(['home/calc_view', { parent_id: this.ID, id: _entity.ID }]);
  }

  FunctionRemove(_entity: any) {
    const dialogRef = this.dialog.open(CalRemoveConfirmComponent, {
      width: '450px',
      data: _entity,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.submitted === true) {
        this.service.RedKeyRemoveCalculation(_entity.ID).subscribe((result: any) => {
          if (result.res == 'success') {
            this._snackBar.open('Сущность успешно удалена', '', {
              duration: 1000,
              panelClass: ['blue-snackbar']
            });
            this.GetCalculationTable();
          } else {
            this._snackBar.open('Ошибка сервера', '', {
              duration: 1000,
              panelClass: ['red-snackbar']
            });
          }
        },
        err0 => { console.log('error: ' + err0); });
      }
    }, err => { console.log('error: ' + err); });
  }

  FunctionLaunch(_entity: any) {
    this.service.RedKeyLaunchCalc(_entity.ID).subscribe((result: any) => {
      if (result.data != null) {
        console.log(result.data);
        this.GetCalculationTable();
      }
    });
  }

  GetCalculationTable() {
    this.service.RedKeyGetCalculations_by_parent_id(this.ID).subscribe((result: any) => {
      if (result.data != null) {
        this.storageService.saveToken(result.jwt);
        this.calculation_data = result.data;
        this.dataSourceCalculation = new MatTableDataSource<VUsers>(this.calculation_data);
        this.dataSourceCalculation.paginator = this.paginator;
        this.dataSourceCalculation.sort = this.sort;
      } else {
        this.router.navigate(['login']);
      }
    });
  }

  exit() {
    this.router.navigate(['home/project_cd']);
  }

  ngOnChanges() {
    this.GetCalculationTable();
    console.log('ngOnChanges calculations');
  }

  ngAfterViewInit() { }

  onSubmit() {
    console.log('submit');
    this.project_data.ShortTitle = this.project_form.value.ShortTitle;
    this.project_data.Description = this.project_form.value.Description;
    this.project_data.SecurityLevel = this.security_level_selected.ID;
    this.service.RedKeyUpdateProject(this.project_data).subscribe((result: any) => {
      if (result.res == 'success') {
        this._snackBar.open('Проект успешно изменен', '', {
          duration: 1000,
          panelClass: ['blue-snackbar']
        });
      } else {
        this._snackBar.open('Ошибка сервера', '', {
          duration: 1000,
          panelClass: ['red-snackbar']
        });
      }
    }, err0 => { console.log('error: ' + err0); });
  }


  toggleModuleFiles(): void {
    this.showModuleFiles = !this.showModuleFiles;
    
    if (this.showModuleFiles && this.selected_calculation) {
      // Используем ID расчета
      this.service.getFilesForModule(this.selected_calculation.ID).subscribe({
        next: res => {
          this.moduleFiles = res.data;
          if (res.data.length === 0) {
            this._snackBar.open('Для этого модуля нет файлов', 'Закрыть', {
              duration: 3000
            });
          }
        },
        error: err => {
          console.error("Ошибка загрузки файлов:", err);
          this._snackBar.open('Ошибка загрузки файлов модуля', 'Закрыть', {
            duration: 3000
          });
        }
      });
    }
}
  
  
  

downloadModuleFile(file: FileItem): void {
  console.log('Starting download for file:', file);
  
  if (!file?.ID) {
    console.error('Invalid file object:', file);
    this._snackBar.open('Invalid file data', 'Close', { duration: 3000 });
    return;
  }

  this.isDownloading = true;

  this.service.downloadRedkeyFile(file.ID.toString()).subscribe({
    next: (blob: Blob) => {
      if (!blob || blob.size === 0) {
        throw new Error('Empty response received');
      }

      console.log(`Received blob with size: ${blob.size} bytes`);
      
      const filename = file.ShortTitle || `file_${file.ID}`;
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.isDownloading = false;
      }, 100);
    },
    error: (err) => {
      console.error('Download failed:', err);
      this.isDownloading = false;
      
      let errorMessage = 'Download failed';
      if (err.status === 404) {
        errorMessage = 'File not found on server';
      } else if (err.status === 401) {
        errorMessage = 'Authorization required';
      }
      
      this._snackBar.open(errorMessage, 'Close', { duration: 5000 });
    }
  });
}

private handleDownloadSuccess(blob: Blob, filename: string): void {
  // Создаем временную ссылку
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  
  // Устанавливаем параметры скачивания
  a.href = url;
  a.download = filename || 'download';
  a.style.display = 'none';
  
  // Запускаем скачивание
  document.body.appendChild(a);
  a.click();
  
  // Очистка
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, 100);
}

private handleDownloadError(err: any): void {
  console.error('Download error:', err);
  
  let errorMessage = 'Ошибка скачивания файла';
  
  if (err instanceof HttpErrorResponse) {
    if (err.status === 404) {
      errorMessage = 'Файл не найден на сервере';
    } else if (err.status === 401) {
      errorMessage = 'Ошибка авторизации';
    }
  }
  
  this._snackBar.open(errorMessage, 'Закрыть', {
    duration: 5000,
    panelClass: ['error-snackbar']
  });
}
}
