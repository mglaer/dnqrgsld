import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SecurityLevel } from 'src/app/interfaces/security-level';
import { ProjectsapiService } from 'src/app/services/projectsapi.service';
import { SecurityLevelsApiService } from 'src/app/services/security-levels-api.service';

@Component({
  selector: 'app-project-add-dialog',
  templateUrl: './project-add-dialog.component.html',
  styleUrls: ['./project-add-dialog.component.css'],
})
export class ProjectAddDialogComponent implements OnInit {
  form: any;
  description: string;
  start: Date = new Date();
  end: Date = new Date();
  executor: string = '';
  customer: string = '';
  security_levels: SecurityLevel[] = [];
  short_title: string = '';
  security_level: SecurityLevel = { ID: -1, ShortTitle: '' };

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProjectAddDialogComponent>,
    private security_levels_api: SecurityLevelsApiService,
    private projects_api: ProjectsapiService,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.description = data.description;
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
    });
    this.dialogRef.updateSize('80%', '100%');

  }

  save() {
    this.projects_api.save(this.form?.value)?.subscribe((res) => {});
    this.dialogRef.close(this.form?.value);
  }

  close() {
    this.dialogRef.close();
  }
}
