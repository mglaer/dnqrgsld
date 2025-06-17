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
  faLayerGroup,
  faL
} from '@fortawesome/free-solid-svg-icons';
import { MatTableDataSource } from '@angular/material/table';
import { Sort, MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { VGroups } from '../../../../model/structures';
import { MasterService } from 'src/app/services/master.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { Router } from '@angular/router';
import { cnst } from '../../../../model/cnst';


@Component({
  selector: 'app-create-structure',
  templateUrl: './create-structure.component.html',
  styleUrls: ['./create-structure.component.css']
})
export class CreateOntologyComponent implements OnInit {
  public faUser = faUser;
  public faLayerGroup = faLayerGroup;
  public faShieldHalved = faShieldHalved;
  public faPen = faPen;
  public faEnvelope = faEnvelope;
  public faPhone = faPhone;
  public faShield = faShield;
  public faBoxArchive = faBoxArchive;
  group_data: any;
  selected_group: any;
  public security_data: any;
  public security_level_selected: any;
  //
  ontology_create_form: FormGroup;
  submitted = false;
  public is_template: boolean = false;
  //
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateOntologyComponent>,
    private service: MasterService,
    private _formBuilder: FormBuilder,
    private storageService: AuthenticationService,
    private router: Router,
  ) {
    this.ontology_create_form = this.formBuilder.group(
      {
        ID: new FormControl(''),
        ShortTitle: new FormControl('', Validators.required),
        Description: new FormControl(''),
        SecurityLevel: new FormControl('', Validators.required),
        Parent: new FormControl(''),
      }
    );
  }

  //-----------------------------------------------------------------------------
  ngOnInit(): void {
    this.ontology_create_form = this.formBuilder.group(
      {
        ID: new FormControl(''),
        ShortTitle: new FormControl('', Validators.required),
        Description: new FormControl(''),
        SecurityLevel: new FormControl('', Validators.required),
        Parent: new FormControl(''),
      }
    );
    this.InitForm(this.data);
  }
  //--------------------------------------------------------------
  //----------------------------------------------------
  get f(): { [key: string]: AbstractControl } {
    return this.ontology_create_form.controls;
  }
  //----------------------------------------------------
  onSubmit(): void {
    this.submitted = true;
    if (this.ontology_create_form.invalid) {
      return;
    }
    this.dialogRef.close({ data: this.ontology_create_form.value, security_level: this.security_level_selected });
  }
  //--------------------------------------------------------------
  onReset() {
    this.submitted = false;
    this.ontology_create_form.reset();
  }
  //--------------------------------------------------------------
  //--------------------------------------------------------------

  //--------------------------------------------------------------
  InitForm(_data: any) {
    this.service.GetSecurityList().subscribe((result: any) => {
      this.security_data = result.data;
      let level = this.security_data[0];
      this.security_level_selected = level;
      //fill form
      this.ontology_create_form.setValue({
        ID: '',
        ShortTitle: '',
        Description: '',
        SecurityLevel: level.ShortTitle,
        Parent: this.data.Parent
      });

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
  //------------------------------------------------------------------------------
  // Access formcontrols getter
  get Level() {
    return this.ontology_create_form.get('SecurityLevel');
  }
  //------------------------------------------------------------------------------
  
  //------------------------------------------------------------------------------
  getrow(row: any) {
    this.selected_group = row;
    //console.log(row);
  }
  //------------------------------------------------------------------------------


}
