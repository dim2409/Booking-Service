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
constructor(public dialogRef: MatDialogRef<BookingInfoDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { console.log(data) }
}
