import { Injectable } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookingInfoDialogComponent } from 'src/app/dialogs/booking-info-dialog/booking-info-dialog.component';
import { SuccessDialogComponent } from 'src/app/dialogs/success-dialog/success-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openInfoDialog(booking: any) {
    const dialogRef = this.dialog.open(BookingInfoDialogComponent, {
      data: booking,
      autoFocus: false,
      width: "90vw",
      height: "90%",
      maxWidth: "90vw"
    });
    return dialogRef.afterClosed();
  }
  openSuccessDialog(successMessage: string) {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        successMessage: successMessage
      }
    });
    return dialogRef.afterClosed();
  }
}
