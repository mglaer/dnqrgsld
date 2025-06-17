import { GantStand } from '../interfaces/gant-stand';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Stand } from '../interfaces/stand';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StandsApiService {
  gant(entity_structure_id: number, start: Date, end: Date): Observable<GantStand[]>  {
    return this.httpClient.post<GantStand[]>(environment.servers[environment.srv_mode].host + `/gant`, {
      "ID" : entity_structure_id,
      "StartDate": start,
      "EndDate": end,

    });
  }

  constructor(private httpClient: HttpClient) { }


  getStands(id:number|undefined): Observable<Stand[]>{
    return this.httpClient.get<Stand[]>(environment.servers[environment.srv_mode].host + `/stands/${id}`);
  }

}
