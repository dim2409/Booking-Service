import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-booking-info-dialog',
  standalone: true,
  imports: [],
  templateUrl: './booking-info-dialog.component.html',
  styleUrl: './booking-info-dialog.component.less'
})
export class BookingInfoDialogComponent {
  public options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };

  constructor(public dialogRef: MatDialogRef<BookingInfoDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { console.log(data) }

  public close(){
    this.dialogRef.close();
  }
}