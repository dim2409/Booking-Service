import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CalendarComponentModule } from 'src/app/components/calendar/calendar.component.module';
import { DemoModule } from 'src/app/mwl-demo-component/mwl-demo-component.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { RoomsService } from 'src/app/services/rooms/rooms.service';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, DemoModule, CalendarComponentModule, MatDialogModule, MatMenuModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less'
})
export class HomeComponent {
  selectRoom(event: MatSelectChange) {
    const selectedRoom = event.value;
    if (selectedRoom === 'all') {
      this.BookingsService.getActiveBookings().then((resp: any) => {
        this.bookings = resp;
      });
    }else{
      this.BookingsService.getBookingByRoom(selectedRoom).then((resp: any) => {
        this.bookings = resp;
      })
    }
  }
  bookings: any;
  rooms: any;

  constructor(private BookingsService: BookingsService, private RoomsService: RoomsService) { }
  ngOnInit(): void {
    this.BookingsService.getActiveBookings().then((resp: any) => {
      this.bookings = resp;
      console.log(this.bookings);
    });
    this.RoomsService.getRooms().then((resp: any) => {
      this.rooms = resp;
      console.log(this.rooms);
    });
  }
}
