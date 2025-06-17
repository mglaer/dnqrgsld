import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { VGroupsAndUsersStructure, VGroupsAndUsersStructureTree } from '../../../model/structures';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { faSheetPlastic } from '@fortawesome/free-solid-svg-icons';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MasterService } from 'src/app/services/master.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { ExampleFlatNode } from '../../../model/structures';
import { GroupsComponent } from '../groups/groups.component';


@Component({
  selector: 'app-administration-root',
  templateUrl: './administration-root.component.html',
  styleUrls: ['./administration-root.component.css']
})
export class AdministrationRootComponent implements OnInit {
  @ViewChild(GroupsComponent) child!: GroupsComponent;

  public struct_data: any;
  public custom_table: number = 0;
  public table_up: any[] = [];
  public table_down: any[] = [];

  public page_mode: string = '';
  public selected_row: any = {};

  private _transformer = (node: VGroupsAndUsersStructureTree, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      TypeEntity: node.TypeEntity,
      ID: node.ID,
    };
  };


  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  public TREE_DATA: VGroupsAndUsersStructureTree[] = [];
  constructor(
    private service: MasterService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private router: Router,
    private storageService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.GetVGroupsAndUsersStructure();
  }
  //------------------------------------------------------------------------------
  GetVGroupsAndUsersStructure() {
    this.service.GetGroupsAndUsers().subscribe((result: any) => {
      if (result.data != null) {
        this.storageService.saveToken(result.jwt);
        this.struct_data = result.data;
        this.TREE_DATA = [];

        let data = new Map();
        let tree = [];

        for (const node of this.struct_data) {
          let _node: VGroupsAndUsersStructureTree = { ID: 0, name: '', children: [] };
          _node.ID = node.ID;
          _node.name = node.ShortTitle;
          _node.TypeEntity = node.TypeEntity;
          _node.children = [];
          data.set(node.ID, _node);
        }

        for (const node of this.struct_data) {
          if (node.Parent === null) {
            tree.push(data.get(node.ID));
          }
          else {
            data.get(node.Parent).children.push(data.get(node.ID));
          }
        }
        this.TREE_DATA = tree;
        this.dataSource.data = this.TREE_DATA;
      }
      else {
        this.router.navigate(['login']);
      }
    });
  }
  //---------------------------------------------------------------------------
  click_tree(_item: VGroupsAndUsersStructureTree) {
    //console.log(JSON.stringify(_item));
    if (_item.TypeEntity != undefined) {
      this.page_mode = _item.TypeEntity;
      this.custom_table = _item.ID;
      this.selected_row = _item;      
    }
  }
    //---------------------------------------------------------------------------
    public UpdateRoot(_event:any) 
    {
      console.log('UpdateRoot: '+_event);
      this.GetVGroupsAndUsersStructure();
    }
  //---------------------------------------------------------------------------
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

}
