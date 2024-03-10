import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { BookingListComponent } from 'src/app/components/booking-list/booking-list.component';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { RoomsService } from 'src/app/services/rooms/rooms.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { DayNamePipe } from "../../pipes/day-name.pipe";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
@Component({
  selector: 'app-moderator-dashboard',
  standalone: true,
  templateUrl: './moderator-dashboard.component.html',
  styleUrl: './moderator-dashboard.component.less',
  imports: [BookingListComponent, MatSelectModule, MatOptionModule, CommonModule, MatExpansionModule, DayNamePipe, MatCardModule, MatButtonModule, MatDatepickerModule]
})
export class ModeratorDashboardComponent implements OnInit {

  bookings: any[] = [];
  rooms: any;
  roomIds: any;
  buttons!: any[];
  conflictBtn!: any[];
  conflicts!: any[];
  conflictGroups: any;
  selectedRoom: any = 'all';
  recurringGroups: any;
  recurrings: any;
  recurringConflicts: any;
  constructor(private BookingsService: BookingsService, private RoomsService: RoomsService, private dialogService: DialogService) { }

  ngOnInit(): void {
    this.buttons = [
      {
        icon: 'fa-expand',
        action: 'openInfo',
      },
      {
        icon: 'fa-check',
        action: 'approveBooking',
      },
      {
        icon: 'fa-pencil',
        action: 'editBooking',
      },
      {
        icon: 'fa-xmark',
        action: 'cancelBooking',
      },
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
        this.conflicts = resp.conflictingBookings;
        this.recurringConflicts = resp.conflictingRecurrings;
        console.log(this.recurringConflicts)
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
      case 'approveBooking':
        {
          this.dialogService.openConfirmDialog(data.booking, 'Are you sure you want to confirm this booking?').subscribe((resp: any) => {
            if (resp) {
              const idArray: number[] = [data.booking.id]
              this.BookingsService.approveBooking({ id: idArray, type: data.booking.type }).subscribe((resp: any) => {
                this.dialogService.openSuccessDialog('Booking Status Updated');
                this.getBookings();
              })
            }
          })
        }
        break;
      case 'editBooking':
        this.dialogService.openEditBookingDialog(data.booking).subscribe((resp: any) => {
          if (resp) {
            this.BookingsService.editBooking(resp).subscribe((resp: any) => {
              this.dialogService.openSuccessDialog('Booking Updated');
              this.getBookings();
            })
          }
        });
        break;
      case 'cancelBooking':
        this.dialogService.openConfirmDialog(data.booking, 'Are you sure you want to cancel this booking?').subscribe((resp: any) => {
          if (!resp) { return; }
          const idArray: number[] = [data.booking.id]

          this.BookingsService.cancelBooking({ id: idArray, type: data.booking.type }).subscribe((resp: any) => {
            this.dialogService.openSuccessDialog('Booking Canceled');
            this.getBookings();
          })
        })
        break;
      case 'openInfo':
        this.dialogService.openInfoDialog(data.booking);
        break;
    }
  }

  resolveConflict(conflictGroup: any) {
    this.dialogService.openResolveConflictDialog(conflictGroup).subscribe((resp: any) => {
      if (resp) {
        this.dialogService.openSuccessDialog('Conflict Resolved');
        this.getBookings();
        this.ngOnInit();
      }
    })
  }
}
