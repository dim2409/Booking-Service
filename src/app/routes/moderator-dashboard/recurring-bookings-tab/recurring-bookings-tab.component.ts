import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DayNamePipe } from "../../../pipes/day-name.pipe";
import { FiltersComponent } from "../../../components/filters/filters.component";
import { MatOptionModule } from '@angular/material/core';
import { BookingListComponent } from 'src/app/components/booking-list/booking-list.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
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
  @Input() rooms!: any[];
  
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
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  req: any = {
    page: 1,
    perPage: 10,
    user_id: 2
  }
  ngOnInit(): void {
    this.getData();
  }

  filterUpdated(event: any) {
    this.req.room_id = event.room_id;
    this.req.status = event.status;
    this.req.start = event.start;
    this.req.page = 1;
    this.paginator.pageIndex = 0
    this.getData();
  }
  getData() {
    this.BookingsService.getRecurringBookings(this.req).subscribe((resp: any) => {
      this.recurrings = resp.recurrings;      
      this.totalItems = resp.total
    });

  }
  onPageChange(event: PageEvent): void {
    // Check if the page index has changed
    if (event.pageIndex + 1 !== this.req.page) {
      this.req.page = event.pageIndex + 1;
    }

    // Check if the page size has changed
    if (event.pageSize !== this.req.perPage) {
      this.req.perPage = event.pageSize;
    }
    this.getData();
  }

  updateBooking(event: any) {
    this.bookingUpdate.emit(event);
  }

}