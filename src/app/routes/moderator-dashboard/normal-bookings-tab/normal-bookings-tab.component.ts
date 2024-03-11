import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { BookingListComponent } from 'src/app/components/booking-list/booking-list.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { DayNamePipe } from "../../../pipes/day-name.pipe";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { FiltersComponent } from "../../../components/filters/filters.component";

import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { RoomsService } from 'src/app/services/rooms/rooms.service';

@Component({
  selector: 'app-normal-bookings-tab',
  standalone: true,
  templateUrl: './normal-bookings-tab.component.html',
  styleUrl: './normal-bookings-tab.component.less',
  imports: [MatTabsModule, BookingListComponent, MatOptionModule, CommonModule, MatExpansionModule, DayNamePipe, MatCardModule, MatButtonModule, MatDatepickerModule, MatPaginatorModule, FiltersComponent]
})
export class NormalBookingsTabComponent implements OnInit {

  
  @Output() bookingUpdate: EventEmitter<any> = new EventEmitter<any>();

  roomIds!: any[];
  constructor(private BookingsService: BookingsService, private RoomsService: RoomsService, private dialogService: DialogService) { }

  selectedRoom: any = "";

  pageSizeOptions: number[] = [10, 25, 50];
  totalItems: number = 0;
  currentPage: number = 1;
  pageSize: number = 10; // Default page size
  bookings!: any[];

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

  getRooms() {
    this.RoomsService.getModeratedRooms(2).subscribe((resp: any) => {
      this.rooms = resp;
      this.roomIds = this.rooms.map((room: { id: any; }) => room.id);
    });
  }
  getData() {
    let roomArray: number[] = [];
    this.selectedRoom == "" ? roomArray = [] : roomArray = [this.selectedRoom];
    this.BookingsService.getBookings({ room_id: roomArray, page: this.currentPage, perPage: this.pageSize, user_id: 2 }).subscribe((resp: any) => {
      this.bookings = resp.bookings;
      this.totalItems = resp.total
    })
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

  updateBooking(event: Event) {
    this.bookingUpdate.emit(event);
  }
}
