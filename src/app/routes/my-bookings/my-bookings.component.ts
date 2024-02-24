import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { BookingInfoDialogComponent } from 'src/app/dialogs/booking-info-dialog/booking-info-dialog.component';

import { BookingsService } from 'src/app/services/bookings/bookings.service';
@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatDividerModule, MatButtonModule, MatProgressBarModule, MatDialogModule],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.less'
})

export class MyBookingsComponent implements OnInit {
  public options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  alert(arg0: string) {
    alert(arg0)
  }
  userId: number = 1;
  bookings!: any;
  constructor(private BookingsService: BookingsService, private dialog: MatDialog) { }
  ngOnInit(): void {
    this.BookingsService.getUserBookings(this.userId).then((resp: any) => {
      this.bookings = resp;
    });
    console.log(this.bookings);
  }

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
}
