import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with basic auth credentials if available
        let currentUser ={authdata:''};
        //if (currentUser && currentUser.authdata) {

            //const dupReq = req.clone({ headers: req.headers.set('Access-Control-Allow-Origin', '*')});

            request = request.clone({
                setHeaders: { 
                    Authorization: `Basic ${currentUser.authdata}`,
                    
                }
            });
        //}

        return next.handle(request);
    }
}