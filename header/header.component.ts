import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Users, VUsers } from '../../model/structures';
//import { UserService } from '../../services';
//import { StorageService } from '../services/storage.service';
//import{TokenStorageService}from '../services/token-storage.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  fullImagePath: string;
  user: Users = new Users(0, '', '', '', '', '', '', '', 0, false, 0);
  res: any;

  constructor(private storageService: AuthenticationService,public router: Router) {
    this.fullImagePath = '/assets/img/tsagi_logo.png';
    this.res = this.storageService.getUser();
    this.user = this.res;
  }

  ngOnInit(): void {
  }

}
