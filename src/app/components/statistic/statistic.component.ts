import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDateRangeInput, MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { ChartConfiguration, ChartData } from 'chart.js';
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
    MatDateRangeInput
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
  public chartOptions: ChartConfiguration['options'] = {
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
  dayOptions: { label: string, value: number }[] = [
    { label: 'Monday', value: 1 },
    { label: 'Tuesday', value: 2 },
    { label: 'Wednesday', value: 3 },
    { label: 'Thursday', value: 4 },
    { label: 'Friday', value: 5 },
  ];

  monthOptions: { label: string, value: number }[] = [
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    { label: 'March', value: 3 },
    { label: 'April', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 },
  ];

  rooms: any[] = [];
  semesters: any[] = [];
  statOptions: { roomPicker?: boolean, singleRoomPicker?: boolean, daypicker?: boolean, label: string, value: string, semesterPicker?: boolean; monthPicker?: boolean , datePicker?: boolean,}[] = [];
  req = {
    days: [],
    months: [],
    semesterIds: [],
    roomIds: [],
    singleRoomId: '',
    dateRange: {
      start: '',
      end: ''
    }
  }
  datasets: { data: any; backgroundColor: any; label: any; borderColor: any; }[] = []
  frequencyData: any[] = [];
  percentageData: any[] = [];
  toggleFrequencyFlag: boolean = false;

  selectedAction = ''
  roomPicker = false;
  singleRoomPicker = false;
  daypicker = false;
  monthPicker = false;
  semesterPicker = false;
  datePicker = false;
  constructor(private RoomsService: RoomsService, private statisticsService: StatisticsService, private generalRequestService: GeneralRequestService) {

  }
  ngOnInit(): void {
    this.statOptions = this.statisticsService.getActions();
    this.generalRequestService.getAllSemesters().subscribe((resp: any) => {
      this.semesters = resp;
    });
    this.RoomsService.getAllRooms().subscribe((resp: any) => {
      this.rooms = resp
    })
    console.log(this.statOptions)
  }
  getData() {
    this.statisticsService.callAction(this.selectedAction, this.req).subscribe((resp: any) => {
      this.udpateChart(resp)
    })
  }
  chartOptionChange($event: MatSelectChange) {
    this.roomSelect ? this.roomSelect.value = null : null;
    this.singleRoomSelect ? this.singleRoomSelect.value = null : null;
    this.daySelect ? this.daySelect.value = null : null;
    this.monthSelect ? this.monthSelect.value = null : null;
    this.semesterSelect ? this.semesterSelect.value = null : null;
    this.req = {
      days: [],
      months: [],
      semesterIds: [],
      roomIds: [],
      singleRoomId: '',
      dateRange: {
        start: '',
        end: ''
      }
    }
    this.statOptions.find(option => option.value == $event.value)?.daypicker ? this.daypicker = true : this.daypicker = false;
    this.statOptions.find(option => option.value == $event.value)?.monthPicker ? this.monthPicker = true : this.monthPicker = false;
    this.statOptions.find(option => option.value == $event.value)?.semesterPicker ? this.semesterPicker = true : this.semesterPicker = false;
    this.statOptions.find(option => option.value == $event.value)?.roomPicker ? this.roomPicker = true : this.roomPicker = false;
    this.statOptions.find(option => option.value == $event.value)?.singleRoomPicker ? this.singleRoomPicker = true : this.singleRoomPicker = false;
    this.statOptions.find(option => option.value == $event.value)?.datePicker ? this.datePicker = true : this.datePicker = false;

    this.selectedAction = $event.value
    this.getData()
  }
  dateRangeChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    this.req.dateRange = {
      start: dateRangeStart.value,
      end: dateRangeEnd.value
    }
    this.getData()
  }
  roomOptionChange($event: MatSelectChange) {
    this.req.roomIds = []
    this.req.roomIds = $event.value
    this.getData()
  }
  singleRoomOptionChange($event: MatSelectChange) {
    this.req.singleRoomId = ''
    this.req.singleRoomId = $event.value
    this.getData()
  }
  dayOptionChange($event: MatSelectChange) {
    this.req.days = []
    this.req.days = $event.value
    this.getData()
  }
  monthOptionChange($event: MatSelectChange) {
    this.req.months = []
    this.req.months = $event.value
    this.getData()
  }
  semesterOptionChange($event: MatSelectChange) {
    this.req.semesterIds = []
    this.req.semesterIds = $event.value
    this.getData()
  }
  udpateChart(data: any) {
    let i = 0;
    if (data[0].options.chartType == 'doughnut') {
      //let datasets: { data: any; backgroundColor: any; label: any; borderColor: any; }[] = []

      data.forEach((element: any) => {
        this.datasets[0] = {
          data: element.data.accumulatedDataset,
          backgroundColor: [this.rooms[element.room_id - 1].color, '#98d5f6'],
          borderColor: '#98d5f6',
          label: element.options.label
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
    console.log(this.frequencyData)
    console.log(this.percentageData)
    this.chartData.labels = data[0].data.labels
    this.chartType = data[0].options.chartType;
    this.barChart?.update();
    this.toggleFrequencyFlag = false;
  }
  toggleFrequency() {
    let i = 0;
    if(this.toggleFrequencyFlag){
      this.frequencyData.forEach((element: any) => {
        this.datasets[i] = {
          ...this.datasets[i],
          data: element,
        }
        this.chartData.datasets = this.datasets;
        i++;
      })
    } else {
      this.percentageData.forEach((element: any) => {
        this.datasets[i] = {
          ...this.datasets[i],
          data: element,
        }
        this.chartData.datasets = this.datasets;
        i++;
      })
    }    
    this.barChart?.update();
    this.toggleFrequencyFlag = !this.toggleFrequencyFlag;   
  }
}
