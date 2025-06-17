import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { VCalculation } from 'src/app/model/structures';
import { MasterService } from 'src/app/services/master.service';

@Component({
  selector: 'app-edit-calc',
  templateUrl: './edit-calc.component.html',
  styleUrls: ['./edit-calc.component.css']
})
export class EditCalcComponent implements OnInit {
  public ID!: number;
  public parent_id!: number;
  records: any[] = [];
  headers: any[] = [];
  calc_form: FormGroup;
  calculation = <VCalculation>{};
  //-------------------------------------------------
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private service: MasterService,
    private _snackBar: MatSnackBar
  ) {
    this.calc_form = this.formBuilder.group(
      {
        ID: new FormControl(''),
        ShortTitle: new FormControl(''),
        Description: new FormControl(''),
        Module: new FormControl(''),
        InOutFile: new FormControl(''),
        Status: new FormControl(''),
        Path: new FormControl('')
      }
    );
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.ID = params['id'];
      this.parent_id = params['parent_id'];
      /*if (params['id'] != undefined) {     
        this.ID = JSON.parse(params['id']);
      }*/
      this.InitForm();
    });
  }
  //--------------------------------------------------------
  InitForm() {
    //---
    if (this.ID != undefined) {
      this.service.RedKeyGetCalculation_by_ID(this.ID).subscribe((result: any) => {
        if (result.data != null) {
          this.calculation = result.data[0];
          this.CreateCsvTable();
          this.calc_form.setValue(
            {
              ID: this.calculation.ID,
              ShortTitle: this.calculation.ShortTitle,
              Description: this.calculation.Description,
              Module: this.calculation.Module,
              InOutFile: this.calculation.InOutFile,
              Status: this.calculation.Status,
              Path: this.calculation.Path
            }
          );
        }
      });
    }
  }
  //-----------------------------------------------------------------------------
  //------------------------------------------------------------------------------
  CreateCsvTable() {
    //
    let csvToRowArray = this.calculation.InOutFile.split("\n");
    this.headers = csvToRowArray[0].split(",").map((e: any) => e.trim());
    this.records = csvToRowArray.slice(1).map((row: any) => row.split(","));
    //            
  }
  //------------------------------------------------------------------------------
  changeListener(_event: any) {
    console.log(_event);
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.calc_form.controls['InOutFile'].setValue(event.target.result);
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
  //--------------------------------------------------------
  onSubmit()
  {

  }
  //----------------------------------
  save() {
    this.calculation.ShortTitle = this.calc_form.value.ShortTitle;
    this.calculation.Description = this.calc_form.value.Description;
    //this.calculation.Project = this.parent_id;
    //this.calculation.Module = this.selected_module.ID;
    this.calculation.InOutFile = this.calc_form.value.InOutFile;
    this.calculation.Status = "Черновик";
    this.calculation.Path = this.calc_form.value.Path;
    this.service.RedKeyUpdateCalculation(this.calculation).subscribe((result: any) => {
      if (result.res == 'success') {
        this._snackBar.open('Расчёт успешно изменен', '', {
          duration: 1000,
          panelClass: ['blue-snackbar']
        });
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
  //--------------------------------------------------------
  exit() {
    this.router.navigate(['home/calculation_list', { id: this.parent_id }]);
  }
}