import { Injectable } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookingInfoDialogComponent } from 'src/app/dialogs/booking-info-dialog/booking-info-dialog.component';
import { ConfirmDialogComponent } from 'src/app/dialogs/confirm-dialog/confirm-dialog.component';
import { EditBookingDialogComponent } from 'src/app/dialogs/edit-booking-dialog/edit-booking-dialog.component';
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
      width: "100vw",
      height: "90%",
      maxWidth: "90vw"
    });
    return dialogRef.afterClosed();
  }
  openSuccessDialog(successMessage: string) {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        successMessage: successMessage
      },
      autoFocus: false,
    });
    return dialogRef.afterClosed();
  }

  openConfirmDialog(booking: any, message: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data:{
        booking : booking,
        message: message
      },
      autoFocus: false,
    });    
    return dialogRef.afterClosed();
  }

  openEditBookingDialog(booking: any) {
    const dialogRef = this.dialog.open(EditBookingDialogComponent, {
      data: booking,
      autoFocus: false,
      width: "90vw",
      height: "90%",
    });
    return dialogRef.afterClosed();
  }
}
