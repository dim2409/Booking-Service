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
import { ConflictComponent } from "../../../components/conflict/conflict.component";
@Component({
  selector: 'app-recurring-conflicts-tab',
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
    FiltersComponent,
    ConflictComponent
  ],
  templateUrl: './recurring-conflicts-tab.component.html',
  styleUrl: './recurring-conflicts-tab.component.less'
})
export class RecurringConflictsTabComponent {
  @Output() bookingUpdate: EventEmitter<any> = new EventEmitter<any>();

  conflicts: any;

  constructor(private BookingsService: BookingsService, private RoomsService: RoomsService) { }

  
  pageSizeOptions: number[] = [10, 25, 50];
  totalItems: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
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
    this.BookingsService.getRecurringConflicts(this.req).subscribe((resp: any) => {
      this.conflicts = resp.data;
      this.totalItems = resp.total
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
    this.bookingUpdate.emit(event);
  }
}
