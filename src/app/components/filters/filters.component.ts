import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatChipListbox, MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import moment from 'moment';
import { RoomsService } from 'src/app/services/rooms/rooms.service';
import { MatRippleModule } from '@angular/material/core';
import { Observable } from 'rxjs';
import { ScreenSizeService } from 'src/app/services/screenSize/screen-size.service';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule,
    MatSelectModule,
    MatChipsModule,
    MatCardModule,
    MatRippleModule,
    MatButtonModule
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.less'
})
export class FiltersComponent implements OnInit {
  isMobile$!: Observable<boolean>;

  @Output() filterUpdated: EventEmitter<any> = new EventEmitter<any>();

  @Input() filters!: any;
  
  @Input() filterControlFlag!: any;
  isOpen: boolean = true;

  constructor(private roomService: RoomsService, private screenSizeService: ScreenSizeService, public sidebarService: SidebarService) { 
    this.isMobile$ = this.screenSizeService.isMobile$;

  }

  req: { [key: string]: any[]; } = {};

  ngOnInit(): void {
    
  }
  selectRoom(event: MatSelectChange) {
    this.filterUpdated.emit(event.value);
  }
  toggleSelect(chip: any, list: any, field: any) {
    chip.selected = !chip.selected;
    this.updateChips(list,field);
  }
  updateChips(list: any[], field: any) {
    const filteredList = list.filter((x: any) => x.selected);
    if(filteredList.length > 0) {
      this.req[field]=[]
      filteredList.forEach((x: any) => {
        this.req[field].push(x.id)
      })
    }
    else{
      delete this.req[field];
    }
    this.filterUpdated.emit(this.req);
  }

  filterControl(chips: any[], field: any) {
    chips.forEach((x) => {
      x.selected = false
    })
    this.updateChips(chips,field);
  }
  toggleSidebar() {
    this.isOpen = !this.isOpen
    this.sidebarService.toggleFilterSidebar();
  }
}
