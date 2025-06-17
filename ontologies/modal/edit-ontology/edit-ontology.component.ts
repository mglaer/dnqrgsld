import { Component, OnInit, Inject, Input, ViewChild } from '@angular/core';
import { VEntityStructure } from '../../../../model/structures';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import Validation from '../../../../utils/validation';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MustMatch } from '../../../../_helpers/must-match.validator';
import {
  faShieldHalved,
  faPen,
  faEnvelope,
  faPhone,
  faShield,
  faBoxArchive,
  faUser,
  faLayerGroup
} from '@fortawesome/free-solid-svg-icons';
import { MatTableDataSource } from '@angular/material/table';
import { Sort, MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { VGroups } from '../../../../model/structures';
import { MasterService } from 'src/app/services/master.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-ontology',
  templateUrl: './edit-ontology.component.html',
  styleUrls: ['./edit-ontology.component.css']
})
export class EditOntologyComponent implements OnInit {
  public faUser = faUser;
  public faLayerGroup = faLayerGroup;
  public faShieldHalved = faShieldHalved;
  public faPen = faPen;
  public faEnvelope = faEnvelope;
  public faPhone = faPhone;
  public faShield = faShield;
  public faBoxArchive = faBoxArchive;
  //dataSourceGroups: any;
  group_data: any;
  selected_group: any;
  public entity_data: any;
  public security_data: any;
  public security_level_selected: any;
  //
  ontology_edit_form: FormGroup;
  submitted = false;
  //
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  //-----------------------------------------------------------------------------  
  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditOntologyComponent>,
    private service: MasterService,
    private _formBuilder: FormBuilder,
    private storageService: AuthenticationService,
    private router: Router,
  ) {
    this.ontology_edit_form = this.formBuilder.group(
      {
        ID: new FormControl(''),
        ShortTitle: new FormControl('', Validators.required),
        Description: new FormControl(''),
        SecurityLevel: new FormControl('', Validators.required),
      },

      /*{
        validator: MustMatch('password', 'password_confirm')
      }*/
    );
    //this.ontology_edit_form.setValue({ login: 'preved' });
  }
  //-----------------------------------------------------------------------------

  //-----------------------------------------------------------------------------
  ngOnInit(): void {
    this.ontology_edit_form = this.formBuilder.group(
      {
        ID: new FormControl(''),
        ShortTitle: new FormControl('', Validators.required),
        Description: new FormControl(''),
        SecurityLevel: new FormControl('', Validators.required),
      },
      {
        //validator: MustMatch('Password', 'password_confirm')
      }
    );
    this.GetModalData(this.data);
  }
  //--------------------------------------------------------------
  //----------------------------------------------------
  get f(): { [key: string]: AbstractControl } {
    return this.ontology_edit_form.controls;
  }
  //----------------------------------------------------
  onSubmit(): void {
    this.submitted = true;
    if (this.ontology_edit_form.invalid) {
      return;
    }
    this.dialogRef.close({ data: this.ontology_edit_form.value, security_level: this.security_level_selected, Type: this.data.TypeElement });
  }
  //--------------------------------------------------------------
  onReset() {
    this.submitted = false;
    this.ontology_edit_form.reset();
  }
  //--------------------------------------------------------------
  //--------------------------------------------------------------

  //--------------------------------------------------------------
  GetModalData(_data: any) {
    this.service.get_ontology_modal_form(_data.ID,_data.TypeElement).subscribe((result: any) => {
      this.entity_data = result.entity_data;
      this.security_data = result.security_data;
      let level = this.security_data.filter((word: any) => word.ID === this.entity_data.SecurityLevel)[0];
      //fill form
      this.ontology_edit_form.setValue({
        ID: this.entity_data.ID,
        ShortTitle: this.entity_data.ShortTitle,
        Description: this.entity_data.Description,
        SecurityLevel: level.ShortTitle,//this.data.SecurityLevel,
      });
      this.security_level_selected = level;
    });
  }
  //------------------------------------------------------------------------------
  changeLevel(e: any) {
    this.Level?.setValue(e.target.value, {
      onlySelf: true,
    });
    let split_array: string[] = e.target.value.split(": ");
    this.security_level_selected = this.security_data[split_array[0]];
  }
  //------------------------------------------------------------------------------
  // Access formcontrols getter
  get Level() {
    return this.ontology_edit_form.get('SecurityLevel');
  }
  //------------------------------------------------------------------------------
  /*Filterchange(event: Event) {
    const filvalue = (event.target as HTMLInputElement).value;
    this.dataSourceGroups.filter = filvalue;
  }*/
  //------------------------------------------------------------------------------
  getrow(row: any) {
    this.selected_group = row;
    //console.log(row);
  }
  //------------------------------------------------------------------------------

}
