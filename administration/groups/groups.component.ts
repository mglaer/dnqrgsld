import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { VGroupsAndUsersStructureTree } from '../../../model/structures';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';//MatTree
import { faSheetPlastic } from '@fortawesome/free-solid-svg-icons';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MasterService } from 'src/app/services/master.service';
import { AuthenticationService } from '../../../services/authentication.service';
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
  faLayerGroup,

} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  public faUser = faUser;
  public faLayerGroup = faLayerGroup;
  public faShieldHalved = faShieldHalved;
  public faPen = faPen;
  public faEnvelope = faEnvelope;
  public faPhone = faPhone;
  public faShield = faShield;
  public faBoxArchive = faBoxArchive;
  //
  public struct_group: any;
  @Input() parent_id: number = 0;
  @ViewChild('tree') treeSelectorGroups: any;

  //group_data: any;
  selected_row: any = '';
  public down_page_mode = '';
  public custom_group: number = 0;
  public custom_user: number = 0;
  //
  private _transformer = (node: VGroupsAndUsersStructureTree, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      //expandable: true,
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
  public tree_groups: VGroupsAndUsersStructureTree[] = [];
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    private service: MasterService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private router: Router,
    private storageService: AuthenticationService,
  ) { }
  //------------------------------------------------------------------------------
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  ngOnInit(): void {
    //this.GetVGroupsRoot();
  }
  //------------------------------------------------------------------------------
  GetVGroupsRoot() {//    
    this.service.VGroupsAndUsersStructure_get_items_by_parent_id(this.parent_id).subscribe((result: any) => {
      if (result.data != null) {
        this.storageService.saveToken(result.jwt);
        //this.struct_group = result;
        this.tree_groups = [];
        let data = new Map();
        let tree = [];
        for (const node of result.data) {
          let _node: VGroupsAndUsersStructureTree = { ID: 0, name: '', children: [] };
          _node.ID = node.ID;
          _node.name = node.ShortTitle;
          _node.TypeEntity = node.TypeEntity;
          _node.children = [];
          data.set(node.ID, _node);
        }

        for (const node of result.data) {
          tree.push(data.get(node.ID));
          //  data.get(node.Parent).children.push(data.get(node.ID));
        }
        this.tree_groups = tree;
        this.dataSource.data = this.tree_groups;//tree;
      }
      else {
        this.router.navigate(['login']);
      }
    });
  }
  //---------------------------------------------------------------------------
  recursive_search_node(_node: any, _id: any, _new_nodes: any) {
    _node.children.map((element: any) => {
      if (element.ID == _id) {
        //element.children.push(_new_nodes);
        element.children = [];
        _new_nodes.forEach((item: any) => {
          element.children?.push(item);
          console.log('recursive loaded and pushed to ID=' + _id + ' item name=' + item.name);
        });
      }
      else {
        this.recursive_search_node(element, _id, _new_nodes);
      }
    });
  }
  //------------------------------------------------------------------------------
  GetGroupByParentID(_parent_id: any) {//
    this.service.VGroupsAndUsersStructure_get_items_by_parent_id(_parent_id).subscribe((result: any) => {
      if (result.data != null) {
        this.storageService.saveToken(result.jwt);
        let data = new Map();
        let tree = [];

        for (const node of result.data) {
          let _node: VGroupsAndUsersStructureTree = { ID: 0, name: '', children: [] };
          _node.ID = node.ID;
          _node.name = node.ShortTitle;
          _node.TypeEntity = node.TypeEntity;
          _node.children = [];
          data.set(node.ID, _node);
        }
        //---
        this.tree_groups.map((top_item: any) => {
          if (top_item.ID == _parent_id) {
            top_item.children = [];
            data.forEach(item => {
              top_item.children?.push(item);
              //console.log('top loaded and pushed to ID=' + _parent_id + ' item name=' + item.name);
            });
          }
          else {
            this.recursive_search_node(top_item, _parent_id, data);
          }
        });
        //---
        //this.tree_groups=tree;
        this.dataSource.data = [];
        this.dataSource.data = this.tree_groups;//tree;
        this.treeControl.expandAll();
      }
      else {
        this.router.navigate(['login']);
      }
    });
  }

  //---------------------------------------------------------------------------
  public click_up_tree(_item: VGroupsAndUsersStructureTree) {
    //console.log(JSON.stringify(_item));
    this.selected_row = _item;
    if (_item.TypeEntity == 'Groups') {
      this.GetGroupByParentID(_item.ID);
      this.custom_group = _item.ID;
      this.down_page_mode = 'Groups';
    }
    else if (_item.TypeEntity == 'Users') {
      this.custom_user = _item.ID;
      this.down_page_mode = 'Users';
    }
  }
  //---------------------------------------------------------------------------
  click_up_node(_item: VGroupsAndUsersStructureTree) {
    //console.log('click node ' + JSON.stringify(_item));
  }
  //---------------------------------------------------------------------------
  ngOnChanges() {
    this.GetVGroupsRoot();
    console.log('ngOnChanges groups');

  }

  //---------------------------------------------------------------------------
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  //---------------------------------------------------------------------------
}
