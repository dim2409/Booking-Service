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
import { ConflictComponent } from "../../../components/conflict/conflict.component";
import { ControlCardComponent } from "../../../components/control-card/control-card.component";
import { LoadingSpinnerComponent } from "../../../components/loading-spinner/loading-spinner.component";
import { FiltersService } from 'src/app/services/filters/filters.service';
import _ from 'lodash';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
@Component({
    selector: 'app-recurring-conflicts-tab',
    standalone: true,
    templateUrl: './recurring-conflicts-tab.component.html',
    styleUrl: './recurring-conflicts-tab.component.less',
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
        ConflictComponent,
        ControlCardComponent,
        LoadingSpinnerComponent
    ]
})
export class RecurringConflictsTabComponent {
  @Output() bookingUpdate: EventEmitter<any> = new EventEmitter<any>();

  conflicts: any;
  loading!: boolean;
  filters: any;

  constructor(private authService: AuthenticationService, private BookingsService: BookingsService, private RoomsService: RoomsService, private filterService: FiltersService) { }

  chips = [
    { label: 'Day created', value: 'created_at', selected: true, asc: false },
    { label: 'Date', value: 'start', selected: false, asc: false },
  ]

  params =
    {
      pageSizeOptions: [10, 25, 50],
      totalItems: 0
    };

  @ViewChild(ControlCardComponent) controlCard!: ControlCardComponent;


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
    this.RoomsService.getModeratedRooms(this.authService.getUserId()).subscribe((resp: any) => {
      this.rooms = resp;
      this.filters = _.cloneDeep(this.filterService.getFilters(['rooms', 'days'], this.rooms));
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
    this.BookingsService.getRecurringConflicts(this.req).subscribe((resp: any) => {
      this.conflicts = resp.data;
      this.params.totalItems = resp.total
      this.loading = false;
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
