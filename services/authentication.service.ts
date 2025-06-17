import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { cnst } from '../model/cnst';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { timeStamp } from 'console';
import { VEntityStructureTree } from '../model/structures';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    USER_KEY = 'auth-user';
    TOKEN_KEY = 'auth-token';
    VIEW_MODE_KEY = 'view-mode';
    AUTH_API: string = environment.servers[environment.srv_mode].host + '/auth/login/';
    ///
    router_url: string = '';
    router_param: string = '';
    URL_KEY = 'router-url';
    URL_PARAM_KEY = 'router-param';
    //---------------------------------------------------------
    constructor(private http: HttpClient) { }
    //----------------------------------------------------------------------------
    login(Login: string, password: string): Observable<any> {
        return this.http.post<any>(this.AUTH_API, { Login, password });
    }
    //----------------------------------------------------------------------------
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem(this.USER_KEY);
        localStorage.removeItem(this.TOKEN_KEY);
    }
    //----------------------------------------------------------------------------
    public saveUser(user: any): void {
        localStorage.removeItem(this.USER_KEY);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
    //----------------------------------------------------------------------------
    public getUser(): any {
        return JSON.parse(localStorage.getItem(this.USER_KEY)!);
    }
    //----------------------------------------------------------------------------
    public saveToken(token: string): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.setItem(this.TOKEN_KEY, token);
    }
    //----------------------------------------------------------------------------
    public getToken(): string {
        let _token = localStorage.getItem(this.TOKEN_KEY)!
        return _token;
    }
    //----------------------------------------------------------------------------
    public setViewMode(_mode: number) {
        localStorage.removeItem(this.VIEW_MODE_KEY);
        localStorage.setItem(this.VIEW_MODE_KEY, _mode.toString());
    }
    //----------------------------------------------------------------------------
    public GetViewMode(): number {
        let _res = localStorage.getItem(this.VIEW_MODE_KEY)!;
        let _mode: number = 0;
        if (_res == null) {
            this.setViewMode(_mode);
        }
        else {
            _mode = parseInt(_res);
        }
        return _mode;
    }
    //-----------------------------------------------------------------------------
    public GetRouterUrl(): string {
        this.router_url = localStorage.getItem(this.URL_KEY)!
        return this.router_url;
    }
    //-----------------------------------------------------------------------------
    public GetRouterParam(): string {
        this.router_param = localStorage.getItem(this.URL_PARAM_KEY)!
        return this.router_param;
    }
    //-----------------------------------------------------------------------------
    public SetRouterUrl(_url: string, _param: string) {
        localStorage.removeItem(this.URL_KEY);
        localStorage.setItem(this.URL_KEY, _url);
        localStorage.removeItem(this.URL_PARAM_KEY);
        localStorage.setItem(this.URL_PARAM_KEY, _param);

        this.router_url = _url;
        this.router_param = _param;
    }
    //----------------------------------------------------------------------------------
    public ResetRouterURL()
    {
        localStorage.removeItem(this.URL_KEY);
        localStorage.removeItem(this.URL_PARAM_KEY);        
    }
}