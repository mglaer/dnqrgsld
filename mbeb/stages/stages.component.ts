import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Stage } from 'src/app/interfaces/stage';
import { StageAddComponent } from '../stage-add/stage-add.component';
import { StagesApiService } from 'src/app/services/stages-api.service';

@Component({
  selector: 'stages',
  templateUrl: './stages.component.html',
  styleUrls: ['./stages.component.css'],
})
export class StagesComponent implements OnInit {
  delete(element: Stage) {
    if (confirm('Вы уверены, что хотите удалить этап?')) {
      this.stagesapi.delete(element.ID).subscribe((data) => {
        this.stagesapi.getStages(this.project_id).subscribe((res) => {
          this.stages = res;
        });
      });
    }
  }

  @Input() project_id: number = 0;
  stages: Stage[] = [];
  columns: string[] = [
    'ID',
    'ShortTitle',
    'StartDate',
    'EndDate',
    'EntityStructure',
    'Entities',
    'Edit',
    'Delete',
  ];

  form: any;

  start: Date = new Date();
  end: Date = new Date();
  short_title: string = '';

  constructor(private stagesapi: StagesApiService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.stagesapi.getStages(this.project_id).subscribe((res) => {
      this.stages = res;
    });
  }

  openStageAddDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = { is_new: true, project_id: this.project_id };

    const dialogRef = this.dialog.open(StageAddComponent, dialogConfig);
    dialogRef.updateSize('60%', '100%');

    dialogRef.afterClosed().subscribe((data) => {
      this.stagesapi.getStages(this.project_id).subscribe((res) => {
        this.stages = res;
      });
    });
  }

  openSatgeEditDialog(stage: Stage) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      is_new: false,
      project_id: this.project_id,
      ID: stage.ID,
      ShortTitle: stage.ShortTitle,
      StartDate: stage.StartDate,
      EndDate: stage.EndDate,
      EntityTitle: stage.Entities,
      EntityStructureTitle: stage.EntityStructure,
    };

    const dialogRef = this.dialog.open(StageAddComponent, dialogConfig);
    dialogRef.updateSize('60%', '100%');

    dialogRef.afterClosed().subscribe((data) => {
      this.stagesapi.getStages(this.project_id).subscribe((res) => {
        this.stages = res;
      });
    });
  }
}
