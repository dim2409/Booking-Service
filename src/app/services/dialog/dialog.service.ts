import { Injectable } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookingInfoDialogComponent } from 'src/app/dialogs/booking-info-dialog/booking-info-dialog.component';
import { ConfirmDialogComponent } from 'src/app/dialogs/confirm-dialog/confirm-dialog.component';
import { CreateRoomDialogComponent } from 'src/app/dialogs/create-room-dialog/create-room-dialog.component';
import { CreateSemesterDialogComponent } from 'src/app/dialogs/create-semester-dialog/create-semester-dialog.component';
import { BookingFormDialogComponent } from 'src/app/dialogs/edit-booking-dialog/booking-form-dialog.component';
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
      width: "40vw",
      height: "60%",
      maxWidth: "40vw",
      disableClose: true,
      hasBackdrop: false
    });
    return dialogRef.afterClosed();
  }
  openSuccessDialog(successMessage: string) {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        successMessage: successMessage
      },
      autoFocus: false,
      disableClose: true,
    });
    return dialogRef.afterClosed();
  }

  openConfirmDialog(booking: any, message: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        booking: booking,
        message: message
      },
      autoFocus: false,
      disableClose: true,
    });
    return dialogRef.afterClosed();
  }

  openBookingFormDialog(booking: any) {
    const dialogRef = this.dialog.open(BookingFormDialogComponent, {
      data: booking,
      autoFocus: false,
      width: "90vw",
      height: "90%",
      maxWidth: "35vw",
      disableClose: true,
      hasBackdrop: false
    });
    return dialogRef.afterClosed();
  }
  openCreateRoomDialog(room?: any) {
    const dialogRef = this.dialog.open(CreateRoomDialogComponent, {
      data:room,
      autoFocus: false,
      width: "33vw",
      height: "65%",
      disableClose: true,
    });
    return dialogRef.afterClosed();
  }
  openCreateSemesterDialog(semester?: any) {
    const dialogRef = this.dialog.open(CreateSemesterDialogComponent, {
      data:semester,
      autoFocus: false,
      width: "33vw",
      height: "40%",
      disableClose: true,
    });
    return dialogRef.afterClosed();
  }
}
