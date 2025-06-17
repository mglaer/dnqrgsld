import {Component, Input, OnInit, ViewChild,Output,EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {NavItem} from '../../model/structures';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit {
  @Input() items: NavItem[]=[];
  @ViewChild('childMenu') public childMenu:any;
  @Output() CloseSideMenuEvent = new EventEmitter<string>();
  @Input() sidenav?:MatSidenav;

  constructor(public router: Router) {
  }

  ngOnInit() {
  }

  /*click_menu(_path?:string)
  {
    //console.log(_path);
    this.CloseSideMenuEvent.next('Y');
    this.router.navigate(['/home/'+_path]);
  }*/
  //-----------------------------------------------------
  click_menu(_path?: string) {
    if (_path) {
      if (_path.startsWith('cvsp:URL=')) {
        const url = _path.substring('cvsp:URL='.length); 
        const decodedUrl = decodeURIComponent(url);
        console.log('Decoded URL:', decodedUrl);
  
        localStorage.setItem('cvsp_url', decodedUrl);
  
        this.router.navigate(['/home/cvsp']).then(success => {
          if (success) {
            console.log('Navigation to /cvsp successful');
          } else {
            console.error('Navigation failed');
          }
        });
  
        this.CloseSideMenuEvent.next('Y'); 
      } else {
        console.log(_path);
        this.CloseSideMenuEvent.next('Y');
        this.router.navigate(['/home/' + _path]);
      }
    }
  }

  //-----------------------------------------------------
}
