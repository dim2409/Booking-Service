import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { RoomsService } from 'src/app/services/rooms/rooms.service';
import { FiltersComponent } from "../../components/filters/filters.component";
import { ControlCardComponent } from "../../components/control-card/control-card.component";
import { CardListComponent } from "../../components/card-list/card-list.component";
import { LoadingSpinnerComponent } from "../../components/loading-spinner/loading-spinner.component";
import { PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { FiltersService } from 'src/app/services/filters/filters.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import _ from 'lodash';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { StatisticsService } from 'src/app/services/statistics/statistics.service';
import { Chart } from 'chart.js/dist';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-room-management',
  standalone: true,
  templateUrl: './room-management.component.html',
  styleUrl: './room-management.component.less',
  imports: [CommonModule, FiltersComponent, ControlCardComponent, CardListComponent, LoadingSpinnerComponent, BaseChartDirective]
})

export class RoomManagementComponent {

  @Output() roomUpdate: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(ControlCardComponent) controlCard!: ControlCardComponent;



  pageIndex: number = 0;

  selectCount: number = 0;
  loading!: boolean;
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

  buttons = [
    {
      icon: 'fa-pencil',
      action: 'editRoom',
    },
    {
      icon: 'fa-trash-alt',
      action: 'deleteRoom',
    },
  ]

  req: any = {
    perPage: 10,
    page: 1,
    id: 2
  }
  rooms: any;
  buildings: any;
  departments: any;
  filters: any;
  roomDayFrequency: any;
  constructor(private _snackBar: MatSnackBar, private RoomService: RoomsService, private statisticsService: StatisticsService, private filterService: FiltersService, private dialogService: DialogService) {
  }
  openSnackBar(message: string, action?: string) {
    this._snackBar.open(message, action ? action : 'Dismiss')._dismissAfter(3000);
  }
  ngOnInit() {
    document.body.classList.remove('body-overflow');
    this.RoomService.getDepartments({ user_id: 2 }).subscribe((resp: any) => {
      this.departments = resp
      this.RoomService.getBuildings({ user_id: 2 }).subscribe((resp: any) => {
        this.buildings = resp
        //this.filters = _.cloneDeep(this.filterService.getRoomFilters(['departments', 'buildings'], this.departments, this.buildings));
      })
    })
    this.getData();

  }

  filterUpdated(event: any) {
    if (event.department.length > 0) {
      this.RoomService.getBuildings({ user_id: 2, department: event.department }).subscribe((resp: any) => {
        this.buildings = resp
        //this.filters = _.cloneDeep(this.filterService.getRoomFilters(['departments', 'buildings'], this.departments, this.buildings));
      })
    }
    this.req = {
      page: 1,
      perPage: 10,
      id: 2
    }
    this.req = { ...this.req, ...event }
    this.controlCard.resetPageIndex();
    this.getData();
  }

  getData() {
    this.loading = true;
    this.RoomService.getRooms(this.req).subscribe((resp: any) => {
      this.rooms = resp.rooms;
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

  addRoom() {
    this.dialogService.openCreateRoomDialog().subscribe((resp: any) => {
      if (resp != false) {
        this.getData();
        this.openSnackBar('Room Added');
      }
    })
  }

  updateRoom(event: any) {
    if (event.action == 'editRoom') {
      this.editRoom(event)
    }
    if (event.action == 'deleteRoom') {
      this.deleteRoom(event)
    }
  }
  editRoom(room: any) {
    this.dialogService.openCreateRoomDialog(room.booking).subscribe((resp: any) => {
      if (resp != false) {
        this.getData();
        this.openSnackBar('Room Updated');
      }
    })
  }

  deleteRoom(event: any) {
    this.dialogService.openConfirmDialog(event.booking,'Are you sure you want to delete this room?').subscribe(res => {
      if (res) {
        this.RoomService.deleteRoom({id:[event.booking.id]}).subscribe((resp: any) => {
          if (resp) {
            this.getData();
            this.openSnackBar('Room Deleted');
          }
        })
      }
    })
  }
}
