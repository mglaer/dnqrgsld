import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as Highcharts from 'highcharts';
import HC_gantt from 'highcharts/modules/gantt';
import { type } from 'os';
import { Stand } from 'src/app/interfaces/stand';
import { StandsApiService } from 'src/app/services/stands.service';
HC_gantt(Highcharts);

@Component({
  selector: 'app-entity-choosing',
  templateUrl: './entity-choosing.component.html',
  styleUrls: ['./entity-choosing.component.css'],
})
export class EntityChoosingComponent implements OnInit {
  form: any;
  stands: Stand[] = [];
  entity_structure_id;
  start: Date;
  end: Date;
  updateFlag: boolean = true;
  start_s: string = '';
  Highcharts: typeof Highcharts = Highcharts;
  stand: Stand = {
    ID: -1,
    ShortTitle: '',
  };
  chartOptions: Highcharts.Options = {};
  stages_gant: any;
  stages_gant_select: any;
  ds: any;
  de: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private stands_api: StandsApiService,
    private dialogRef: MatDialogRef<EntityChoosingComponent>,
    private fb: FormBuilder
  ) {
    this.entity_structure_id = data.entity_structure.ID;

    let left = new Date(data.start).getTime();
    let right = new Date(data.end).getTime();

    console.log(left, right);

    let filtered_gant = data.stages_gant.filter(
      (s: { end: number; start: number }) =>
        s.end !== 0 && s.start !== 0
    );

    let gant_starts = filtered_gant.map((s: { start: any }) => s.start);
    let gant_ends = filtered_gant.map((s: { end: any }) => s.end);

    let gant_smallest: number = gant_starts.sort()[0];
    let gant_largest: number = gant_ends.sort().reverse()[0];

    this.start = new Date(
      Math.min(gant_smallest, new Date(data.start).getTime())
    );
    this.end = new Date(Math.max(gant_largest, new Date(data.end).getTime()));

    this.ds = new Date(data.start);
    this.de = new Date(data.end);

    this.chartOptions = {
      rangeSelector: {
        enabled: true,
        selected: 5
      },
      time:{
        useUTC: false,
      },
      xAxis: [
        {
          scrollbar: {
            enabled: true,
            showFull: true,
            liveRedraw: true,
          },
           plotLines: [
            {
              color: '#00FF00',
              width: 2,
              value: this.ds.getTime(),
            },
            {
              color: '#FF0000',
              width: 2,
              value: this.de.getTime(),
            },
          ],

          dateTimeLabelFormats: {
            millisecond: '%b %e',
            second: '%b %e',
            minute: '%b %e',
            hour: '%b %e',
            day: '%b %e',
            week: '%b %e',
            month: '%b %e',
            year: '%b %e',
          },

          tickInterval: 1000 * 3600 * 24 * 30, // month
          type: 'datetime',
        },
        {
          grid: {
            enabled: false,
          },
          labels: {
            enabled: false,
          },
        },
      ],
      yAxis: [
        {
          uniqueNames: true,

          grid: {
            enabled: true,
          },
          breaks: [
            {
              breakSize: 0.5,
              from: 0,
              to: 0,
            },
          ],
        },
      ],
      series: [
        {
          type: 'gantt',
          data: data.stages_gant.map((s: { end: number | null; start: number | null; }) => {if (s.end === 0) {s.end == null} if (s.start === 0) {s.start = null} return s})
        },
      ],
    };
    this.stages_gant = data.stages_gant;
    let tmp = this.stages_gant;
    console.log(tmp);
    this.stages_gant_select = [];
    for (let i = 0; i < tmp.length; i++) {
      if (
        this.stages_gant_select.map((a: any) => a.ID).indexOf(tmp[i].ID) === -1
      ) {
        this.stages_gant_select.push(tmp[i]);
      }
    }
    console.log(this.stages_gant_select);
  }

  ngOnInit(): void {
    this.stands_api.getStands(this.entity_structure_id).subscribe((res) => {
      this.stands = res;
    });
    this.form = this.fb.group({
      stand: [this.stand, []],
    });
  }

  save() {
    this.dialogRef.close(this.form.get('stand').value);
  }
  close() {
    this.dialogRef.close();
  }
}
