import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Project } from '../project.model';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-project-create-edit',
  templateUrl: './project-create-edit.component.html',
})
export class ProjectCreateEditComponent implements OnInit {
  @Input() project: Project | null = null;
  @Output() close = new EventEmitter<Project | null>();

  formData: Partial<Project> = {};

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    if (this.project) {
      this.formData = { ...this.project };
    } else {
      this.formData = { securityLevel: 'low' };
    }
  }

  onSubmit() {
    if (this.project && this.project.id) {
      // Редактирование
      const updatedProject: Project = {
        ...this.project,
        ...this.formData
      };
      this.projectService.updateProject(updatedProject).subscribe((res) => {
        this.close.emit(res);
      });
    } else {
      // Создание
      const newProject: Project = {
        id: 0, // или null, будет установлен на бэкенде
        shortName: this.formData.shortName || '',
        description: this.formData.description || '',
        securityLevel: this.formData.securityLevel || 'low',
        archived: false
      };
      this.projectService.createProject(newProject).subscribe((res) => {
        this.close.emit(res);
      });
    }
  }

  closeDialog() {
    this.close.emit(null);
  }
}
