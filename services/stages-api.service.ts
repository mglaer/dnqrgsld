import { EntityStructure } from '../interfaces/entity-structure';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Stage } from '../interfaces/stage';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StagesApiService {
  patch(
    ShortTitle: string,
    ProjectId: number,
    StartDate: Date,
    EndDate: Date,
    EntityID: number,
    EntityStructureID: number,
    StageID: number | undefined
  ) {
    if (
      ShortTitle.length > 0 &&
      ProjectId > 0 &&
      StartDate &&
      EndDate &&
      EntityID > 0 &&
      EntityStructureID > 0
    ) {
      return this.httpClient.patch(environment.servers[environment.srv_mode].host + `/stages/${StageID}`, {
        ShortTitle: ShortTitle,
        StartDate: StartDate,
        EndDate: EndDate,
        ProjectId: ProjectId,
        EntityID: EntityID,
        EntityStructureID: EntityStructureID,
      });
    }
    return;
  }
  create(
    ShortTitle: string,
    ProjectId: number,
    StartDate: Date,
    EndDate: Date,
    EntityID: number,
    EntityStructureID: number
  ) {
    if (
      ShortTitle.length > 0 &&
      ProjectId > 0 &&
      StartDate &&
      EndDate &&
      EntityID > 0 &&
      EntityStructureID > 0
    ) {
      return this.httpClient.put(environment.servers[environment.srv_mode].host + '/stages', {
        ShortTitle: ShortTitle,
        StartDate: StartDate,
        EndDate: EndDate,
        ProjectId: ProjectId,
        EntityID: EntityID,
        EntityStructureID: EntityStructureID,
      });
    }
    return;
  }

  delete(ID: number) {
    return this.httpClient.delete<Object>(environment.servers[environment.srv_mode].host + `/stages`, {
      body: { ID: ID },
    });
  }

  constructor(private httpClient: HttpClient) {}

  getStages(project_id: number): Observable<Stage[]> {
    return this.httpClient.get<Stage[]>(
      environment.servers[environment.srv_mode].host + `/stages/${project_id}`
    );
  }

  getEntityStructures(): Observable<EntityStructure[]> {
    return this.httpClient.get<EntityStructure[]>(
      environment.servers[environment.srv_mode].host + `/entity_structures`
    );
  }
}
