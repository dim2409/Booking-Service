import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { BookingListComponent } from 'src/app/booking-list/booking-list.component';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { RoomsService } from 'src/app/services/rooms/rooms.service';
@Component({
  selector: 'app-moderator-dashboard',
  standalone: true,
  imports: [BookingListComponent, MatSelectModule, MatOptionModule, CommonModule],
  templateUrl: './moderator-dashboard.component.html',
  styleUrl: './moderator-dashboard.component.less'
})
export class ModeratorDashboardComponent implements OnInit {

  bookings: any[] = [];
  rooms: any;
  roomIds: any;
  buttons!: any[];
  conflicts!: any[];

  constructor(private BookingsService: BookingsService, private RoomsService: RoomsService) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.RoomsService.getModeratedRooms(4).then((resp: any) => {
      this.buttons = [{
        icon: 'fa-check',
        action: 'updateBookingStatus',
      }]
      this.rooms = resp;
      this.roomIds = this.rooms.map((room: { id: any; }) => room.id);
      this.BookingsService.getAllBookingsByRoom(this.roomIds).then((resp: any) => {
        this.bookings = resp.bookings;
        this.conflicts = resp.conflicts;
        console.log(this.bookings)
        console.log(this.conflicts)
      });
    });

  }

  selectRoom(event: MatSelectChange) {
    const selectedRoom = event.value;
    if (selectedRoom === 'all') {
      this.BookingsService.getAllBookingsByRoom(this.roomIds).then((resp: any) => {
        this.bookings = resp;
      });
    } else {
      const roomArray: number[] = [selectedRoom];
      this.BookingsService.getAllBookingsByRoom(roomArray).then((resp: any) => {
        this.bookings = resp;
      })
    }
  }

  updateBooking() {
    this.BookingsService.getAllBookingsByRoom(this.roomIds).then((resp: any) => {
      this.bookings = resp;
    });
  }
}