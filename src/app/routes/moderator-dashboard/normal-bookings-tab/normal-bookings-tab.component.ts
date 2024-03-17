import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { BookingListComponent } from 'src/app/components/booking-list/booking-list.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { DayNamePipe } from "../../../pipes/day-name.pipe";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { FiltersComponent } from "../../../components/filters/filters.component";

import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { RoomsService } from 'src/app/services/rooms/rooms.service';
import { ControlCardComponent } from "../../../components/control-card/control-card.component";

@Component({
  selector: 'app-normal-bookings-tab',
  standalone: true,
  templateUrl: './normal-bookings-tab.component.html',
  styleUrl: './normal-bookings-tab.component.less',
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
    FiltersComponent,
    ControlCardComponent
  ]
})
export class NormalBookingsTabComponent implements OnInit {


  @Output() bookingUpdate: EventEmitter<any> = new EventEmitter<any>();
  @Input() rooms!: any;

  @ViewChild(ControlCardComponent) controlCard!: ControlCardComponent;

  pageIndex: number = 0;

  selectCount: number = 0;

  constructor(private BookingsService: BookingsService, private RoomsService: RoomsService) { }

  params =
    {
      pageSizeOptions: [10, 25, 50],
      totalItems: 0
    };


  bookings!: any[];

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
    this.req.page = 1;
    this.controlCard.resetPageIndex();   
    this.getData();
  }
  getData() {
    this.BookingsService.getBookings(this.req).subscribe((resp: any) => {
      this.bookings = resp.bookings;
      this.params.totalItems = resp.total
    })
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
    let selectedBookings: any[] = [];
    if(!event.individualAction){
      selectedBookings = this.bookings
      .filter((booking: any) => booking.selected)
      .map((booking: any) => booking.id);
    }else{
      selectedBookings = event.selectedBookings;
    }
    this.bookingUpdate.emit({selectedBookings, ...event, type: 'normal'});
  }

  selectAll(event: any) {
    this.bookings.forEach((booking: any) => {
      booking.selected = event
    })
    this.selectCount = 0
  }
  selectBooking(event: any) {
    if (event) {
      this.selectCount++
    } else {
      this.selectCount--
    }
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
