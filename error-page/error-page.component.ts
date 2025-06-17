import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {
  fullImagePath: string = '/assets/img/jdun2.png';
  LogoPath: string = '/assets/img/tsagi_logo.png';
  constructor() { }

  ngOnInit(): void {
  }

}
