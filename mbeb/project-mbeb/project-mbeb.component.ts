import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

import { MatTableDataSource } from '@angular/material/table';
import { Project } from 'src/app/interfaces/project';
import { ProjectAddDialogComponent } from '../project-add-dialog/project-add-dialog.component';
import { ProjectEditDialogComponent } from '../project-edit-dialog/project-edit-dialog.component';
import { ProjectsapiService } from 'src/app/services/projectsapi.service';

@Component({
  selector: 'app-project-mbed',
  templateUrl: './project-mbeb.component.html',
  styleUrls: ['./project-mbeb.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class ProjectMbebComponent implements OnInit {
  public displayedColumns = [
    'ID',
    'ShortTitle',
    'SecurityLevel',
    'ArchiveSign',
    'Edit',
  ];
  public dataSource = new MatTableDataSource<Project>();
  public expandedElement: Project | null = null;

  //? DI
  constructor(
    private projectsApiService: ProjectsapiService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getProjectsInformation();
  }

  getProjectsInformation() {
    this.projectsApiService.getProjects().subscribe((res) => {
      this.dataSource.data = res.sort((a, b) => a.ID - b.ID);
    });
  }

  date() {
    let d = new Date();
    return d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear();
  }

  openEditProjectDialog(project: Project) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      project: project,
    };

    const dialogRef = this.dialog.open(
      ProjectEditDialogComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((data) => {
      this.getProjectsInformation();
    });
  }

  openAddProjectDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {};

    const dialogRef = this.dialog.open(ProjectAddDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((data) => {
      this.getProjectsInformation();
    });
  }

  archivate(event: any, project: Project) {
    this.projectsApiService
      .reverse_archive_sign(project)
      .subscribe((res) => {});
  }
}
