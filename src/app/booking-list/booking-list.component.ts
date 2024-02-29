import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { BookingInfoDialogComponent } from 'src/app/dialogs/booking-info-dialog/booking-info-dialog.component';
import { CalendarEvent } from 'angular-calendar';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatDividerModule, MatButtonModule, MatProgressBarModule, MatDialogModule],
  templateUrl: './booking-list.component.html',
  styleUrl: './booking-list.component.less'
})
export class BookingListComponent {
  public options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  alert(arg0: string) {
    alert(arg0)
  }

  @Output() bookingUpdated: EventEmitter<any> = new EventEmitter<any>();

  @Input() bookings: any[] = [];
  @Input() rooms: any[] = [];
  @Input() buttons: any[] = [];
  @Input() removeConflicts: boolean = false;
  constructor(private BookingsService: BookingsService, private dialog: MatDialog) { }
  

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


  buttonAction(action: string, booking: any) {
    if (action == 'updateBookingStatus') {
      this.BookingsService.updateBookingStatus(booking.id, 1).subscribe((resp: any) => {
        this.alert('Booking Status '+resp.title+' Updated');
        this.bookingUpdated.emit();
      })
    }else if(action == 'openInfo'){
      this.openInfoDialog(booking);
    }else{
      //TODO: Implement button actions
    }
  }
}
