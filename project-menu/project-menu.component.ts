import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { Project } from '../project.model';

@Component({
  selector: 'app-project-menu',
  templateUrl: './project-menu.component.html',
  styleUrls: ['./project-menu.component.css']
})
export class ProjectsMenuComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  showArchived: boolean = false;
  showEditForm: boolean = false;
  selectedProject: Project | null = null;

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe((projects) => {
      this.projects = projects;
      this.filterProjects();
    });
  }

  filterProjects() {
    if (this.showArchived) {
      this.filteredProjects = this.projects.filter(p => p.archived === true);
    } else {
      this.filteredProjects = this.projects.filter(p => !p.archived);
    }
  }

  onShowArchivedChange() {
    this.filterProjects();
  }

  openCreateEditForm() {
    this.selectedProject = null;
    this.showEditForm = true;
  }

  editProject(project: Project) {
    this.selectedProject = { ...project };
    this.showEditForm = true;
  }

  onArchiveChange(project: Project) {
    // При изменении архивного статуса отправляем обновление на сервер
    this.projectService.updateProject(project).subscribe();
  }

  onCloseForm(updatedProject: Project | null) {
    // Форма закрылась, если есть обновлённый проект – обновляем список
    this.showEditForm = false;
    if (updatedProject) {
      // Обновляем или добавляем проект в список
      const idx = this.projects.findIndex(p => p.id === updatedProject.id);
      if (idx > -1) {
        this.projects[idx] = updatedProject;
      } else {
        this.projects.push(updatedProject);
      }
      this.filterProjects();
    }
  }
}
