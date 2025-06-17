import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { VCalculation } from 'src/app/model/structures';
import { MasterService } from 'src/app/services/master.service';
import { ChartDataset, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-calc-view',
  templateUrl: './calc-view.component.html',
  styleUrls: ['./calc-view.component.css']
})
export class CalcViewComponent implements OnInit {
  public ID!: number;
  public parent_id!: number;
  calc_form: FormGroup;
  calculation = <VCalculation>{};
  //
  records: any[] = [];
  headers: any[] = [];
  // //-------------------------------
  // chartData: ChartDataset[] = [
  //   {
  //     // ⤵️ Add these
  //     label: '$ in millions',
  //     data: [ 1551, 1688, 1800, 1895, 2124, 2124 ]
  //   }
  // ];
  // chartLabels: string[] = [];
  // chartOptions: ChartOptions = {
  //   scales: {
      
  //   }
  // };
  // public chartData: ChartDataset[] = {
  //   labels: [
  //     'January',
  //     'February',
  //     'March',
  //     'April',
  //     'May',
  //     'June',
  //     'July'
  //   ],
  //   datasets: [
  //     {
  //       data: [ 65, 59, 80, 81, 56, 55, 40 ],
  //       label: 'Series A',
  //       fill: true,
  //       tension: 0.5,
  //       borderColor: 'black',
  //       backgroundColor: 'rgba(255,0,0,0.3)'
  //     }
  //   ]
  // };

  barChartOptions: any = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Variable X'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Variable Y'
        }
      }
    }
  };

  public barChartLabels:Array<string> = [];
  public barChartType = 'line';
  public barChartLegend = true;

  public barChartData: any[] = [];
  selectedData1: string = '';
  selectedData2: string = '';

  maxValue: number = 0;
  minValues: (number | null)[] = [];
  maxValues: (number | null)[] = [];
  selectedData: string[] = [];

  //-------------------------------
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private service: MasterService
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
    //
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
          console.log(result.data);
          this.calculation = result.data[0];
          this.CreateCsvTable();
          this.initChart();
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
  //------------------------------------------------------------------------------
  CreateCsvTable() {
    //
    const csvToRowArray: string[] = this.calculation.InOutFile.split("\n").filter(row => {
      return row.split(",").some(cell => cell.trim().length > 0);
    });
    this.headers = csvToRowArray[0].split(",").map((e: string) => e.trim());
    this.records = csvToRowArray.slice(1).map((row: string) => 
      row.split(",").map((value: string) => {
        const parsedValue = parseFloat(value.trim());
        return isNaN(parsedValue) ? null : parsedValue;
      })
    );
    this.findMinAndMaxValues();
    this.barChartLabels = Array.from(Array(this.records.length).keys()).map(i => (i + 1).toString()); 
    this.initChart();
    console.log(csvToRowArray);
    //            
  }

  // findMaxValue(){ 
  //   // const allValues = this.records.flat().map(Number); 
  //   // this.maxValue = Math.max(...allValues);
  //   // console.log(this.maxValue);
  //   if (this.records.length > 0) {
  //     const columnCount = this.headers.length;
  //     this.maxValues = new Array(columnCount).fill(Number.NEGATIVE_INFINITY);

  //     this.records.forEach(row => {
  //       row.forEach((cell, index) => {
  //         if (cell > this.maxValues[index]) {
  //           this.maxValues[index] = cell;
  //         }
  //       });
  //     });
  //   }
  // }

  findMinAndMaxValues() {
    if (this.records.length > 0) {
      const columnCount = this.headers.length;
      this.minValues = new Array(columnCount).fill(null);
      this.maxValues = new Array(columnCount).fill(null);

      for (let i = 0; i < columnCount; i++) {
        let minValue = Number.POSITIVE_INFINITY;
        let maxValue = Number.NEGATIVE_INFINITY;
        this.records.forEach((row: (number | null)[]) => {
          const cell = row[i];
          if (cell !== null) {
            if (cell < minValue) {
              minValue = cell;
            }
            if (cell > maxValue) {
              maxValue = cell;
            }
          }
        });
        this.minValues[i] = minValue === Number.POSITIVE_INFINITY ? null : minValue;
        this.maxValues[i] = maxValue === Number.NEGATIVE_INFINITY ? null : maxValue;
      }
    }
  }
  


  // initChart() {
  //   if (this.selectedData1 && this.selectedData2) {
  //     const position1 = this.headers.findIndex(elem => elem === this.selectedData1.split('_')[0]);
  //     const position2 = this.headers.findIndex(elem => elem === this.selectedData2.split('_')[0]);
  //     const data = this.records.map(record => [record[position1], record[position2]]);
  //     this.barChartData = [
  //       { data: data.map(d => d[0]), label: this.selectedData1.split('_')[0], borderColor: 'blue', fill: false },
  //       { data: data.map(d => d[1]), label: this.selectedData2.split('_')[0], borderColor: 'pink', fill: false }
  //     ];
  //   }
  // }

  initChart() {
    if (this.selectedData1 && this.selectedData2) {
      const position1 = this.headers.findIndex(elem => elem === this.selectedData1.split('_')[0]);
      const position2 = this.headers.findIndex(elem => elem === this.selectedData2.split('_')[0]);
      const data = this.records.map(record => [record[position1], record[position2]]);
      data.sort((a, b) => a[0] - b[0]);
      this.barChartData = [
        { data: data.map(d => d[1]), label: `${this.selectedData2.split('_')[0]} (${this.selectedData1.split('_')[0]})`, borderColor: 'blue', fill: false }
      ];
      this.barChartLabels = data.map(d => d[0].toString());
    }
  }

  onSelectionChange1(event: any) {
    this.selectedData1 = event.value;
    this.initChart();
  }

  onSelectionChange2(event: any) {
    this.selectedData2 = event.value;
    this.initChart();
  }


  //----------------------------------------------------
  onSubmit(): void {

  }
  //--------------------------------------------------------
  exit() {
    this.router.navigate(['home/calculation_list', { id: this.parent_id }]);
  }
}
