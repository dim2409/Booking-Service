import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { CardListComponent } from 'src/app/components/card-list/card-list.component';
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
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs';
import { LoadingSpinnerComponent } from "../../../components/loading-spinner/loading-spinner.component";
import { FiltersService } from 'src/app/services/filters/filters.service';

@Component({
  selector: 'app-normal-bookings-tab',
  standalone: true,
  templateUrl: './normal-bookings-tab.component.html',
  styleUrl: './normal-bookings-tab.component.less',
  imports: [
    MatTabsModule,
    CardListComponent,
    MatOptionModule,
    CommonModule,
    MatExpansionModule,
    DayNamePipe,
    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    MatPaginatorModule,
    FiltersComponent,
    ControlCardComponent,
    LoadingSpinnerComponent
  ]
})
export class NormalBookingsTabComponent implements OnInit {




  @Output() bookingUpdate: EventEmitter<any> = new EventEmitter<any>();
  //@Input() rooms!: any;

  @ViewChild(ControlCardComponent) controlCard!: ControlCardComponent;

  pageIndex: number = 0;

  selectCount: number = 0;
  loading!: boolean;
  filters!: any[];
  rooms: any;

  constructor(private BookingsService: BookingsService, private RoomsService: RoomsService, private filterService: FiltersService) { }

  chips = [
    { label: 'Day created', value: 'created_at', selected: true, asc: false },
    { label: 'Alphabetical', value: 'title', selected: false, asc: false },
    { label: 'Date', value: 'start', selected: false, asc: false },
  ]

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

  @ViewChild('roomList') roomList: any;

  ngOnInit(): void {
    this.RoomsService.getModeratedRooms(2).subscribe((resp: any) => {
      this.rooms = resp;
      this.filters = this.filterService.getFilters(['rooms', 'status', 'type', 'months', 'days'], this.rooms);
    })


    this.getData();
  }

  filterUpdated(event: any) {
    this.req = {
      page: 1,
      perPage: 10,
      user_id: 2
    }
    this.req = { ...this.req, ...event }
    this.controlCard.resetPageIndex();
    this.getData();
  }
  getData() {
    this.loading = true;
    this.BookingsService.getBookings(this.req).subscribe((resp: any) => {
      this.bookings = resp.bookings;
      this.params.totalItems = resp.total
      this.loading = false
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
    if (!event.individualAction) {
      selectedBookings = this.bookings
        .filter((booking: any) => booking.selected)
        .map((booking: any) => booking.id);
    } else {
      selectedBookings = event.selectedBookings;
    }
    this.bookingUpdate.emit({ selectedBookings, ...event, type: 'normal' });
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
    if (event.selected) {
      this.req.sortBy = event.value
      this.req.sortOrder = event.asc ? 'asc' : 'desc'
    } else {
      delete this.req.sortBy;
      delete this.req.sortOrder;
    }
    this.req.page = 1;
    this.getData();
  }
}
