import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router, RouteReuseStrategy } from '@angular/router';
import { VGroupsAndUsersStructureTree } from '../../../model/structures';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { faL, faSheetPlastic } from '@fortawesome/free-solid-svg-icons';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MasterService } from 'src/app/services/master.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { VEntityStructure } from '../../../model/structures';
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
  faBoxesStacked,
  faGem,
  faJetFighter,
  faFile
} from '@fortawesome/free-solid-svg-icons';
import { MatAccordion } from '@angular/material/expansion';
import { EditOntologyComponent } from '../modal/edit-ontology/edit-ontology.component';
import { CreateOntologyComponent } from '../modal/create-structure/create-structure.component';
import { cnst } from 'src/app/model/cnst';

@Component({
  selector: 'app-ontology-list',
  templateUrl: './ontology-list.component.html',
  styleUrls: ['./ontology-list.component.css']
})
export class OntologyListComponent implements OnInit {
  public ENTITY_VIEW_MODES = [
    {
      idx: '0',
      TypeElement: 'Entity',
      ShortTitle: 'Сущность'
    },
    {
      idx: '1',
      TypeElement: 'Template',
      ShortTitle: 'Шаблон'
    }
  ];
  public faUser = faUser;
  public faLayerGroup = faLayerGroup;
  public faShieldHalved = faShieldHalved;
  public faPen = faPen;
  public faEnvelope = faEnvelope;
  public faPhone = faPhone;
  public faShield = faShield;
  public faBoxArchive = faBoxArchive;
  public faBoxesStacked = faBoxesStacked;
  public faGem = faGem;
  public faJetFighter = faJetFighter;
  public faFile = faFile;
  @ViewChild(MatAccordion) accordion?: MatAccordion;
  @Input() parent_data: any;
  @Output() UpdateEvent = new EventEmitter<string>();
  public ontology_list: VEntityStructure[] = [];
  public show_archieved: boolean = false;
  //
  public view_modes: any = this.ENTITY_VIEW_MODES;
  public selected_view_mode: any;
  public selected_view_mode_idx: number = 0;
  selectedValue: string = ''
  //
  constructor(
    private service: MasterService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private router: Router,
    private storageService: AuthenticationService,
  ) {

    this.selected_view_mode_idx = this.storageService.GetViewMode();
    //this.selected_view_mode = this.view_modes[0];
    this.selected_view_mode = this.view_modes[this.selected_view_mode_idx];
    //
    //let _str: string = 'WITH RECURSIVE ClassifiersStructure (\"ID\", \"ShortTitle\", \"Parent\", \"ParentID\") AS (SELECT VC.\"ID\", VC.\"ShortTitle\", NULL, VC.\"Parent\" FROM \"Ontologies\".\"VClassifiers\" AS CP, \"Ontologies\".\"VClassifiers\" AS VC WHERE CP.\"ID\" = VC.\"Parent\" UNION ALL SELECT CP.\"ID\", CP.\"ShortTitle\", VC.\"ShortTitle\", VC.\"Parent\" FROM ClassifiersStructure AS CP, \"Ontologies\".\"VClassifiers\" AS VC WHERE VC.\"ID\" = CP.\"ParentID\") SELECT \'{\"label\" : \"\' || ClassifiersStructure.\"ShortTitle\" || \'\", \"value\" : \"\' || ClassifiersStructure.\"ID\" || \'\", \"group\" : \"\' || ClassifiersStructure.\"Parent\" || \'\"}\' FROM ClassifiersStructure WHERE ClassifiersStructure.\"ParentID\" = \'14\' AND ClassifiersStructure.\"Parent\" IS NOT NULL';
    //console.log(JSON.stringify(_str));
    //
  }
  //---------------------------------------------------------------------
  ngOnInit(): void {

  }
  //---------------------------------------------------------------------
  FunctionCreateStructure() {
    var entity = <VEntityStructure>{};
    ///need to fill all fields!!!
    entity.ID = 0;//not used, auto
    entity.ShortTitle = '';
    entity.Description = '';
    entity.SecurityLevel = '';
    //user.ArchiveSign=false;
    if (this.parent_data != undefined) {
      entity.Parent = this.parent_data.ID;
    }
    else {
      entity.Parent = null;
    }
    //user.SecurityID=0;//no used, auto
    const dialogRef = this.dialog.open(CreateOntologyComponent, {
      width: '450px',
      data: entity,
    });
    //------------------------------------------------------------------------------
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {
        this.service.CreateOntology(result, "Structure").subscribe((result: any) => {
          if (result.res == 'success') {
            this._snackBar.open('Сущность успешно добавлена', '', {
              duration: 1000,
              panelClass: ['blue-snackbar']
            });
            if (this.parent_data === undefined) {
              this.UpdateEvent.next('Y');
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
  FunctionCreateEntity() {
    console.log('FunctionCreateTemplate');
    //this.router.navigate(['home/create-entity-master', { parent_id: this.parent_data.ID }]);
    //
    const link = this.router.serializeUrl(this.router.createUrlTree(['home/create-entity-master', { parent_id: this.parent_data.ID }]));
    this.storageService.SetRouterUrl('home/create-entity-master', JSON.stringify({ parent_id: this.parent_data.ID }));
    window.open(link, '_blank');
  }
  //------------------------------------------------------------------------------
  FunctionCreateTemplate() {
    console.log('FunctionCreateTemplate');
    //this.router.navigate(['home/create-template', { ID: this.parent_data.ID }]);
    //
    const link = this.router.serializeUrl(this.router.createUrlTree(['home/create-template', { ID: this.parent_data.ID }]));
    this.storageService.SetRouterUrl('home/create-template', JSON.stringify({ ID: this.parent_data.ID }));
    window.open(link, '_blank');
  }
  //------------------------------------------------------------------------------
  FunctionEdit(_entity: any) {
    if (_entity.TypeElement === 'Template') {
      //this.router.navigate(['home/edit-template', { ID: _entity.ID }]);
      //
      const link = this.router.serializeUrl(this.router.createUrlTree(['home/edit-template', { ID: _entity.ID }]));
      this.storageService.SetRouterUrl('home/edit-template', JSON.stringify({ ID: _entity.ID }));
      window.open(link, '_blank');
    }
    else if (_entity.TypeElement === 'Entity') {
      //this.router.navigate(['home/edit-entity', { ID: _entity.ID }]);
      //
      const link = this.router.serializeUrl(this.router.createUrlTree(['home/edit-entity', { ID: _entity.ID }]));
      this.storageService.SetRouterUrl('home/edit-entity', JSON.stringify({ ID: _entity.ID }));
      window.open(link, '_blank');
    }
    else if (_entity.TypeElement === 'Structure') {
      const dialogRef = this.dialog.open(EditOntologyComponent, {
        width: '450px',
        data: _entity,
      });
      //------------------------------------------------------------------------------
      dialogRef.afterClosed().subscribe(result => {
        if (result != '') {
          this.service.UpdateOntologyEntity(result, result.Type).subscribe((result: any) => {
            if (result.res == 'success') {
              this._snackBar.open('Структура успешно обновлена', '', {
                duration: 1000,
                panelClass: ['blue-snackbar']
              });
              this.GetEntityStructure(this.parent_data.ID, false);
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
  //-----------------------------------------------------------------------------
  FunctionChangeActive(_entity: any) {
    this.service.ActivationOntology(_entity).subscribe((result: any) => {
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
  //---------------------------------------------------------------------
  public GetEntityStructure(_parent: any, _all_data: any) {//    
    this.service.VEntityStructure_get_items_by_parent_id(_parent, _all_data, true).subscribe((result: any) => {
      if (result.data != null) {
        this.storageService.saveToken(result.jwt);
        if (this.show_archieved) {
          this.ontology_list = [];
          this.ontology_list = result.data;
        }
        else {
          this.ontology_list = result.data.filter((word: any) => word.ArchiveSign === false);
        }
        if (this.selected_view_mode.TypeElement == 'Entity') {
          this.ontology_list = this.ontology_list.filter((word: any) => (word.TypeElement === 'Entity') || (word.TypeElement === 'Structure'));
          //this.ontology_list = this.ontology_list.filter((word: any) => (word.TypeElement === 'Entity') );
        }
        else if (this.selected_view_mode.TypeElement == 'Template') {
          this.ontology_list = this.ontology_list.filter((word: any) => (word.TypeElement === 'Template') || (word.TypeElement === 'Structure'));
          //this.ontology_list = this.ontology_list.filter((word: any) => (word.TypeElement === 'Template') );
        }
      }
      else {
        this.router.navigate(['login']);
      }
    });
  }
  //---------------------------------------------------------------------------
  ngOnChanges() {
    if (this.parent_data != undefined) {
      this.GetEntityStructure(this.parent_data.ID, false);
    }
  }
  //---------------------------------------------------------------------------

  //---------------------------------------------------------------------------
  public change_view_mode(_item: any) {
    this.selected_view_mode_idx = _item.value.idx;
    this.storageService.setViewMode(this.selected_view_mode_idx);

    this.GetAll();
  }
  //---------------------------------------------------------------------------
  GetAll() {
    console.log(this.selected_view_mode.ShortTitle);
    if (this.parent_data != undefined) {
      this.GetEntityStructure(this.parent_data.ID, false);
    }
  }
  //---------------------------------------------------------------------------
}
