import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CalendarComponentModule } from 'src/app/components/calendar/calendar.component.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { RoomsService } from 'src/app/services/rooms/rooms.service';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { get } from 'lodash';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CalendarComponentModule, MatDialogModule, MatMenuModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less'
})
export class HomeComponent {
  roomIds: any = "";
  date: any;
  bookings: any;
  rooms: any;

  constructor(private BookingsService: BookingsService, private RoomsService: RoomsService, private dialogService: DialogService) { }
  ngOnInit(): void {
    this.RoomsService.getRooms().subscribe((resp: any) => {
      this.rooms = resp;
    });
    this.getBookings();
  }
  selectRoom(event: MatSelectChange) {
    this.roomIds = event.value;
    this.getBookings();
  }
  openInfo(booking: any) {
    this.dialogService.openInfoDialog(booking);
  }

  scrollCalendar(event: any) {
    this.date = event.viewDate;
    this.getBookings();
  }

  getBookings() {
    let roomArray: number[] = [];
    this.roomIds == "" ? roomArray = [] : roomArray = [this.roomIds];
    this.BookingsService.getActiveBookings({ room_id: roomArray, date: this.date }).subscribe((resp: any) => {
      this.bookings = resp;
    });
  }
}
