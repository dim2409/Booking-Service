import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { RoomsService } from 'src/app/services/rooms/rooms.service';
import { FiltersComponent } from "../../components/filters/filters.component";
import { ControlCardComponent } from "../../components/control-card/control-card.component";
import { CardListComponent } from "../../components/card-list/card-list.component";
import { LoadingSpinnerComponent } from "../../components/loading-spinner/loading-spinner.component";
import { PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-room-management',
    standalone: true,
    templateUrl: './room-management.component.html',
    styleUrl: './room-management.component.less',
    imports: [CommonModule ,FiltersComponent, ControlCardComponent, CardListComponent, LoadingSpinnerComponent]
})

export class RoomManagementComponent {
  
  @Output() roomUpdate: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(ControlCardComponent) controlCard!: ControlCardComponent;

  pageIndex: number = 0;

  selectCount: number = 0;
  loading!: boolean;
  chips = [
    {label: 'Day created', value: 'created_at',selected: true, asc: false},
    {label: 'Alphabetical', value: 'title',selected: false, asc: false},
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
      icon: 'fa-pencil',
      action: 'editRoom',
    },
    {
      icon: 'fa-xmark',
      action: 'deleteRoom',
    },
  ]

  req: any = {
    perPage: 10,
    page: 1,
    id: 2
  }
  rooms: any;
  constructor(private RoomService: RoomsService) {
  }

  ngOnInit() {
    this.getData();
  }


  
  filterUpdated(event: any) {
    event.room_id.length > 0 ? this.req.room_id = event.room_id : delete this.req.room_id;
    event.status.length > 0 ? this.req.status = event.status : delete this.req.status;
    event.start.length > 0 ? this.req.start = event.start : delete this.req.start;
    event.days.length > 0 ? this.req.days = event.days : delete this.req.days;
    event.type.length > 0 ? this.req.type = event.type : delete this.req.type;
    this.req.page = 1;
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

  updateRoom(event: any) {
    //this.roomUpdate.emit(event);
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
