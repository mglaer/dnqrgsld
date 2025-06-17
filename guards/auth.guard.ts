import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })



export class AuthGuard implements CanActivate {


    constructor(
        private router: Router,
        private jwtHelper: JwtHelperService,
        private storageService: AuthenticationService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        //get the jwt token which are present in the local storage
        const token = this.storageService.getToken();
        //Check if the token is expired or not and if token is expired then redirect to login page and return false
        if (token && !this.jwtHelper.isTokenExpired(token)) {
            if (this.storageService.getUser()) {
                // logged in so return true
                return true;
            }
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    } 
}