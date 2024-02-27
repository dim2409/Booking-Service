import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { BookingListComponent } from 'src/app/booking-list/booking-list.component';

import { BookingsService } from 'src/app/services/bookings/bookings.service';
@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatDividerModule, MatButtonModule, MatProgressBarModule, MatDialogModule, BookingListComponent],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.less'
})

export class MyBookingsComponent implements OnInit {  
  userId: number = 3;
  bookings!: any;
  buttons: any;
  
  constructor(private BookingsService: BookingsService,) { }
  
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
}
