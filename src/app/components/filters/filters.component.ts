import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatChipListbox, MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import moment from 'moment';
import { RoomsService } from 'src/app/services/rooms/rooms.service';
@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule,
    MatSelectModule,
    MatChipsModule,
    MatCardModule,
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.less'
})
export class FiltersComponent implements OnInit {
  @Output() filterUpdated: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('roomList') roomList!: MatChipListbox;
  @ViewChild('statusList') statusList!: MatChipListbox;
  @ViewChild('typeList') typeList!: MatChipListbox;
  @ViewChild('dateList') dateList!: MatChipListbox;
  @ViewChild('dayList') daylist!: MatChipListbox;

  @Input() status!: boolean;
  @Input() type!: boolean;
  @Input() monthsFilter!: boolean;
  @Input() daysFilter!: boolean;

  statusChips!: { label: string; selected: boolean; value: number; }[];
  typeChips!: { label: string; selected: boolean; value: string; }[];
  months: any = [
    {
      label: 'JAN',
      value: 1
    },
    {
      label: 'FEB',
      value: 2
    },
    {
      label: 'MAR',
      value: 3
    },
    {
      label: 'APR',
      value: 4
    },
    {
      label: 'MAY',
      value: 5
    },
    {
      label: 'JUN',
      value: 6
    },
    {
      label: 'JUL',
      value: 7
    },
    {
      label: 'AUG',
      value: 8
    },
    {
      label: 'SEP',
      value: 9
    },
    {
      label: 'OCT',
      value: 10
    },
    {
      label: 'NOV',
      value: 11
    },
    {
      label: 'DEC',
      value: 12
    },
  ];
  dayChips!: { label: string; selected: boolean; value: number; }[];
  roomChips: any;

  constructor(private roomService: RoomsService) { }


  ngOnInit(): void {
    this.roomService.getRooms().subscribe((data: any) => {
      this.roomChips = data;
    })
    if (this.status) {
      this.statusChips = [
        {
          label: 'Pending',
          selected: false,
          value: 0
        },
        {
          label: 'Active',
          selected: false,
          value: 1
        },
        {
          label: 'Cancelled',
          selected: false,
          value: 2
        }
      ]
    }
    if (this.type) {
      this.typeChips = [
        {
          label: 'Normal',
          selected: false,
          value: 'normal'
        },
        {
          label: 'Recurring',
          selected: false,
          value: 'recurring'
        },
      ]
    }
    if(this.daysFilter){
      this.dayChips = [
        {
          label: 'Monday',
          selected: false,
          value: 1
        },
        {
          label: 'Tuesday',
          selected: false,
          value: 2
        },
        {
          label: 'Wednesday',
          selected: false,
          value: 3
        },
        {
          label: 'Thursday',
          selected: false,
          value: 4
        },
        {
          label: 'Friday',
          selected: false,
          value: 5
        },        
      ]
    }
  }
  selectRoom(event: MatSelectChange) {
    this.filterUpdated.emit(event.value);
  }
  toggleSelect(chip: any) {
    console.log(chip)
    chip.selected = !chip.selected;
    this.updateChips();
  }
  updateChips() {
    console.log(this.typeList?.value)
    let req = {
      room_id: this.roomList?.value ?? '',
      start: this.dateList?.value ?? '',
      status: this.statusList?.value ?? '',
      days: this.daylist?.value ?? '',
      type: this.typeList?.value ?? '',
    }
    this.filterUpdated.emit(req);
  }

  filterControl(chips: any[], list: any) {
    chips.forEach((x) => {
      x.selected = false
    })
    list.value = [];
    this.updateChips();
  }

}
