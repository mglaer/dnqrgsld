import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Sort, MatSort } from '@angular/material/sort';
import { faShieldHalved, faPen, faEnvelope, faPhone, faShield, faBoxArchive, faUser, faUsers, faUserPlus, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
import { VUsers, VGroupsAndUsersStructure, VViewVTB, ViewVTB } from '../../../model/structures';
import { MatPaginator } from '@angular/material/paginator';
import { MasterService } from 'src/app/services/master.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { MatDialog } from '@angular/material/dialog';

import { EditUserComponent } from '../../administration/modal/edit-user/edit-user.component';
import { MatSnackBar } from '@angular/material/snack-bar';
//import { UserService } from 'src/app/services';
import { CreateUserComponent } from '../../administration/modal/create-user/create-user.component';
import { UsersComponent } from '../../administration/users/users.component';
import { GroupsComponent } from '../../administration/groups/groups.component';
import { EditGroupComponent } from '../../administration/modal/edit-group/edit-group.component';
import { CreateGroupComponent } from '../../administration/modal/create-group/create-group.component';
import { FormBuilder } from '@angular/forms';
import { CreateVtbCsvComponent } from '../modal/create-vtb-csv/create-vtb-csv.component';
import { _fixedSizeVirtualScrollStrategyFactory } from '@angular/cdk/scrolling';
import { EditVtbCsvComponent } from '../modal/edit-vtb-csv/edit-vtb-csv.component';
import { RemoveConfirmComponent } from '../modal/remove-confirm/remove-confirm.component';



@Component({
  selector: 'app-csv-list',
  templateUrl: './csv-list.component.html',
  styleUrls: ['./csv-list.component.css']
})
export class CsvListComponent implements OnInit {
  public faUser = faUser;
  public faUsers = faUsers;
  public faShieldHalved = faShieldHalved;
  public faPen = faPen;
  public faEnvelope = faEnvelope;
  public faPhone = faPhone;
  public faShield = faShield;
  public faBoxArchive = faBoxArchive;
  public faUserPlus = faUserPlus;
  public faEye = faEye;
  public faTrash = faTrash;
  //-------------------------------------------------
  displayedColumns: string[] = ['ID', 'ShortTitle', 'ArchiveSign', 'action'];
  dataSource: any;
  items_list: VViewVTB[] = [];
  selected_item: any;
  @Input() parent_data: any;
  selectedValue: string = '';
  @Output() UpdateEvent = new EventEmitter<string>();

  constructor(
    private service: MasterService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private router: Router,
    private storageService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    //this.GetAll();    
  }
  //----------------------------------------------
  public FunctionCreateCsv() {
    //TODO
    //this.router.navigate([' ']);
    var entity = <VViewVTB>{};
    ///need to fill all fields!!!
    entity.ID = 0;//not used, auto
    entity.ShortTitle = '';
    entity.Entities = this.parent_data.ID;
    if (this.parent_data != undefined) {
      entity.Entities = this.parent_data.ID;
    }
    /*else {
      entity.Entities = null;
    }*/

    const dialogRef = this.dialog.open(CreateVtbCsvComponent, {
      width: '450px',
      data: entity,

    });
    //------------------------------------------------------------------------------
    dialogRef.afterClosed().subscribe(result => {
      if ((result != '') && (result != undefined)) {
        let _arg: ViewVTB = structuredClone(result.data);
        _arg.SecurityLevel = result.security_level.ID;
        _arg.Entities = this.parent_data.ID;
        this.service.CreateVtbCsv(_arg).subscribe((result: any) => {
          if (result.res == 'success') {
            this._snackBar.open('Результат испытаний успешно добавлен', '', {
              duration: 1000,
              panelClass: ['blue-snackbar']
            });
            if (this.parent_data === undefined) {
              //!!! this.UpdateEvent.next('Y');
            }
            this.UpdateEvent.next('refersh');
            this.GetAll();
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
  //---------------------------------------------- 
  public GetAll() {
    this.service.GetVtbCsvList(this.parent_data.ID).subscribe((result: any) => {
      if (result.data != null) {
        this.storageService.saveToken(result.jwt);
        this.items_list = [];
        this.items_list = result.data;
      }
    });
  }
  //------------------------------------------------------------------------------
  FunctionChangeActive(_event: any) {

  }
  //------------------------------------------------------------------------------
  FunctionRemove(_entity: any) {
    console.log('');
    const dialogRef = this.dialog.open(RemoveConfirmComponent, {
      width: '450px',
      data: _entity,
    });
    //------------------------------------------------------------------------------
    dialogRef.afterClosed().subscribe(result => {
      if (result.submitted === true) {
        this.service.RemoveVtbCsv(_entity.ID).subscribe((result: any) => {
          if (result.res == 'success') {
            this._snackBar.open('Сущность успешно удалена', '', {
              duration: 1000,
              panelClass: ['blue-snackbar']
            });
            this.GetAll();
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
  //------------------------------------------------------------------------------
  FunctionEdit(_entity: any) {
    console.log('');
    const dialogRef = this.dialog.open(EditVtbCsvComponent, {
      width: '450px',
      data: _entity,
    });
    //------------------------------------------------------------------------------
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {
        let _arg: ViewVTB = structuredClone(result.data);
        _arg.SecurityLevel = result.security_level.ID;
        _arg.Entities = this.parent_data.ID;
        this.service.UpdateVtbCsv(_arg).subscribe((result: any) => {
          if (result.res == 'success') {
            this._snackBar.open('Сущность успешно обновлена', '', {
              duration: 1000,
              panelClass: ['blue-snackbar']
            });
            this.GetAll();
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
  //------------------------------------------------------------------------------
  FunctionShow(_entity: any) {
    console.log('FunctionEdit');
    //this.router.navigate(['home/csv-viewer', { id: _entity.ID }]);

    const link = this.router.serializeUrl(this.router.createUrlTree(['home/csv-viewer', { id: _entity.ID }]));
    this.storageService.SetRouterUrl('home/csv-viewer',JSON.stringify({ id: _entity.ID }));
    window.open(link, '_blank');

    //http://localhost:4200/#/home/csv-viewer;id=6
    //let url=window.location.host+'/#/'+'home/csv-viewer'+';id='+_entity.ID;
    //window.open(url, '_blank');
    //window.open('http://localhost:4200/#/home/csv-viewer;id=6', '_blank');
    /*
    let baseUrl = window.location.href.replace(this.router.url, '');
    const url = this.router.serializeUrl(this.router.createUrlTree([baseUrl+'home/csv-viewer', { id: _entity.ID }]));
    window.open(url, '_blank');
*/


  }
  //------------------------------------------------------------------------------
  ngOnChanges(): void {
    this.GetAll();
  }
}
