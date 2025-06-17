import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Sort, MatSort } from '@angular/material/sort';
import { faShieldHalved, faPen, faEnvelope, faPhone, faShield, faBoxArchive, faUser, faL } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
import { VUsers } from '../../../model/structures';
import { MatPaginator } from '@angular/material/paginator';
import { MasterService } from 'src/app/services/master.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { MatDialog } from '@angular/material/dialog';

import { EditUserComponent } from '../modal/edit-user/edit-user.component';
import { MatSnackBar } from '@angular/material/snack-bar';
//import { UserService } from 'src/app/services';
import { CreateUserComponent } from '../modal/create-user/create-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  public faUser = faUser;
  public faShieldHalved = faShieldHalved;
  public faPen = faPen;
  public faEnvelope = faEnvelope;
  public faPhone = faPhone;
  public faShield = faShield;
  public faBoxArchive = faBoxArchive;
  @Input() parent_data: any;
  //-------------------------------------------------
  //displayedColumns: string[] = ['user_id', 'login', 'firstname', 'lastname', 'middlename', 'organization',    'mail', 'phone', 'active', 'action'];
  displayedColumns: string[] = ['ID', 'Login', 'FirstName', 'LastName', 'MiddleName', 'Phone', 'Email', 'SecurityLevel', 'ArchiveSign', 'action'];
  dataSource: any;
  user_data: any;
  selected_user: any;
  //-------------------------------------------------
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  public show_archieved: boolean = false;


  constructor(private service: MasterService,
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
  GetAll() {
    this.service.GetUsers().subscribe((result: any) => {
      if (result.data != null) {
        this.storageService.saveToken(result.jwt);
        if (this.show_archieved) {
          this.user_data = result.data;
        }
        else {
          this.user_data = result.data.filter((word: any) => word.ArchiveSign === false);
        }
        //
        if(this.parent_data.ID!=-2)
        {
          this.user_data = result.data.filter((word: any) => word.ID === this.parent_data.ID);
        }
        //
        this.dataSource = new MatTableDataSource<VUsers>(this.user_data);
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
    this.selected_user = row;
    //console.log(row);
  }
  //-----------------------------------------------------------------------------
  FunctionCreate() {
    var user = <VUsers>{};
    ///need to fill all fields!!!
    user.ID=0;//not used, auto
    user.FirstName='';
    user.LastName='';
    user.MiddleName='';
    user.Login='';
    user.Phone='';
    user.Email='';
    user.Password='';
    user.SecurityLevel='';
    user.ArchiveSign=false;
    user.SecurityID=0;//no used, auto

    const dialogRef = this.dialog.open(CreateUserComponent, {
      width: '450px',
      data: user
    });
    //------------------------------------------------------------------------------
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {
        this.service.CreateUser(result).subscribe((result: any) => {
          if (result.res == 'success') {
            this._snackBar.open('Пользователь успешно добавлен', '', {
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
  FunctionEdit(_user: any) {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '450px',
      data: _user,      
    });
    //------------------------------------------------------------------------------
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {
        this.service.UpdateUser(result).subscribe((result: any) => {
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
    },
      err => {
        console.log('error: ' + err);
      });
  }
  //-----------------------------------------------------------------------------
  FunctionChangeActive(_user: any) {
    this.service.ActivationUser(_user).subscribe((result: any) => {
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
  //---------------------------------------------------------------------------
  ngOnInit(): void {
    //this.GetAll();
  }

  //------------------------------------------------------------------------------
  ngOnChanges(): void {
    this.GetAll();
  }
  ngAfterViewInit() {

  }

}
