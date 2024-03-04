import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { BookingListComponent } from 'src/app/booking-list/booking-list.component';

import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatDividerModule, MatButtonModule, MatProgressBarModule, BookingListComponent],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.less'
})

export class MyBookingsComponent implements OnInit {  
  userId: number = 4;
  bookings!: any;
  buttons: any;
  
  constructor(private BookingsService: BookingsService, private dialogService: DialogService) { }
  
  ngOnInit(): void {
    this.buttons = [
    {
      icon: 'fa-pencil',
      action: 'updateBooking',
    },
    {
      icon: 'fa-trash',
      action: 'deleteBooking',
    },
    {
      icon: 'fa-expand',
      action: 'openInfo',
    }
    ]
    this.BookingsService.getUserBookings(this.userId).then((resp: any) => {
      this.bookings = resp;
    });
  }  
  updateBooking(data: any) {
    switch (data.action) {
      case 'updateBookingStatus':
        //Todo make update booking status dialog + service + endpoint
        break;
      case 'updateRecurring':
        //Todo make update recurring booking dialog + service + endpoint
        break;
      case 'editBooking':
        //Todo make edit booking dialog + service + endpoint
        break;
      case 'deleteBooking':
        //Todo make delete/reject booking dialog + service + endpoint
        break;
      case 'openInfo':
        this.dialogService.openInfoDialog(data.booking);
        break;

    }
  }
}
