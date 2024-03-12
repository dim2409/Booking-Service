import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { BookingListComponent } from 'src/app/components/booking-list/booking-list.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { DayNamePipe } from "../../../pipes/day-name.pipe";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { FiltersComponent } from "../../../components/filters/filters.component";

import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { RoomsService } from 'src/app/services/rooms/rooms.service';
@Component({
  selector: 'app-conflicting-bookings-tab',
  standalone: true,
  imports: [
    MatTabsModule, 
    BookingListComponent, 
    MatOptionModule, 
    CommonModule, 
    MatExpansionModule, 
    DayNamePipe, 
    MatCardModule, 
    MatButtonModule, 
    MatDatepickerModule, 
    MatPaginatorModule, 
    FiltersComponent
  ],
  templateUrl: './conflicting-bookings-tab.component.html',
  styleUrl: './conflicting-bookings-tab.component.less'
})
export class ConflictingBookingsTabComponent {

  @Output() bookingUpdate: EventEmitter<any> = new EventEmitter<any>();
  conflicts: any;
  recurringConflicts: any;

  constructor(private BookingsService: BookingsService, private RoomsService: RoomsService) { }

  
  pageSizeOptions: number[] = [10, 25, 50];
  totalItems: number = 0;
  currentPage: number = 1;
  pageSize: number = 10; // Default page size
  selectedRoom: any = "";
  
  recurringPageSizeOptions: number[] = [10, 25, 50];
  recurringTotalItems: number = 0;
  recurringCurrentPage: number = 1;
  recurringPageSize: number = 10; // Default page size
  recurringSelectedRoom: any = "";

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

  ngOnInit(): void {
    this.getRooms();
    this.getData();
  }

  filterUpdated(event: any) {
    this.selectedRoom = event;
    this.getData();
  }

  getData() {
    let roomArray: number[] = [];
    this.selectedRoom == "" ? roomArray = [] : roomArray = [this.selectedRoom];
    this.BookingsService.getConflicts({  room_id: roomArray, page: this.currentPage, perPage: this.pageSize, user_id: 2 }).subscribe((resp: any) => {
      this.conflicts = resp.data;      
      this.totalItems = resp.total
    })
    this.BookingsService.getRecurringConflicts({  room_id: roomArray, page: this.recurringCurrentPage, perPage: this.recurringPageSize, user_id: 2 }).subscribe((resp: any) => {
      this.recurringConflicts = resp.data;
      this.recurringTotalItems = resp.total
    })
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
  onRecurringPageChange(event: PageEvent): void {
    // Check if the page index has changed
    if (event.pageIndex + 1 !== this.recurringCurrentPage) {
      this.recurringCurrentPage = event.pageIndex + 1;
    }

    // Check if the page size has changed
    if (event.pageSize !== this.recurringPageSize) {
      this.recurringPageSize = event.pageSize;
    }
    this.getData();
  }

  updateBooking(event: any) {
    this.bookingUpdate.emit(event);
  }
}
