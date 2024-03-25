import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DayNamePipe } from "../../../pipes/day-name.pipe";
import { FiltersComponent } from "../../../components/filters/filters.component";
import { MatOptionModule } from '@angular/material/core';
import { CardListComponent } from 'src/app/components/card-list/card-list.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';

import { BookingsService } from 'src/app/services/bookings/bookings.service';

import { RoomsService } from 'src/app/services/rooms/rooms.service';
import { ControlCardComponent } from "../../../components/control-card/control-card.component";
import { LoadingSpinnerComponent } from "../../../components/loading-spinner/loading-spinner.component";
import { FiltersService } from 'src/app/services/filters/filters.service';

@Component({
  selector: 'app-recurring-bookings-tab',
  standalone: true,
  templateUrl: './recurring-bookings-tab.component.html',
  styleUrl: './recurring-bookings-tab.component.less',
  imports: [CommonModule, MatCardModule, DayNamePipe, FiltersComponent, MatTabsModule, CardListComponent, MatOptionModule, CommonModule, MatExpansionModule, DayNamePipe, MatCardModule, MatButtonModule, MatDatepickerModule, MatPaginatorModule, ControlCardComponent, LoadingSpinnerComponent]
})
export class RecurringBookingsTabComponent implements OnInit {
  @Input() rooms!: any[];


  chips = [
    { label: 'Day created', value: 'created_at', selected: true, asc: false },
    { label: 'Date', value: 'start', selected: false, asc: false },
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

  @Output() bookingUpdate: EventEmitter<any> = new EventEmitter<any>();

  selectCount: number = 0;
  loading!: boolean;
  filters: any;

  constructor(private BookingsService: BookingsService, private RoomsService: RoomsService, private filterService: FiltersService, private dialogService: DialogService) { }


  @ViewChild(ControlCardComponent) controlCard!: ControlCardComponent;


  req: any = {
    page: 1,
    perPage: 10,
    user_id: 2
  }
  ngOnInit(): void {
    this.RoomsService.getModeratedRooms(2).subscribe((resp: any) => {
      this.rooms = resp;
      this.filters = this.filterService.getFilters(['rooms', 'status', 'days'], this.rooms);
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
    this.loading = true
    this.BookingsService.getRecurringBookings(this.req).subscribe((resp: any) => {
      this.recurrings = resp.recurrings;
      this.params.totalItems = resp.total
      this.loading = false
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
    let selectedBookings: any[] = [];
    if (!event.individualAction) {
      selectedBookings = this.recurrings
        .filter((booking: any) => booking.selected)
        .map((booking: any) => booking.id);
    } else {
      selectedBookings = event.selectedBookings;
    }
    this.bookingUpdate.emit({ selectedBookings, ...event, type: 'recurringGroup' });
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

  toggleSelect(booking: any) {
    booking.selected = !booking.selected;
    this.selectBooking(booking.selected)
  }
  selectBooking(event: any) {
    if (event) {
      this.selectCount++
    } else {
      this.selectCount--
    }
  }

  selectAll(event: any) {
    this.recurrings.forEach((booking: any) => {
      booking.selected = event
    })
    this.selectCount = 0
  }
  add() {
    this.dialogService.openEditBookingDialog({rooms:this.rooms, recurringCheck: true}).subscribe((resp: any) => {
      if(resp){
        this.BookingsService.createBooking(resp).subscribe((resp: any) => {
          this.getData();
        })
      }
    })
  }
}