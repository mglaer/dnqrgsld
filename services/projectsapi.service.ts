import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../interfaces/project';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectsapiService {
  reverse_archive_sign(project: Project) {
    return this.httpClient.patch(
      environment.servers[environment.srv_mode].host + '/projects/reverse_archivation',
      {
        ID: project.ID,
      }
    );
  }

  update(ID: number, value: any) {
    let short_title: string = value['short_title'];
    let description = value['description'];
    let start_date = value['start'];
    let end_date = value['end'];
    let security_level = value['security_level'];
    let customer = value['customer'];
    let executor = value['executor'];
    if (
      short_title.length > 0 &&
      description.length > 0 &&
      start_date &&
      end_date &&
      security_level &&
      customer.length > 0 &&
      executor.length > 0
    ) {
      return this.httpClient.patch(environment.servers[environment.srv_mode].host + '/projects', {
        ID: ID,
        ShortTitle: short_title,
        Description: description,
        StartDate: start_date,
        EndDate: end_date,
        SecurityLevelID: security_level['ID'],
        Customer: customer,
        Executor: executor,
      });
    }
    return;
  }
  save(value: any) {
    let short_title: string = value['short_title'];
    let description = value['description'];
    let start_date = value['start'];
    let end_date = value['end'];
    let security_level = value['security_level'];
    let customer = value['customer'];
    let executor = value['executor'];
    if (
      short_title.length > 0 &&
      description.length > 0 &&
      start_date &&
      end_date &&
      security_level &&
      customer.length > 0 &&
      executor.length > 0
    ) {
      return this.httpClient.post(environment.servers[environment.srv_mode].host + '/projects', {
        ShortTitle: short_title,
        Description: description,
        StartDate: start_date,
        EndDate: end_date,
        SecurityLevelID: security_level['ID'],
        Customer: customer,
        Executor: executor,
      });
    }
    return;
  }

  constructor(private httpClient: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.httpClient.get<Project[]>(environment.servers[environment.srv_mode].host + '/projects');
  }
}
