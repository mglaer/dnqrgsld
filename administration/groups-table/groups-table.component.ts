import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { VGroupsAndUsersStructureTree } from '../../../model/structures';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { faSheetPlastic } from '@fortawesome/free-solid-svg-icons';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MasterService } from 'src/app/services/master.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { ExampleFlatNode } from '../../../model/structures';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Sort, MatSort } from '@angular/material/sort';
import { VGroups } from '../../../model/structures';
import {
  faShieldHalved,
  faPen,
  faEnvelope,
  faPhone,
  faShield,
  faBoxArchive,
  faUser,
  faLayerGroup
} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-groups-table',
  templateUrl: './groups-table.component.html',
  styleUrls: ['./groups-table.component.css']
})
export class GroupsTableComponent implements OnInit {
  public faUser = faUser;
  public faLayerGroup = faLayerGroup;
  public faShieldHalved = faShieldHalved;
  public faPen = faPen;
  public faEnvelope = faEnvelope;
  public faPhone = faPhone;
  public faShield = faShield;
  public faBoxArchive = faBoxArchive;

  public struct_data: any;
  @Input() ID: number = 0;
  displayedColumns: string[] = ['ID', 'ShortTitle', 'Description', 'SecurityLevel', 'ArchiveSign'];
  dataSourceGroups: any;
  group_data: any;
  selected_group: any;

  //
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  constructor(
    private service: MasterService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private storageService: AuthenticationService,
    private router: Router,
  ) { }
  //------------------------------------------------------------------------------
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  ngOnInit(): void {
    this.GetGroupsTable(this.ID);
  }
  //------------------------------------------------------------------------------
  GetGroupsTable(_id: any) {
    this.service.VGroups_get_item_by_id(_id).subscribe((result: any) => {
      if (result.data != null) {
        this.storageService.saveToken(result.jwt);
        this.group_data = result.data;
        this.dataSourceGroups = new MatTableDataSource<VGroups>(this.group_data);
        this.dataSourceGroups.paginator = this.paginator;
        this.dataSourceGroups.sort = this.sort;
      }
      else {
        this.router.navigate(['login']);
      }

    });
  }
  //------------------------------------------------------------------------------
  Filterchange(event: Event) {
    const filvalue = (event.target as HTMLInputElement).value;
    this.dataSourceGroups.filter = filvalue;
  }
  //------------------------------------------------------------------------------
  getrow(row: any) {
    this.selected_group = row;
    //console.log(row);
  }
  //---------------------------------------------------------------------------
  public refresh() {
    console.log('refresh group');
    this.GetGroupsTable(this.ID);
  }
  //------------------------------------------------------------------------------
  ngOnChanges() {
    this.GetGroupsTable(this.ID);
    console.log('ngOnChanges users');
  }
}
