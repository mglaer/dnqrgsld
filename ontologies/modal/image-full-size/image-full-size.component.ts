import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageUploadComponent } from '../image-upload/image-upload.component';

@Component({
  selector: 'app-image-full-size',
  templateUrl: './image-full-size.component.html',
  styleUrls: ['./image-full-size.component.css']
})
export class ImageFullSizeComponent implements OnInit {
  @Input() img_full:string='';
  submitted = false;

  constructor(
    public dialogRef: MatDialogRef<ImageUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    console.log('img init');
    this.img_full=this.data;
  }

  onSubmit(): void {
    this.submitted = true;
    this.dialogRef.close();
  }
}
