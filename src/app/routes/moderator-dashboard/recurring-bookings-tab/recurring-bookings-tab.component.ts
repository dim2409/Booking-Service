import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DayNamePipe } from "../../../pipes/day-name.pipe";
import { FiltersComponent } from "../../../components/filters/filters.component";
import { MatOptionModule } from '@angular/material/core';
import { BookingListComponent } from 'src/app/components/booking-list/booking-list.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';

import { BookingsService } from 'src/app/services/bookings/bookings.service';

import { RoomsService } from 'src/app/services/rooms/rooms.service';

@Component({
  selector: 'app-recurring-bookings-tab',
  standalone: true,
  templateUrl: './recurring-bookings-tab.component.html',
  styleUrl: './recurring-bookings-tab.component.less',
  imports: [CommonModule, MatCardModule, DayNamePipe, FiltersComponent, MatTabsModule, BookingListComponent, MatOptionModule, CommonModule, MatExpansionModule, DayNamePipe, MatCardModule, MatButtonModule, MatDatepickerModule, MatPaginatorModule]
})
export class RecurringBookingsTabComponent implements OnInit {
  rooms!: any[];
  
  buttons = [
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

  recurrings: any;
  selectedRoom: any = "";

  dataSource: any[] = [];
  pageSizeOptions: number[] = [10, 25, 50];
  totalItems: number = 0;
  currentPage: number = 1;
  pageSize: number = 10; // Default page size
  roomIds!: any[];

  
  @Output() bookingUpdate: EventEmitter<any> = new EventEmitter<any>();

  constructor(private BookingsService: BookingsService, private RoomsService: RoomsService, ) { }

  ngOnInit(): void {
    this.getData();
    this.getRooms();
  }
  getData() {
    let roomArray: number[] = [];
    this.selectedRoom == "" ? roomArray = [] : roomArray = [this.selectedRoom];
    this.BookingsService.getRecurringBookings({ room_id: roomArray, page: this.currentPage, perPage: this.pageSize, user_id: 2 }).subscribe((resp: any) => {
      this.recurrings = resp.recurrings;      
      this.totalItems = resp.total
    });

  }

  getRooms() {
    this.RoomsService.getModeratedRooms(2).subscribe((resp: any) => {
      this.rooms = resp;
    });
  }
  onPageChange(event: PageEvent): void {
    // Check if the page index has changed
    if (event.pageIndex + 1 !== this.currentPage) {
      this.currentPage = event.pageIndex + 1;
    }

    // Check if the page size has changed
    if (event.pageSize !== this.pageSize) {
      this.pageSize = event.pageSize;
    }
    this.getData();
  }

  updateBooking(event: any) {
    this.bookingUpdate.emit(event);
  }

  filterUpdated(event: any) {
    this.selectedRoom = event;
    this.getData();
  }
}
