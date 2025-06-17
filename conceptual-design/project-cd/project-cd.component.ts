import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAccordion } from '@angular/material/expansion';

import { FormBuilder } from '@angular/forms';
import { MasterService } from 'src/app/services/master.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { VPassportCSTP, VProject } from '../../../model/structures'
import {
  faShieldHalved,
  faPen,
  faEnvelope,
  faPhone,
  faShield,
  faBoxArchive,
  faUser,
  faLayerGroup,
  faBoxesStacked,
  faGem,
  faJetFighter,
  faFile
} from '@fortawesome/free-solid-svg-icons';
import { RedkeyCreateProjectComponent } from '../modal/redkey-create-project/redkey-create-project.component';

@Component({
  selector: 'app-project-cd',
  templateUrl: './project-cd.component.html',
  styleUrls: ['./project-cd.component.css']
})
export class ProjectCdComponent implements OnInit {
  public project_list: VProject[] = [];
  public show_archieved: boolean = false;
  selectedValue: string = '';

  public faUser = faUser;
  public faLayerGroup = faLayerGroup;
  public faShieldHalved = faShieldHalved;
  public faPen = faPen;
  public faEnvelope = faEnvelope;
  public faPhone = faPhone;
  public faShield = faShield;
  public faBoxArchive = faBoxArchive;
  public faBoxesStacked = faBoxesStacked;
  public faGem = faGem;
  public faJetFighter = faJetFighter;
  public faFile = faFile;
  @ViewChild(MatAccordion) accordion?: MatAccordion;
  //---------------------------------------------------------------------
  constructor(
    private service: MasterService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private router: Router,
    private storageService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.GetRootList();
  }
  //---------------------------------------------------------------------
  public GetRootList() {
    this.service.GetVProjectlist().subscribe((result: any) => {
      if (result.data != null) {
        this.storageService.saveToken(result.jwt);
        if (this.show_archieved) {
          this.project_list = [];
          this.project_list = result.data;
        }
        else {
          this.project_list = result.data.filter((word: any) => word.ArchiveSign === false);
        }
      }
      else {
        this.router.navigate(['login']);
      }
    });
  }
  //------------------------------------------------------------------------------
  FunctionCreateProject() {
    console.log('FunctionCreateProject');

    const dialogRef = this.dialog.open(RedkeyCreateProjectComponent, {
      width: '450px',
      data: {},
    });
    //------------------------------------------------------------------------------
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {
        this.service.RedKeyCreateProject(result).subscribe((result: any) => {
          if (result.res == 'success') {
            this._snackBar.open('Структура успешно обновлена', '', {
              duration: 1000,
              panelClass: ['blue-snackbar']
            });
            this.GetRootList();
          }
          else {
            this._snackBar.open('Ошибка сервера', '', {
              duration: 1000,
              panelClass: ['red-snackbar']
            })
          }
        },
          err0 => {
            console.log('error: ' + err0);
          }
        );
      }
    },
      err => {
        console.log('error: ' + err);
      });
  }
  //------------------------------------------------------------------------------
  FunctionEdit(_entity: any) {
    console.log('FunctionEdit');
    this.router.navigate(['home/calculation_list', { id: _entity.ID }]);



  }
  //-----------------------------------------------------------------------------
  FunctionChangeActive(_entity: any) {
    this.service.ActivationRedKeyProject(_entity).subscribe((result: any) => {
      if (result.res == 'success') {
        this._snackBar.open('Проект успешно обновлен', '', {
          duration: 1000,
          panelClass: ['blue-snackbar']
        });
        this.GetRootList();
      }
      else {
        this._snackBar.open('Ошибка сервера', '', {
          duration: 1000,
          panelClass: ['red-snackbar']
        })
      }
    },
      err0 => {
        console.log('error: ' + err0);
      }
    );/**/
  }
  //---------------------------------------------------------------------


}
