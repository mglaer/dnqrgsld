import {HttpClient} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SecurityLevel } from "../interfaces/security-level";
import { environment } from "src/environments/environment";
@Injectable({
  providedIn: 'root'
})
export class SecurityLevelsApiService {
  constructor(private httpClient: HttpClient) { }


  getSecurityLevels(): Observable<SecurityLevel[]>{
    return this.httpClient.get<SecurityLevel[]>( environment.servers[environment.srv_mode].host + "/security_levels");
  }
}
