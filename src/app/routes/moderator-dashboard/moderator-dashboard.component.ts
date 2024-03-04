import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { BookingListComponent } from 'src/app/booking-list/booking-list.component';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { RoomsService } from 'src/app/services/rooms/rooms.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { DayNamePipe } from "../../pipes/day-name.pipe";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DialogService } from 'src/app/services/dialog/dialog.service';
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
  constructor(private BookingsService: BookingsService, private RoomsService: RoomsService, private dialogService: DialogService) { }

  ngOnInit(): void {
    this.buttons = [{
      icon: 'fa-check',
      action: 'updateBookingStatus',
    },
    {
      icon: 'fa-pencil',
      action: 'editBooking',
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

      this.BookingsService.getRcurringBookings({ room_id: this.roomIds }).subscribe((resp: any) => {
        this.recurrings = resp;
      });

      this.BookingsService.getConflicts({ room_id: this.roomIds }).subscribe((resp: any) => {
        this.conflicts = resp;
      })

    });

  }

  selectRoom(event: MatSelectChange) {
    this.selectedRoom = event.value;
    this.getBookings();
  }
  getBookings() {
    if (this.selectedRoom === 'all') {
      this.BookingsService.getBookings({ room_id: this.roomIds }).subscribe((resp: any) => {
        this.bookings = resp;
      })
      this.BookingsService.getRcurringBookings({ room_id: this.roomIds }).subscribe((resp: any) => {
        this.recurrings = resp;
      });
    } else {
      const roomArray: number[] = [this.selectedRoom];
      this.BookingsService.getBookings({ room_id: roomArray }).subscribe((resp: any) => {
        this.bookings = resp;
      })
      this.BookingsService.getRcurringBookings({ room_id: roomArray }).subscribe((resp: any) => {
        this.recurrings = resp;
      });
    }
  }

  updateBooking(data: any) {
    switch (data.action) {
      case 'updateBookingStatus':
       {
          const idArray : number[] = [data.booking.id]
          this.BookingsService.updateBooking({ id: idArray, status: 1 }).subscribe((resp: any) => {
            this.dialogService.openSuccessDialog('Booking Status Updated');
            this.getBookings();
          })
        }
        break;
      case 'updateRecurring':
          const idArray : number[] = [data.booking.id]
          this.BookingsService.updateRecurring({ id: idArray, status: 1 }).subscribe((resp: any) => {
            this.dialogService.openSuccessDialog('Recurring Booking Status Updated');
            this.getBookings();
          });
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
