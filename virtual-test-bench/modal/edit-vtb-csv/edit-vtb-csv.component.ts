import { Component, OnInit, Inject, Input, ViewChild } from '@angular/core';
import { Users, VUsers } from '../../../../model/structures';
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
  selector: 'app-edit-vtb-csv',
  templateUrl: './edit-vtb-csv.component.html',
  styleUrls: ['./edit-vtb-csv.component.css']
})
export class EditVtbCsvComponent implements OnInit {
  public faUser = faUser;
  public faLayerGroup = faLayerGroup;
  public faShieldHalved = faShieldHalved;
  public faPen = faPen;
  public faEnvelope = faEnvelope;
  public faPhone = faPhone;
  public faShield = faShield;
  public faBoxArchive = faBoxArchive;
  public security_data: any;
  public security_level_selected: any;
  //
  public group_data: any;
  vtb_csv_form: FormGroup;
  submitted = false;
  //
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  //
  records: any[] = [];
  headers: any[] = [];
  
  //-----------------------------------------------------------------------------  
  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditVtbCsvComponent>,
    private service: MasterService,
    private _formBuilder: FormBuilder,
    private storageService: AuthenticationService,
    private router: Router,
  ) {
    this.vtb_csv_form = this.formBuilder.group(
      {
        ID: new FormControl(''),
        ShortTitle: new FormControl('', Validators.required),
        Description: new FormControl(''),
        Content: new FormControl(''),
        SecurityLevel: new FormControl('', Validators.required),
      }
    );
   }
//-----------------------------------------------------------------------------

  //-----------------------------------------------------------------------------
  ngOnInit(): void {
    this.vtb_csv_form = this.formBuilder.group(
      {
        ID: new FormControl(''),
        ShortTitle: new FormControl('', Validators.required),
        Description: new FormControl(''),
        Content: new FormControl(''),
        SecurityLevel: new FormControl('', Validators.required),
      }
    );
    this.GetModalData(this.data.ID);
  }
  //--------------------------------------------------------------
  //----------------------------------------------------
  get f(): { [key: string]: AbstractControl } {
    return this.vtb_csv_form.controls;
  }
  //----------------------------------------------------
  onSubmit(): void {
    this.submitted = true;
    if (this.vtb_csv_form.invalid) {
      return;
    }
    this.dialogRef.close({ data: this.vtb_csv_form.value, security_level: this.security_level_selected });
  }
  //--------------------------------------------------------------
  onReset() {
    this.submitted = false;
    this.vtb_csv_form.reset();
  }
  //--------------------------------------------------------------
  
  //--------------------------------------------------------------

  //--------------------------------------------------------------
  GetModalData(_id: any) {
    //get_user_modal_form
    this.service.get_vtb_csv_modal_form(_id).subscribe((result: any) => {
      this.group_data = result.entity_data;
      this.security_data = result.security_data;
      let level = this.security_data.filter((word: any) => word.ID === this.group_data.SecurityLevel)[0];
      this.security_level_selected = level;
      //fill form
      this.vtb_csv_form.setValue({
        ID: this.group_data.ID,
        ShortTitle: this.group_data.ShortTitle,
        Content: this.group_data.Content,
        Description: this.group_data.Description,
        SecurityLevel: level.ShortTitle,        
      });
      let csvToRowArray = this.group_data.Content.split("\n");
      this.headers = csvToRowArray[0].split(",").map((e: any) => e.trim());
      this.records = csvToRowArray.slice(1).map((row: any) => row.split(","));
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
    return this.vtb_csv_form.get('SecurityLevel');
  }
  //------------------------------------------------------------------------------
  changeListener(_event: any) {
    console.log(_event);
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.vtb_csv_form.controls['Content'].setValue(event.target.result);
      //
      let csvToRowArray = event.target.result.split("\n");
      this.headers = csvToRowArray[0].split(",").map((e: any) => e.trim());
      this.records = csvToRowArray.slice(1).map((row: any) => row.split(","));
      //
    };
    reader.onerror = (event: any) => {
      console.log("File could not be read: " + event.target.error.code);
    };
    reader.readAsText(_event.files[0]);
  }
  //------------------------------------------------------------------------------

}
