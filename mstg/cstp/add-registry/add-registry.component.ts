import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';//MatTree
import { faL, faSheetPlastic } from '@fortawesome/free-solid-svg-icons';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MasterService } from 'src/app/services/master.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { OntologyFlatNode, TechnologyPassport, VPassportCSTP, VTechnologyPassport } from '../../../../model/structures';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Sort, MatSort } from '@angular/material/sort';
import { VEntityStructureTree } from '../../../../model/structures';
import {
  faShieldHalved,
  faPen,
  faEnvelope,
  faPhone,
  faShield,
  faBoxArchive,
  faUser,
  faLayerGroup,
  faGem,
  faTrash,
  faCheck
} from '@fortawesome/free-solid-svg-icons';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-add-registry',
  templateUrl: './add-registry.component.html',
  styleUrls: ['./add-registry.component.css']
})
export class AddRegistryComponent implements OnInit {

  public faUser = faUser;
  public faLayerGroup = faLayerGroup;
  public faShieldHalved = faShieldHalved;
  public faPen = faPen;
  public faEnvelope = faEnvelope;
  public faPhone = faPhone;
  public faShield = faShield;
  public faBoxArchive = faBoxArchive;
  public faGem = faGem;
  public faTrash = faTrash;
  public faCheck = faCheck;
  //
  public struct_group: any;
  @Input() parent_id: number = 0;
  @ViewChild('tree') treeSelectorOntologyRoot: any;
  //@ViewChild(OntologyListComponent) child!: OntologyListComponent;

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
  //---------------------
  displayedColumns: string[] = ['Checked', 'ID', 'ShortTitle', 'SecurityLevel', 'ArchiveSign'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  registry_list: any;
  selected_row: any;
  selected_registry_array: VTechnologyPassport[] = [];
  public show_archieved: boolean = false;
  public parent_passport_id!:number;
  //----------------------------------------------------------------------------
  constructor(
    private service: MasterService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private storageService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (params['parent_passport_id'] != undefined) {//если прислали список для добавления в реестр, нужно активировать последний таб и в цикле добавить        
        this.parent_passport_id = params['parent_passport_id'];        
      }
    });
    this.GetEntityStructureRoot(false);
  }
  //-----------------------------------------------------------

  //---------------------------------------------------------------------------
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
  //---------------------------------------------------------------------------
  public UpdateRoot(_event: any) {
    console.log(_event);
    this.GetEntityStructureRoot(false);
  }
  //------------------------------------------------------------------------------
  GetEntityStructureRoot(_entity_all_types: boolean) {//    
    this.service.VTechnologyPassport_get_items_by_parent_id(this.parent_id, false, _entity_all_types).subscribe((result: any) => {
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
    this.service.VTechnologyPassport_get_items_by_parent_id(_parent_id, false, false).subscribe((result: any) => {
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
    if (this.node_data != undefined) {
      this.GetRegistryTable();
    }
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
    //this.GetEntityStructureRoot(false);
    console.log('ngOnChanges groups');
  }
  //---------------------------------------------------------------------------
  hasChildRoot = (_: number, node: OntologyFlatNode) => node.expandable;
  //---------------------------------------------------------------------------
  //---------------------------------------------------------------------------
  //---------------------------------------------------------------------------
  /*AddItemToList(_item: VTechnologyPassport) {
    if (_item != undefined) {
      let _found = this.selected_registry_array.filter((word: any) => word.ID === _item.ID);
      if (_found.length == 0) {
        this.selected_registry_array.push(_item);
      }
      else {
        console.log('item already present');
      }
    }
  }*/
  //---------------------------------------------------------------------------
  RemoveItemFromList(_item: VTechnologyPassport) {
    if (_item != undefined) {
      let _found = this.selected_registry_array.filter((word: any) => word.ID != _item.ID);
      this.selected_registry_array = structuredClone(_found);
    }
    this.GetRegistryTable();
  }
  //---------------------------------------------------------------------------
  FunctionChecked(_event: any, _item: any) {
    console.log(_item);
    if (_item != undefined) {
      if (_event.checked) {
        let _found = this.selected_registry_array.filter((word: any) => word.ID === _item.ID);
        if (_found.length == 0) {
          this.selected_registry_array.push(_item);
        }
      }
      else {
        let _found = this.selected_registry_array.filter((word: any) => word.ID != _item.ID);
        this.selected_registry_array = structuredClone(_found);
      }
    }
  }
  //------------------------------------------------------------------------------


  //------------------------------------------------------------------------------
  Filterchange(event: Event) {
    const filvalue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filvalue;
  }
  //------------------------------------------------------------------------------
  getrow(row: any) {
    this.selected_row = row;
    //console.log(row);
  }
  //--------------------------------------------------------------
  GetRegistryTable() {
    this.service.VTechnologyPassport_get_items_by_parent_id(this.node_data.ID, false, true).subscribe((result: any) => {
      if (result.data != null) {
        this.storageService.saveToken(result.jwt);
        if (this.show_archieved) {
          this.registry_list = [];
          this.registry_list = result.data;
        }
        else {
          this.registry_list = result.data.filter((word: any) => word.ArchiveSign === false);
        }
        this.registry_list = this.registry_list.filter((word: any) => (word.TypeElement === 'TechnologyPassport'));
        //
        this.dataSource = new MatTableDataSource<VTechnologyPassport>(this.registry_list);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      /*else {
        this.router.navigate(['login']);
      }*/
    });
  }

  //----------------------------------------------
  AddPassports() {
    let id_array:number[]=[];
    for(let i=0;i<this.selected_registry_array.length;i++)
    {
      id_array.push(this.selected_registry_array[i].ID);
    }
    this.router.navigate(['home/cstp-edit-passport', { id: this.parent_passport_id, passport_list: JSON.stringify(id_array) }]);
  }










}
