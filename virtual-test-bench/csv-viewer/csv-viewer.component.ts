import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { VViewVTB } from 'src/app/model/structures';
import { AuthenticationService } from 'src/app/services';
import { MasterService } from 'src/app/services/master.service';

@Component({
  selector: 'app-csv-viewer',
  templateUrl: './csv-viewer.component.html',
  styleUrls: ['./csv-viewer.component.css']
})
export class CsvViewerComponent implements OnInit {
  ID!: number;
  Item!: VViewVTB;
  csv_data: any;
  //
  records:any[] = [];
  headers:any[] = [];
  header = false;
  //--------------------
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storageService: AuthenticationService,
    private service: MasterService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (params['id'] != undefined) {//если прислали список для добавления в реестр, нужно активировать последний таб и в цикле добавить        
        this.ID = params['id'];
        this.GetContent();
      }
    });
  }
  //----------------------------------------------------
  public exit() {
    //this.router.navigate(['home/view_vtb']);
    window.top!.close();
  }
  //----------------------------------------------------
  GetContent() {
    this.service.GetVtbCsvById(this.ID).subscribe((result: any) => {
      if (result.data != null) {
        this.storageService.saveToken(result.jwt);
        this.Item = result.data[0];
        let csvToRowArray = this.Item.Content.split("\n");
          this.headers = csvToRowArray[0].split(",").map(e => e.trim());
          this.records = csvToRowArray.slice(1).map(row => row.split(","));      
      }
    });
  }
  //----------------------------------------------------

  //----------------------------------------------------
}
