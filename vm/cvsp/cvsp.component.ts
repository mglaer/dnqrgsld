/*
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, Route, Router, RouteReuseStrategy } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-cvsp',
  templateUrl: './cvsp.component.html',
  styleUrls: ['./cvsp.component.css']
})
export class CvspComponent implements OnInit {
  url: string="";
  link:string="";

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {

    //this.url = encodeURI(this.route.snapshot.paramMap.get('url')!);
    this.url = decodeURI(this.route.snapshot.paramMap.get('url')!);
    this.link=this.url.replace("  ","//");
    this.link=this.link.replace(" ","/");
    
    //window.open(environment.kpvm_url, "_blank");
    window.open(this.link, "_blank");
    this.router.navigate(['home']);
  }

}
*/

//-----------------------------------------------

import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cvsp',
  templateUrl: './cvsp.component.html',
  styleUrls: ['./cvsp.component.css']
})
export class CvspComponent implements OnInit {

  url?: string;

  constructor(private router: Router) {
    console.log('CvspComponent constructor');
  }

  ngOnInit(): void {
    const storedUrl = localStorage.getItem('cvsp_url');

    if (storedUrl !== null) {
      this.url = storedUrl;
      console.log('Received URL from localStorage:', this.url);

      const decodedUrl = decodeURIComponent(this.url);
      //window.location.href = decodedUrl;  
      window.open(decodedUrl, "_blank");
      localStorage.removeItem('cvsp_url');
      this.router.navigate(['home']);
    } else {
      console.warn('No URL found in localStorage');
      //window.location.href = environment.kpvm_url; 
      window.open(environment.kpvm_url, "_blank");
      this.router.navigate(['home']);
    }
  }
}