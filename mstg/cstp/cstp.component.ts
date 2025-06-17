import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAccordion } from '@angular/material/expansion';

import { FormBuilder } from '@angular/forms';
import { MasterService } from 'src/app/services/master.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { VPassportCSTP } from '../../../model/structures'
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


@Component({
  selector: 'app-cstp',
  templateUrl: './cstp.component.html',
  styleUrls: ['./cstp.component.css']
})
export class CstpComponent implements OnInit {
  public passport_list: VPassportCSTP[] = [];
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
    private storageService: AuthenticationService,
  ) { }
//---------------------------------------------------------------------
  ngOnInit(): void {
    this.GetRootList();
  }
//---------------------------------------------------------------------
  public GetRootList() {
    this.service.GetVPassportCSTPlist().subscribe((result: any) => {
      if (result.data != null) {
        this.storageService.saveToken(result.jwt);
        if (this.show_archieved) {
          this.passport_list = [];
          this.passport_list = result.data;
        }
        else {
          this.passport_list = result.data.filter((word: any) => word.ArchiveSign === false);
        }        
      }
      else {
        this.router.navigate(['login']);
      }
    });
  }
  //------------------------------------------------------------------------------
  FunctionCreatePassport() {
    console.log('FunctionCreatePassport');
    this.router.navigate(['home/cstp-create-passport', { }]);    
  }
  //------------------------------------------------------------------------------
  FunctionEdit(_entity: any) {
    console.log('FunctionEdit');
    this.router.navigate(['home/cstp-edit-passport', { id:_entity.ID }]);    
    /*
    if (_entity.TypeElement === 'Template') {
      this.router.navigate(['home/edit-template', { ID: _entity.ID }]);
    }
    else if (_entity.TypeElement === 'Entity') {
      this.router.navigate(['home/edit-entity', { ID: _entity.ID }]);

    }
    else if (_entity.TypeElement === 'Structure') {
      const dialogRef = this.dialog.open(EditOntologyComponent, {
        width: '450px',
        data: _entity,
      });
      //------------------------------------------------------------------------------
      dialogRef.afterClosed().subscribe(result => {
        if (result != '') {
          this.service.UpdateOntologyEntity(result, result.Type).subscribe((result: any) => {
            if (result.res == 'success') {
              this._snackBar.open('Структура успешно обновлена', '', {
                duration: 1000,
                panelClass: ['blue-snackbar']
              });
              this.GetEntityStructure(this.parent_data.ID, false);
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
    }*/
  }
  //-----------------------------------------------------------------------------
  FunctionChangeActive(_entity: any) {
    this.service.ActivationPassportCSTP(_entity).subscribe((result: any) => {
      if (result.res == 'success') {
        this._snackBar.open('Паспорт КНТП успешно обновлен', '', {
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
  //---------------------------------------------------------------------

//---------------------------------------------------------------------
}
