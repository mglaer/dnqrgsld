import { Component, OnInit, ViewChild, Input, Output,EventEmitter } from '@angular/core';
import { Sort, MatSort } from '@angular/material/sort';
import { faShieldHalved, faPen, faEnvelope, faPhone, faShield, faBoxArchive, faUser, faUsers, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
import { VUsers, VGroupsAndUsersStructure } from '../../../model/structures';
import { MatPaginator } from '@angular/material/paginator';
import { MasterService } from 'src/app/services/master.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { MatDialog } from '@angular/material/dialog';

import { EditUserComponent } from '../modal/edit-user/edit-user.component';
import { MatSnackBar } from '@angular/material/snack-bar';
//import { UserService } from 'src/app/services';
import { CreateUserComponent } from '../modal/create-user/create-user.component';
import { UsersComponent } from '../users/users.component';
import { GroupsComponent } from '../groups/groups.component';
import { EditGroupComponent } from '../modal/edit-group/edit-group.component';
import { CreateGroupComponent } from '../modal/create-group/create-group.component';

@Component({
  selector: 'app-administration-list',
  templateUrl: './administration-list.component.html',
  styleUrls: ['./administration-list.component.css']
})
export class AdministrationListComponent implements OnInit {
  public faUser = faUser;
  public faUsers = faUsers;
  public faShieldHalved = faShieldHalved;
  public faPen = faPen;
  public faEnvelope = faEnvelope;
  public faPhone = faPhone;
  public faShield = faShield;
  public faBoxArchive = faBoxArchive;
  public faUserPlus = faUserPlus;
  //-------------------------------------------------
  displayedColumns: string[] = ['ID', 'TypeEntity', 'ShortTitle', 'ArchiveSign', 'action'];
  dataSource: any;
  //items_list: VGroupsAndUsersStructure[]=[];
  items_list: any;
  selected_item: any;
  @Input() parent_data: any;
  @Output() UpdateEvent = new EventEmitter<string>();
  //-------------------------------------------------
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  @ViewChild(UsersComponent) child_users!: UsersComponent;
  @ViewChild(GroupsComponent) child_groups!: GroupsComponent;
  public show_archieved: boolean = false;
  public panel_size_top: number = 50;
  public panel_size_bottom: number = 50;

  constructor(
    private service: MasterService,
    //public dialog: MatDialog
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private storageService: AuthenticationService,
    private router: Router,
  ) { }
  //------------------------------------------------------------------------------
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
  //------------------------------------------------------------------------------
  ngOnInit(): void {
    //this.GetAll();
  }
  //------------------------------------------------------------------------------
  ngOnChanges(): void {
    this.GetAll();
  }
  //------------------------------------------------------------------------------

  FunctionCreateUser() {
    var entity = <VGroupsAndUsersStructure>{};
    ///need to fill all fields!!!
    entity.ID = 0;//not used, auto
    entity.ShortTitle = '';
    //user.ArchiveSign=false;
    if (this.parent_data != undefined) {
      entity.Parent = this.parent_data.ID;
    }
    else {
      entity.Parent = null;
    }  

    const dialogRef = this.dialog.open(CreateUserComponent, {
      width: '450px',
      data: entity,

    });
    //------------------------------------------------------------------------------
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {
        this.service.CreateUser(result).subscribe((result: any) => {
          if (result.res == 'success') {
            this._snackBar.open('Сущность успешно добавлена', '', {
              duration: 1000,
              panelClass: ['blue-snackbar']
            });
            if (this.parent_data === undefined) {
              //!!! this.UpdateEvent.next('Y');
            }
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
  FunctionCreateGroup() {
    var entity = <VGroupsAndUsersStructure>{};
    ///need to fill all fields!!!
    entity.ID = 0;//not used, auto
    entity.ShortTitle = '';
    //user.ArchiveSign=false;
    if (this.parent_data != undefined) {
      entity.Parent = this.parent_data.ID;
    }
    else {
      entity.Parent = null;
    }  

    const dialogRef = this.dialog.open(CreateGroupComponent, {
      width: '450px',
      data: entity,

    });
    //------------------------------------------------------------------------------
    dialogRef.afterClosed().subscribe(result => {
      if ((result != '')&&(result != undefined)) {
        this.service.CreateGroup(result).subscribe((result: any) => {
          if (result.res == 'success') {
            this._snackBar.open('Сущность успешно добавлена', '', {
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
  //------------------------------------------------------------------------------
  FunctionEdit(_entity: any) {
    if (_entity.TypeEntity == 'Users') {//user
      console.log('');
      const dialogRef = this.dialog.open(EditUserComponent, {
        width: '450px',
        data: _entity,
      });
      //------------------------------------------------------------------------------
      dialogRef.afterClosed().subscribe(result => {
        if (result != '') {
          this.service.UpdateUser(result).subscribe((result: any) => {
            if (result.res == 'success') {
              this._snackBar.open('Сущность успешно обновлена', '', {
                duration: 1000,
                panelClass: ['blue-snackbar']
              });
              this.GetAll();
              //this.GetEntityStructure(this.parent_data.ID, false);
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
    else if (_entity.TypeEntity == 'Groups') {//group

      console.log('');
      const dialogRef = this.dialog.open(EditGroupComponent, {
        width: '450px',
        data: _entity,
      });
      //------------------------------------------------------------------------------
      dialogRef.afterClosed().subscribe(result => {
        if (result != '') {
          this.service.UpdateGroup(result).subscribe((result: any) => {
            if (result.res == 'success') {
              this._snackBar.open('Сущность успешно обновлена', '', {
                duration: 1000,
                panelClass: ['blue-snackbar']
              });
              this.GetAll();
              //this.GetEntityStructure(this.parent_data.ID, false);
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

  }
  //---------------------------------------------------------------------
  //-----------------------------------------------------------------------------
  FunctionChangeActive(_entity: any) {
    //TODO!!!!!!!!!!!
    if(_entity.TypeEntity==='Users')
    {
      this.service.ActivationUser(_entity).subscribe((result: any) => {
        if (result.res == 'success') {
          this._snackBar.open('Пользователь успешно обновлен', '', {
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
    else if(_entity.TypeEntity==='Groups')
    {
      this.service.ActivationGroup(_entity).subscribe((result: any) => {
        if (result.res == 'success') {
          this._snackBar.open('Группа успешно обновлена', '', {
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

  }
  //---------------------------------------------------------------------

  //------------------------------------------------------------------------------
  GetAll() {
    this.service.VGroupsAndUsersStructure_get_items_by_parent_id(this.parent_data.ID).subscribe((result: any) => {
      if (result.data != null) {
        this.storageService.saveToken(result.jwt);
        if (this.show_archieved) {
          this.items_list = result.data;
        }
        else {
          this.items_list = result.data.filter((word: any) => word.ArchiveSign === false);
        }
        this.dataSource = new MatTableDataSource<VGroupsAndUsersStructure>(this.items_list);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      else {
        this.router.navigate(['login']);
      }
    });
  }
  //------------------------------------------------------------------------------
  Filterchange(event: Event) {
    const filvalue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filvalue;
  }
  //------------------------------------------------------------------------------
  getrow(row: any) {
    this.selected_item = row;
    console.log(row);
    /*if(row.TypeEntity==='Groups')
    {
      this.child_groups.GetVGroupsRoot();
    }
    else if(row.TypeEntity==='Users')
    {
      this.child_users.GetAll();
    }*/
  }

  //------------------------------------------------------------------------------

}
