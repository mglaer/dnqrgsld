import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';


@Injectable()
export class HttpsRequestInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //const dupReq = req.clone({ headers: req.headers.set('Access-Control-Allow-Origin','https://my-json-server.typicode.com') });
    //const dupReq = req.clone({ headers: req.headers.set('Access-Control-Allow-Origin', 'http://localhost:4200/').set('user', 'tupak') });
    //const dupReq = req.clone({ headers: req.headers.set('Access-Control-Allow-Origin', 'http://localhost:4200/')});
    //==============================================================================================================
    //---режим разработки---
    //const dupReq = req.clone({ headers: req.headers.set('Access-Control-Allow-Origin', 'http://localhost:3001/')});
    const dupReq = req.clone({ headers: req.headers.set('Access-Control-Allow-Origin', '*')});
    
    //alert(JSON.stringify(req.headers));
    //alert(JSON.stringify(dupReq.headers));

    //---production mode
    //const dupReq = req.clone({ headers: req.headers.set('Access-Control-Allow-Origin', 'http://95.165.146.133:3000/')});
    //==============================================================================================================     

    //const dupReq = req.clone({ headers: req.headers.set('Access-Control-Allow-Origin','*') });
    //const dupReq = req.clone({ headers: req.headers.set('Access-Control-Allow-Origin','http://localhost:3000/users/authenticate') });
    //http://localhost:3000/users/authenticate
    //const dupReq = req.clone({ headers: req.headers.set('Access-Control-Allow-Origin','https://95.165.146.133:3000/') });
    return next.handle(dupReq);
  }
};
@NgModule({
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpsRequestInterceptor, multi: true }
  ]
})
export class InterceptorModule { }