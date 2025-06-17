import { Component, OnInit, AfterContentInit, ViewChild } from '@angular/core';
import { faSheetPlastic } from '@fortawesome/free-solid-svg-icons';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MasterService } from 'src/app/services/master.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavItem, VGroupsAndUsersStructureTree, VMenusOperations, VMenusOperationsTree, Users } from '../model/structures';
import { FormBuilder } from '@angular/forms';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Router,NavigationEnd } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavService } from '../services/sidenav_service';
import { AuthenticationService } from '../services/authentication.service';

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {
  fullImagePath: string = '/assets/img/tsagi_logo.png';
  user: Users = new Users(0, '', '', '', '', '', '', '', 0, false, 0);

  res: any;
  @ViewChild('sidenav') public sidenav?: MatSidenav;



  public faBars = faBars;
  navItems: NavItem[] = [];

  //sidenav config
  options = this._formBuilder.group({
    bottom: 0,
    fixed: true,
    top: 0,
  });

  public menu_struct: any;

  private _transformer_menu = (node: VMenusOperationsTree, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.ShortTitle,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );


  treeFlattenerMenu = new MatTreeFlattener(
    this._transformer_menu,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSourceMenu = new MatTreeFlatDataSource(this.treeControl, this.treeFlattenerMenu);
  public tree_menu: VMenusOperationsTree[] = []


  constructor(
    private service: MasterService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private router: Router,
    private sidenavService: SidenavService,
    private storageService: AuthenticationService,
  ) {

    router.events.subscribe((val) => {
      //if((val instanceof NavigationEnd)&&val.url==='/home/ontologies_structure')
      if(val instanceof NavigationEnd)
      {
        this.sidenav?.close();
      }
  });

  }
  //----------------------------------------------
    //---------------------------------------------------------------
    Logout()
    {
      this.storageService.logout();
      this.router.navigate(['/login']);    
    }
  //----------------------------------------------
  ngOnInit(): void {
    let url=this.storageService.GetRouterUrl();
    let param=this.storageService.GetRouterParam();
    this.storageService.ResetRouterURL();
    if(url!=null)
    {
      this.router.navigate([url,JSON.parse(param)]);
    }
    this.sidenavService.setSidenav(this.sidenav);

    this.res = this.storageService.getUser();
    this.user = this.res;

    this.GetRootMenu();
  }

  //---------------------------------------------------------------------------
  onChanged(increased:any){
    this.sidenav?.close();
}
  //---------------------------------------------------------------------------
  click_menu(_item: string) {
    console.log(_item);
    // this._router.navigate([_item]);
  }
  //---------------------------------------------------------------------------
  GetRootMenu() {
    this.service.GetRootMenu().subscribe((result: any) => {      
      if (result.data != null) {
        this.storageService.saveToken(result.jwt);
        this.menu_struct = result.data;
        this.tree_menu = [];
        this.navItems = [];
        let data = new Map();
        let tree = [];
        for (const node of this.menu_struct) {
          if (node.Type == "Menu") {
            let _node: NavItem = { ShortTitle: '', iconName: '', children: [] };
            _node.ShortTitle = node.ShortTitle;
            _node.route = node.NamePage;
            //_node.Type=node.Type;
            _node.children = [];
            data.set(node.ID, _node);
          }
        }
        for (const node of this.menu_struct) {
          if (node.Type == "Menu") {
            if (node.Parent === null) {
              tree.push(data.get(node.ID))
            }
            else {
              data.get(node.Parent).children.push(data.get(node.ID));
            }
          }
        }
        this.navItems = tree;
      }
      else {
        this.router.navigate(['login']);
      }
    });
  }
  //---------------------------------------------------------------------------
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

}
