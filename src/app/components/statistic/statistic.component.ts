import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDateRangeInput, MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelect, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { ChartConfiguration, ChartData } from 'chart.js';
import { tr } from 'date-fns/locale';
import { BaseChartDirective } from 'ng2-charts';
import { Observable } from 'rxjs';
import { GeneralRequestService } from 'src/app/services/general/general-request.service';
import { RoomsService } from 'src/app/services/rooms/rooms.service';
import { StatisticsService } from 'src/app/services/statistics/statistics.service';

@Component({
  selector: 'app-statistic',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    BaseChartDirective,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatDateRangeInput,
    MatButtonModule,
    MatMenuModule,
    MatCheckboxModule,
  ],
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.less'
})
export class StatisticComponent implements OnInit {

  @ViewChild(BaseChartDirective) barChart: BaseChartDirective | undefined;

  @ViewChild('roomSelect') roomSelect?: MatSelect;
  @ViewChild('singleRoomSelect') singleRoomSelect?: MatSelect;
  @ViewChild('daySelect') daySelect?: MatSelect;
  @ViewChild('monthSelect') monthSelect?: MatSelect;
  @ViewChild('semesterSelect') semesterSelect?: MatSelect;

  public max = 100;
  public chartOptions: any['options'] = {
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 0,
        //max: this.max
      },
    },
    plugins: {
      legend: {
        display: true,
      }
    },
    //barThickness:,
    tension: 0.4,
    maintainAspectRatio: false,
    responsive: true
  };


  public chartData: ChartData = {
    labels: [],
    datasets: [
      {
        label: 'Sample Chart', data: [], backgroundColor: [], borderColor: [],
      },
    ],
  };

  public chartType: any = 'line';
  dayOptions: { label: string, value: number , checked: boolean}[] = [
    { label: 'Monday', value: 1 , checked: false},
    { label: 'Tuesday', value: 2 , checked: false},
    { label: 'Wednesday', value: 3 , checked: false},
    { label: 'Thursday', value: 4 , checked: false},
    { label: 'Friday', value: 5 , checked: false},
  ];

  monthOptions: { label: string, value: number , checked: boolean}[] = [
    { label: 'January', value: 1 , checked: false},
    { label: 'February', value: 2 , checked: false},
    { label: 'March', value: 3 , checked: false},
    { label: 'April', value: 4 , checked: false},
    { label: 'May', value: 5 , checked: false},
    { label: 'June', value: 6 , checked: false},
    { label: 'July', value: 7 , checked: false},
    { label: 'August', value: 8 , checked: false},
    { label: 'September', value: 9 , checked: false},
    { label: 'October', value: 10 , checked: false},
    { label: 'November', value: 11 , checked: false},
    { label: 'December', value: 12 , checked: false},
  ];

  rooms: any[] = [];
  semesters: any[] = [];
  types: any[] = [
    { label: 'Lecture', value: 'lecture', checked: false },
    { label: 'Teleconference', value: 'teleconference', checked: false },
    { label: 'Seminar', value: 'seminar', checked: false },
    { label: 'Other', value: 'other', checked: false }
  ];
  statOptions: { typePicker?: boolean, roomPicker?: boolean, singleRoomPicker?: boolean, daypicker?: boolean, label: string, value: string, semesterPicker?: boolean; monthPicker?: boolean, datePicker?: boolean, }[] = [];
  req: {
    days: any[];
    months: any[];
    semesterIds: any[];
    lecture_type: any[];
    roomIds: any[];
    singleRoomId: any;
    dateRange: {
      start: any;
      end: any;
    };
  } = {
    days: [],
    months: [],
    semesterIds: [],
    lecture_type: [],
    roomIds: [],
    singleRoomId: '',
    dateRange: {
      start: '',
      end: ''
    }
  };
  datasets: { data: any; backgroundColor: any; label: any; borderColor: any; }[] = []
  frequencyData: any[] = [];
  percentageData: any[] = [];
  toggleFrequencyFlag: boolean = false;

  selectedAction = ''
  public roomPicker = false;
  public singleRoomPicker = false;
  public daypicker = false;
  public monthPicker = false;
  public semesterPicker = false;
  public typePicker = false;
  public datePicker = false;
  constructor(private RoomsService: RoomsService, private statisticsService: StatisticsService, private generalRequestService: GeneralRequestService) {

  }
  ngOnInit(): void {
    this.statOptions = this.statisticsService.getActions();
    this.generalRequestService.getSemesters({}).subscribe((resp: any) => {
      this.semesters = resp.data;
    });
    this.RoomsService.getAllRooms().subscribe((resp: any) => {
      this.rooms = resp
    })
  }
  getData() {
    this.statisticsService.callAction(this.selectedAction, this.req).subscribe((resp: any) => {
      this.udpateChart(resp)
    })
  }
  chartOptionChange(action: any) {
    this.roomSelect ? this.roomSelect.value = null : null;
    this.singleRoomSelect ? this.singleRoomSelect.value = null : null;
    this.daySelect ? this.daySelect.value = null : null;
    this.monthSelect ? this.monthSelect.value = null : null;
    this.semesterSelect ? this.semesterSelect.value = null : null;
    this.req = {
      days: [],
      months: [],
      semesterIds: [],
      lecture_type: [],
      roomIds: [],
      singleRoomId: '',
      dateRange: {
        start: '',
        end: ''
      }
    }
    this.statOptions.find(option => option.value == action)?.daypicker ? this.daypicker = true : this.daypicker = false;
    this.statOptions.find(option => option.value == action)?.monthPicker ? this.monthPicker = true : this.monthPicker = false;
    this.statOptions.find(option => option.value == action)?.semesterPicker ? this.semesterPicker = true : this.semesterPicker = false;
    this.statOptions.find(option => option.value == action)?.typePicker ? this.typePicker = true : this.typePicker = false;
    this.statOptions.find(option => option.value == action)?.roomPicker ? this.roomPicker = true : this.roomPicker = false;
    this.statOptions.find(option => option.value == action)?.singleRoomPicker ? this.singleRoomPicker = true : this.singleRoomPicker = false;
    this.statOptions.find(option => option.value == action)?.datePicker ? this.datePicker = true : this.datePicker = false;

    this.selectedAction = action
    this.resetData()
    this.getData()
  }
  resetData() {
    this.dayOptions.forEach(day => {
      day.checked = false
    })
    this.monthOptions.forEach(month => {
      month.checked = false
    })
    this.semesters.forEach(semester => {
      semester.checked = false
    })
    this.types.forEach(type => {
      type.checked = false
    })
    this.rooms.forEach(room => {
      room.checked = false
    })
  }
  dateRangeChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    this.req.dateRange = {
      start: dateRangeStart.value,
      end: dateRangeEnd.value
    }
    this.getData()
  }
  roomOptionChange($event: any, room: any) {
    $event.stopPropagation();
    const index = this.req.roomIds.indexOf(room.id);
    if (index === -1) {
      // If room_id is not in the array, add it
      this.req.roomIds.push(room.id);
      room.checked = true;
    } else {
      // If room_id is already in the array, remove it
      this.req.roomIds.splice(index, 1);
      room.checked = false;
    }
    this.getData()
  }
  singleRoomOptionChange($event: any, roomId: any) {    
    this.req.singleRoomId = ''
    this.req.singleRoomId = roomId;
    this.getData()
  }
  dayOptionChange($event: any, day: any) {
    $event.stopPropagation();
    const index = this.req.days.indexOf(day.value);
    if (index === -1) {
      // If room_id is not in the array, add it
      this.req.days.push(day.value);
      day.checked = true;
    } else {
      // If room_id is already in the array, remove it
      this.req.days.splice(index, 1);
      day.checked = false;
    }
    this.getData()
  }
  monthOptionChange($event: any, month: any) {
    $event.stopPropagation();
    const index = this.req.months.indexOf(month.value);
    if (index === -1) {
      // If room_id is not in the array, add it
      this.req.months.push(month.value);
      month.checked = true;
    } else {
      // If room_id is already in the array, remove it
      this.req.months.splice(index, 1);
      month.checked = false;
    }
    this.getData()
  }
  semesterOptionChange($event: any, semester: any) {
    $event.stopPropagation();
    const index = this.req.semesterIds.indexOf(semester.id);
    if (index === -1) {
      // If room_id is not in the array, add it
      this.req.semesterIds.push(semester.id);
      semester.checked = true;
    } else {
      // If room_id is already in the array, remove it
      this.req.semesterIds.splice(index, 1);
      semester.checked = false;
    }
    this.getData()
  }
  typeOptionChange($event: any, type: any) {
    $event.stopPropagation();
    const index = this.req.lecture_type.indexOf(type.value);
    if (index === -1) {
      
      this.req.lecture_type.push(type.value);
      type.checked = true;
    } else {
      // If room_id is already in the array, remove it
      this.req.lecture_type.splice(index, 1);
      type.checked = false;
    }
    this.getData()
  }
  udpateChart(data: any) {
    let i = 0;
    this.datasets = [];
    this.frequencyData = []
        this.percentageData = []
    if (data[0].options.chartType == 'doughnut') {
      //let datasets: { data: any; backgroundColor: any; label: any; borderColor: any; }[] = []

      data.forEach((element: any) => {
        this.datasets[0] = {
          data: element.data.accumulatedDataset,
          backgroundColor: '',//[this.rooms[element.room_id - 1].color, ],
          borderColor: '#98d5f6',
          label: element.options.label
        }
        element.roomIds.forEach((room: any) => {
          this.datasets[0] = {
            ...this.datasets[0],
            backgroundColor: [...this.datasets[0].backgroundColor, this.rooms[room - 1].color],
          }
        })
        this.datasets[0] = {
          ...this.datasets[0],
          backgroundColor: [...this.datasets[0].backgroundColor, '#98d5f6'],
        }
        this.frequencyData[0] = element.data.accumulatedDataset;
        this.percentageData[0] = element.data.percentageDataset;
      })
      this.chartData.datasets = this.datasets;
    } else {
      //let datasets: { data: any; backgroundColor: any; label: any; borderColor: any; }[] = []
      data.forEach((element: any) => {
        this.datasets[i] = {
          data: element.data.frequency,
          backgroundColor: this.rooms[element.room_id - 1].color,
          borderColor: this.rooms[element.room_id - 1].color,
          label: element.options.label
        }
        this.frequencyData[i] = element.data.frequency;
        this.percentageData[i] = element.data.percentage;
        i++;
      })
      this.chartData.datasets = this.datasets;
    }
    this.chartData.labels = data[0].data.labels
    this.chartType = data[0].options.chartType;
    this.barChart?.update();
    this.toggleFrequencyFlag = false;
  }
  toggleFrequency() {
    let i = 0;
    if (this.toggleFrequencyFlag) {
      this.frequencyData.forEach((element: any) => {
        this.datasets[i] = {
          ...this.datasets[i],
          data: element,
        }
        i++;
      })
    } else {
      this.percentageData.forEach((element: any) => {
        this.datasets[i] = {
          ...this.datasets[i],
          data: element,
        }
        i++;
      })
    }
    this.chartData.datasets = this.datasets;
    this.barChart?.update();
    this.toggleFrequencyFlag = !this.toggleFrequencyFlag;
  }
}
