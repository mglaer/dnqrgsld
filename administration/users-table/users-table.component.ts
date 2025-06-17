import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Sort, MatSort } from '@angular/material/sort';
import { faCoffee, faShieldHalved, faPen, faEnvelope, faPhone, faShield, faBoxArchive } from '@fortawesome/free-solid-svg-icons';

import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
import { VUsers } from '../../../model/structures';
import { MatPaginator } from '@angular/material/paginator';
import { MasterService } from 'src/app/services/master.service';

import { MatDialog } from '@angular/material/dialog';

import { EditUserComponent } from '../modal/edit-user/edit-user.component';
import { MatSnackBar } from '@angular/material/snack-bar';
//import { UserService } from 'src/app/services';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css']
})
export class UsersTableComponent implements OnInit {
  public faCoffee = faCoffee;
  public faShieldHalved = faShieldHalved;
  public faPen = faPen;
  public faEnvelope = faEnvelope;
  public faPhone = faPhone;
  public faShield = faShield;
  public faBoxArchive = faBoxArchive;
  //-------------------------------------------------
  //displayedColumns: string[] = ['user_id', 'login', 'firstname', 'lastname', 'middlename', 'organization',    'mail', 'phone', 'active', 'action'];
  displayedColumns: string[] = ['ID', 'Login', 'FirstName', 'LastName', 'MiddleName', 'SecurityLevel', 'ArchiveSign'];
  dataSourceUser: any;
  user_data: any;
  selected_user: any;
  @Input() ID: number = 0;
  //-------------------------------------------------
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;


  constructor(
    private service: MasterService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private storageService: AuthenticationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.GetUsersTable(this.ID);
  }


  //------------------------------------------------------------------------------
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
  //------------------------------------------------------------------------------

  //------------------------------------------------------------------------------
  Filterchange(event: Event) {
    const filvalue = (event.target as HTMLInputElement).value;
    this.dataSourceUser.filter = filvalue;
  }
  //------------------------------------------------------------------------------
  getrow(row: any) {
    this.selected_user = row;
    //console.log(row);
  }
  //------------------------------------------------------------------------------
  //------------------------------------------------------------------------------
  GetUsersTable(_id: any) {
    this.service.VUsers_get_item_by_id(_id).subscribe((result: any) => {
      if (result.data != null) {
        this.storageService.saveToken(result.jwt);
        this.user_data = result.data;
        this.dataSourceUser = new MatTableDataSource<VUsers>(this.user_data);
        this.dataSourceUser.paginator = this.paginator;
        this.dataSourceUser.sort = this.sort;
      }
      else {
        this.router.navigate(['login']);
      }
    });
  }
  //------------------------------------------------------------------------------

  //------------------------------------------------------------------------------
  //------------------------------------------------------------------------------
  ngOnChanges() {
    this.GetUsersTable(this.ID);
    console.log('ngOnChanges users');
  }
  //------------------------------------------------------------------------------
  ngAfterViewInit() {

  }
  //---------------------------------------------------------------------------

}
