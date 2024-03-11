import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import {MatTabsModule} from '@angular/material/tabs';
import { NormalBookingsTabComponent } from "./normal-bookings-tab/normal-bookings-tab.component";
import { RecurringBookingsTabComponent } from "./recurring-bookings-tab/recurring-bookings-tab.component";
@Component({
    selector: 'app-moderator-dashboard',
    standalone: true,
    templateUrl: './moderator-dashboard.component.html',
    styleUrl: './moderator-dashboard.component.less',
    imports: [MatTabsModule, BookingListComponent, MatSelectModule, MatOptionModule, CommonModule, MatExpansionModule, DayNamePipe, MatCardModule, MatButtonModule, MatDatepickerModule, MatPaginatorModule, NormalBookingsTabComponent, RecurringBookingsTabComponent]
})
export class ModeratorDashboardComponent implements OnInit {

  dataSource: any[] = [];
  pageSizeOptions: number[] = [10, 25, 50];
  totalItems: number = 0;
  currentPage: number = 1;
  pageSize: number = 10; // Default page size

  bookings: any[] = [];
  rooms: any;
  roomIds: any;
  buttons!: any[];
  conflictBtn!: any[];
  conflicts!: any[];
  conflictGroups: any;
  selectedRoom: any = "";
  recurringGroups: any;
  recurrings: any;
  recurringConflicts: any;
  constructor(private BookingsService: BookingsService, private RoomsService: RoomsService, private dialogService: DialogService) { }

  @ViewChild (NormalBookingsTabComponent) normalBookingsTab!: NormalBookingsTabComponent;
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

      //this.getBookings();

      this.BookingsService.getConflicts({ room_id: this.roomIds }).subscribe((resp: any) => {
        this.conflicts = resp.conflictingBookings;
        this.recurringConflicts = resp.conflictingRecurrings;
      })

    });

    this.dataSource = this.bookings;

  }
  onPageChange(event: PageEvent): void {
    // Check if the page index has changed
    if (event.pageIndex+1 !== this.currentPage) {
      this.currentPage = event.pageIndex+1;
    }

    // Check if the page size has changed
    if (event.pageSize !== this.pageSize) {
      this.pageSize = event.pageSize;
    }
    this.getBookings();
  }

  selectRoom(event: MatSelectChange) {
    this.selectedRoom = event.value;
    console.log(this.selectedRoom)
    this.getBookings();
  }
  getBookings() {
    let roomArray: number[] = [];
    this.selectedRoom == "" ? roomArray = [] : roomArray = [this.selectedRoom];
    this.BookingsService.getBookings({ room_id: roomArray, page: this.currentPage, perPage: this.pageSize, user_id: 2 }).subscribe((resp: any) => {
      this.bookings = resp.bookings;
      this.totalItems = resp.total
    })
    this.BookingsService.getRecurringBookings({ room_id: roomArray }).subscribe((resp: any) => {
      this.recurrings = resp;
    });

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
                this.updateTabs();
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
              this.updateTabs();
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
            this.updateTabs();
          })
        })
        break;
      case 'openInfo':
        this.dialogService.openInfoDialog(data.booking);
        break;
    }
  }
  updateTabs() {
    this.normalBookingsTab.getData();
  }

  resolveConflict(conflictGroup: any, isRecurring: boolean) {
    this.dialogService.openResolveConflictDialog(conflictGroup, isRecurring).subscribe((resp: any) => {
      if (resp) {
        this.dialogService.openSuccessDialog('Conflict Resolved');
        this.ngOnInit();
      }
    })
  }
}
