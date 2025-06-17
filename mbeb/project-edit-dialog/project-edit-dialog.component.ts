import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ProjectsapiService } from 'src/app/services/projectsapi.service';
import { SecurityLevelsApiService } from 'src/app/services/security-levels-api.service';
import { Project } from 'src/app/interfaces/project';
import { SecurityLevel } from 'src/app/interfaces/security-level';

@Component({
  selector: 'app-project-edit-dialog',
  templateUrl: './project-edit-dialog.component.html',
  styleUrls: ['./project-edit-dialog.component.css'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class ProjectEditDialogComponent implements OnInit {
  form: any;
  project: Project;
  security_levels: SecurityLevel[] = [];
  description: string;
  start: Date = new Date();
  end: Date = new Date();
  executor: string = '';
  customer: string = '';
  short_title: string = '';
  selected_security_level_title: string;
  security_level: SecurityLevel = { ID: -1, ShortTitle: '' };

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProjectEditDialogComponent>,
    private security_levels_api: SecurityLevelsApiService,
    private projects_api: ProjectsapiService,

    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.project = data.project;

    this.description = this.project.Description;
    this.start = new Date(this.project.StartDate);
    this.end = new Date(this.project.EndDate);

    this.short_title = this.project.ShortTitle;
    this.executor = this.project.Executor;
    this.customer = this.project.Customer;
    this.selected_security_level_title = this.project.SecurityLevel;
  }

  ngOnInit() {
    this.form = this.fb.group({
      short_title: [this.short_title, []],
      description: [this.description, []],
      start: [this.start, []],
      end: [this.end, []],
      security_level: [this.security_level, []],
      customer: [this.customer, []],
      executor: [this.executor, []],
    });
    this.security_levels_api.getSecurityLevels().subscribe((res) => {
      this.security_levels = res;
      let tmp = this.security_levels.find(
        (x) => x.ShortTitle === this.selected_security_level_title
      );

      if (tmp !== undefined) {
        this.form.get('security_level').setValue(tmp);
      }
    });
    this.dialogRef.updateSize('80%', '100%');

  }

  save() {
    this.projects_api
      .update(this.project.ID, this.form?.value)
      ?.subscribe((res) => {});

    this.dialogRef.close(this.form?.value);
  }

  close() {
    this.dialogRef.close();
  }
}
