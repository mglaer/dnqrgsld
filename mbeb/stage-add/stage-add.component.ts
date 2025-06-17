import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { EntityChoosingComponent } from '../entity-choosing/entity-choosing.component';
import { Stand } from 'src/app/interfaces/stand';
import { EntityStructure } from 'src/app/interfaces/entity-structure';
import { StagesApiService } from 'src/app/services/stages-api.service';
import { StandsApiService } from 'src/app/services/stands.service';

interface EntityStructureTree {
  ID: number;
  ShortTitle: string;
  children: EntityStructureTree[];
}

interface EntityStructureFlatNode {
  ID: number;
  expandable: boolean;
  ShortTitle: string;
  level: number;
}

@Component({
  selector: 'app-stage-add',
  templateUrl: './stage-add.component.html',
  styleUrls: ['./stage-add.component.css'],
})
export class StageAddComponent implements OnInit {
  form: any;
  is_new: boolean = false;
  start: Date = new Date();
  end: Date = new Date();
  short_title: string = '';

  choosed_entity_structure: EntityStructureTree = {
    ID: -1,
    ShortTitle: '',
    children: [],
  };
  choosed_entity: Stand = { ID: -1, ShortTitle: '' };
  stands: Stand[] = [];

  entity_structures: EntityStructure[] = [];

  stage_id = -1;

  stages_gant: any[] = [];
  project_id: number;

  hasChild = (_: number, node: EntityStructureFlatNode) => node.expandable;

  private _transformer = (node: EntityStructureTree, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      ShortTitle: node.ShortTitle,
      level: level,
      ID: node.ID,
    };
  };

  treeControl = new FlatTreeControl<EntityStructureFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  loaded: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StageAddComponent>,
    private stages_api: StagesApiService,
    private stands_api: StandsApiService,

    private dialog: MatDialog,

    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.is_new = data.is_new;
    this.stages_api.getEntityStructures().subscribe((res) => {
      this.dataSource.data = this.transformToTree(res);

      if (data.EntityStructureTitle) {
        const flatten: any = (array: EntityStructureTree[]) =>
          array.flatMap(({ ID, ShortTitle, children }) => [
            { ID, ShortTitle },
            ...flatten(children || []),
          ]);

        this.choosed_entity_structure = flatten(this.dataSource.data).filter(
          (es: EntityStructureTree) =>
            es.ShortTitle === data.EntityStructureTitle
        )[0];

        this.stands_api
          .getStands(this.choosed_entity_structure.ID)
          .subscribe((res) => {
            this.stands = res;
            this.choosed_entity = res.filter(
              (e) => e.ShortTitle === data.EntityTitle
            )[0];

            let tmp = this.choosed_entity;
            this.select({
              ID: this.choosed_entity_structure.ID,
              expandable: false,
              ShortTitle: this.choosed_entity_structure.ShortTitle,
              level: 0,
            });
            this.choosed_entity = tmp;
            if (this.form !== undefined) {
              this.form.controls.entity.setValue(this.choosed_entity);
            }
          });
      }
    });
    this.project_id = data.project_id;
    this.short_title = data.ShortTitle || '';
    this.start = data.StartDate || new Date();
    this.end = data.EndDate || new Date();
    this.stage_id = data.ID || -1; // if -1 then we need to create new
  }

  transformToTree(structs: EntityStructure[]): EntityStructureTree[] {
    const result: EntityStructureTree[] = [];

    structs.forEach((struct) => {
      if (!struct.Parent) {
        result.push({
          ID: struct.ID,
          ShortTitle: struct.ShortTitle,
          children: [],
        });
      } else {
        const parentStruct = this.findParentStruct(struct.Parent, result);
        if (parentStruct) {
          if (!parentStruct.children) parentStruct.children = [];
          parentStruct.children.push({
            ID: struct.ID,
            ShortTitle: struct.ShortTitle,
            children: [],
          });
        }
      }
    });

    return result;
  }

  findParentStruct(
    parentId: number,
    structs: EntityStructureTree[]
  ): EntityStructureTree | null {
    for (let i = 0; i < structs.length; i++) {
      const struct = structs[i];
      if (struct.ID == parentId) {
        return struct;
      } else if (struct.children) {
        const result = this.findParentStruct(parentId, struct.children);
        if (result) return result;
      }
    }
    return null;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      entity: [this.choosed_entity, []],
      entity_structure: [this.choosed_entity_structure, []],
      start: [this.start, []],
      end: [this.end, []],
      short_title: [this.short_title, []],
    });
  }

  save() {
    if (this.is_new) {
      this.stages_api
        .create(
          this.form.get('short_title').value,
          this.project_id,
          this.form.get('start').value,
          this.form.get('end').value,
          this.form.get('entity').value.ID,
          this.form.get('entity_structure').value.ID
        )
        ?.subscribe((res) => {});
    } else {
      this.stages_api
        .patch(
          this.form.get('short_title').value,
          this.project_id,
          this.form.get('start').value,
          this.form.get('end').value,
          this.form.get('entity').value.ID,
          this.form.get('entity_structure').value.ID,
          this.stage_id
        )
        ?.subscribe((res) => {});
    }
    this.dialogRef.close(this.form?.value);
  }
  close() {
    this.dialogRef.close();
  }

  select(node: EntityStructureFlatNode) {
    this.choosed_entity = { ID: -1, ShortTitle: '' };
    this.loaded = false;
    this.choosed_entity_structure = {
      ID: node.ID,
      ShortTitle: node.ShortTitle,
      children: [],
    };

    this.form.controls.entity_structure.setValue(this.choosed_entity_structure);

    this.treeControl.collapseAll();

    this.stands_api
      .getStands(this.choosed_entity_structure.ID)
      .subscribe((res) => {
        this.stands = res;
      });

    this.stands_api
      .gant(node.ID, this.form.get('start').value, this.form.get('end').value)
      .subscribe((res) => {
        this.stages_gant = res.map((data) => {
          console.log(data);
          //data.StartDate = new Date(data.StartDate);
          //data.EndDate = new Date(data.EndDate);
          return {
            name: data.Entities,
            start: new Date(data.StartDate).getTime(),
            end: new Date(data.EndDate).getTime(),
            ID: data.Entities_ID,
          };
        });
        this.loaded = true;
      });
  }

  openChooseEntity() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      entity_structure: this.form.get('entity_structure').value,
      entity: this.form.get('entity').value,
      start: this.form.get('start').value,
      end: this.form.get('end').value,
      stages_gant: this.stages_gant,
    };

    const dialogRef = this.dialog.open(EntityChoosingComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        console.log(data.ID);
        console.log(this.stages_gant);

        let choosed = this.stages_gant.filter((s) => s.ID === data.ID)[0];
        this.choosed_entity = { ID: choosed.ID, ShortTitle: choosed.name };

        this.form.controls.entity.value = this.choosed_entity;
      }
    });
  }
}
