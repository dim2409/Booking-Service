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
import { ControlCardComponent } from "../../../components/control-card/control-card.component";

@Component({
    selector: 'app-recurring-bookings-tab',
    standalone: true,
    templateUrl: './recurring-bookings-tab.component.html',
    styleUrl: './recurring-bookings-tab.component.less',
    imports: [CommonModule, MatCardModule, DayNamePipe, FiltersComponent, MatTabsModule, BookingListComponent, MatOptionModule, CommonModule, MatExpansionModule, DayNamePipe, MatCardModule, MatButtonModule, MatDatepickerModule, MatPaginatorModule, ControlCardComponent]
})
export class RecurringBookingsTabComponent implements OnInit {
  @Input() rooms!: any[];
  

  chips = [
    {label: 'Day created', value: 'created_at',selected: true, asc: false},
    {label: 'Date', value: 'start',selected: false, asc: false},
  ]

  params =
    {
      pageSizeOptions: [10, 25, 50],
      totalItems: 0
    };

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
  
  
  @ViewChild(ControlCardComponent) controlCard!: ControlCardComponent;


  req: any = {
    page: 1,
    perPage: 10,
    user_id: 2
  }
  ngOnInit(): void {
    this.getData();
  }

  filterUpdated(event: any) {
    event.room_id !== '' ? this.req.room_id = event.room_id : delete this.req.room_id;
    event.status !== '' ? this.req.status = event.status : delete this.req.status;
    event.start !== '' ? this.req.start = event.start : delete this.req.start;
    event.days !== '' ? this.req.days = event.days : delete this.req.days;
    this.req.page = 1;
    this.controlCard.resetPageIndex(); 
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

  sorterUpdated(event: any) {
    if(event.selected){
      this.req.sortBy = event.value
      this.req.sortOrder = event.asc ? 'asc' : 'desc'
    }else{
      delete this.req.sortBy;
      delete this.req.sortOrder;
    }    
    this.req.page = 1;     
    this.getData();
  }

}