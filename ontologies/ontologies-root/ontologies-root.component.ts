import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';//MatTree
import { faL, faSheetPlastic } from '@fortawesome/free-solid-svg-icons';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MasterService } from 'src/app/services/master.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { OntologyFlatNode } from '../../../model/structures';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Sort, MatSort } from '@angular/material/sort';
import { VEntityStructureTree } from '../../../model/structures';
import {
  faShieldHalved,
  faPen,
  faEnvelope,
  faPhone,
  faShield,
  faBoxArchive,
  faUser,
  faLayerGroup,
  faGem
} from '@fortawesome/free-solid-svg-icons';
import { OntologyListComponent } from '../ontology-list/ontology-list.component';

@Component({
  selector: 'app-ontologies-root',
  templateUrl: './ontologies-root.component.html',
  styleUrls: ['./ontologies-root.component.css']
})
export class OntologiesRootComponent implements OnInit {
  public faUser = faUser;
  public faLayerGroup = faLayerGroup;
  public faShieldHalved = faShieldHalved;
  public faPen = faPen;
  public faEnvelope = faEnvelope;
  public faPhone = faPhone;
  public faShield = faShield;
  public faBoxArchive = faBoxArchive;
  public faGem = faGem;
  //
  public struct_group: any;
  @Input() parent_id: number = 0;
  @ViewChild('tree') treeSelectorOntologyRoot: any;
  @ViewChild(OntologyListComponent) child!: OntologyListComponent;

  public custom_table: number = 0;
  public node_data: any;

  selected_row_root: any = '';
  public down_page_mode = '';
  public custom_struct_root: number = 0;
  private _transformer = (node: VEntityStructureTree, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      //expandable: true,
      name: node.name,
      level: level,
      TypeElement: node.TypeElement,
      ID: node.ID,
    };
  };
  treeControlRoot = new FlatTreeControl<OntologyFlatNode>(
    node => node.level,
    node => node.expandable,
  );
  treeFlattenerRoot = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  public tree_ontology_root: VEntityStructureTree[] = [];
  dataSourceRoot = new MatTreeFlatDataSource(this.treeControlRoot, this.treeFlattenerRoot);
  //----------------------------------------------------------------------------
  constructor(
    private service: MasterService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private router: Router,
    private storageService: AuthenticationService
  ) { }

  //---------------------------------------------------------------------------
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  ngOnInit(): void {
    this.GetEntityStructureRoot(false);
  }
  //---------------------------------------------------------------------------
  public UpdateRoot(_event: any) {
    console.log(_event);
    this.GetEntityStructureRoot(false);
  }
  //------------------------------------------------------------------------------
  GetEntityStructureRoot(_entity_all_types: boolean) {//    
    this.service.VEntityStructure_get_items_by_parent_id(this.parent_id, false, _entity_all_types).subscribe((result: any) => {
      if (result.data != null) {
        this.storageService.saveToken(result.jwt);
        //this.struct_group = result;
        this.tree_ontology_root = [];
        let data = new Map();
        let tree = [];
        for (const node of result.data) {
          if (node.ArchiveSign === false) {
            //
            let _node: VEntityStructureTree = { ID: 0, name: '', children: [] };
            _node.ID = node.ID;
            _node.name = node.ShortTitle;
            _node.TypeElement = node.TypeElement;
            _node.children = [];
            data.set(node.ID, _node);
            //
          }
        }

        for (const node of result.data) {
          tree.push(data.get(node.ID));
          //  data.get(node.Parent).children.push(data.get(node.ID));
        }
        this.tree_ontology_root = tree;
        this.dataSourceRoot.data = this.tree_ontology_root;//tree;
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
  GetGroupByParentIDRoot(_parent_id: any) {//
    this.service.VEntityStructure_get_items_by_parent_id(_parent_id, false, false).subscribe((result: any) => {
      if (result.data != null) {
        this.storageService.saveToken(result.jwt);
        let data = new Map();
        let tree = [];

        for (const node of result.data) {
          if (node.ArchiveSign === false) {
            //
            let _node: VEntityStructureTree = { ID: 0, name: '', children: [] };
            _node.ID = node.ID;
            _node.name = node.ShortTitle;
            _node.TypeElement = node.TypeElement;
            _node.children = [];
            data.set(node.ID, _node);
            //
          }
        }
        //---
        this.tree_ontology_root.map((top_item: any) => {
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
        this.dataSourceRoot.data = [];
        this.dataSourceRoot.data = this.tree_ontology_root;//tree;
        this.treeControlRoot.expandAll();
      }
      else {
        this.router.navigate(['login']);
      }
    });
  }
  //---------------------------------------------------------------------------
  public click_up_tree_root(_item: VEntityStructureTree) {
    //console.log(JSON.stringify(_item));
    this.selected_row_root = _item;
    this.GetGroupByParentIDRoot(_item.ID);
    this.custom_struct_root = _item.ID;
    this.down_page_mode = 'Structure';
    this.parent_id = _item.ID;
    this.custom_table = _item.ID;
    this.node_data = _item;
    this.child.GetEntityStructure(_item.ID, false);
  }
  //---------------------------------------------------------------------------
  click_up_node_root(_item: VEntityStructureTree) {
    //console.log('click node ' + JSON.stringify(_item));
    this.parent_id = _item.ID;
    this.custom_table = _item.ID;
    this.node_data = _item;
  }
  //---------------------------------------------------------------------------
  ngOnChanges() {
    this.GetEntityStructureRoot(false);
    console.log('ngOnChanges groups');
  }
  //---------------------------------------------------------------------------
  hasChildRoot = (_: number, node: OntologyFlatNode) => node.expandable;
  //---------------------------------------------------------------------------
}
