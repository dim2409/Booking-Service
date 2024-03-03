import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { BookingListComponent } from 'src/app/booking-list/booking-list.component';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { RoomsService } from 'src/app/services/rooms/rooms.service';

import { MatExpansionModule } from '@angular/material/expansion';
import { DayNamePipe } from "../../pipes/day-name.pipe";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-moderator-dashboard',
  standalone: true,
  templateUrl: './moderator-dashboard.component.html',
  styleUrl: './moderator-dashboard.component.less',
  imports: [BookingListComponent, MatSelectModule, MatOptionModule, CommonModule, MatExpansionModule, DayNamePipe, MatCardModule, MatButtonModule]
})
export class ModeratorDashboardComponent implements OnInit {

  bookings: any[] = [];
  rooms: any;
  roomIds: any;
  buttons!: any[];
  conflicts!: any[];
  conflictGroups: any;
  selectedRoom: any = 'all';
  recurringGroups: any;
  recurrings: any;
  constructor(private BookingsService: BookingsService, private RoomsService: RoomsService) { }

  ngOnInit(): void {
    this.buttons = [{
      icon: 'fa-check',
      action: 'updateBookingStatus',
    },
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
    this.RoomsService.getModeratedRooms(2).subscribe((resp: any) => {
      this.rooms = resp;
      this.roomIds = this.rooms.map((room: { id: any; }) => room.id);

      this.BookingsService.getBookings({ room_id: this.roomIds }).subscribe((resp: any) => {
        this.bookings = resp;
      })

      this.BookingsService.getRcurringBookings(this.roomIds).subscribe((resp: any) => {
        this.recurrings = resp;
      });
    });

  }

  //ToDo move to list along with all recuirring and handle button event action here
  buttonAction(arg0: any, arg1: any) {
    throw new Error('Method not implemented.');
  }

  selectRoom(event: MatSelectChange) {
    this.selectedRoom = event.value;
    this.updateBooking();
  }

  updateBooking() {
    if (this.selectedRoom === 'all') {
      this.BookingsService.getBookings({ room_id: this.roomIds }).subscribe((resp: any) => {
        this.bookings = resp;
      })
    } else {
      const roomArray: number[] = [this.selectedRoom];
      this.BookingsService.getBookings({ room_id: roomArray }).subscribe((resp: any) => {
        this.bookings = resp;
      })
    }
  }
}
