import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Observable } from 'rxjs';
import { GeneralRequestService } from 'src/app/services/general/general-request.service';
import { RoomsService } from 'src/app/services/rooms/rooms.service';
import { StatisticsService } from 'src/app/services/statistics/statistics.service';

@Component({
  selector: 'app-statistic',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    BaseChartDirective,
    MatSelectModule
  ],
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.less'
})
export class StatisticComponent implements OnInit {

  @ViewChild(BaseChartDirective) barChart: BaseChartDirective | undefined;

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
        label: 'Sample Chart', data: [], backgroundColor: [],
      },
    ],
  };

  public chartType: any = 'line';
  dayOptions: { label: string, value: string }[] = [
    { label: 'Monday', value: '1' },
    { label: 'Tuesday', value: '2' },
    { label: 'Wednesday', value: '3' },
    { label: 'Thursday', value: '4' },
    { label: 'Friday', value: '5' },
  ];

  rooms: any[] = [];
  semesters: any[] = [];
  statOptions: { daypicker?: boolean, label: string, value: string, semesterPicker?: boolean }[] = [];
  req = {}
  selectedAction = ''
  roomPicker = false;
  daypicker = false;
  semesterPicker = false;
  constructor(private RoomsService: RoomsService,private statisticsService: StatisticsService, private generalRequestService: GeneralRequestService) {

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
    this.req = {};
    this.statOptions.find(option => option.value == $event.value)?.daypicker ? this.daypicker = true : this.daypicker = false;
    this.statOptions.find(option => option.value == $event.value)?.semesterPicker ? this.semesterPicker = true : this.semesterPicker = false;
    console.log(this.statOptions.find(option => option.value == $event.value))
    this.selectedAction = $event.value
    this.roomPicker = true;
    this.getData()
  }
  roomOptionChange($event: MatSelectChange) {
    this.req = {};
    this.req = {
      roomIds: $event.value
    }
    this.getData()
  }
  dayOptionChange($event: MatSelectChange) {
    console.log($event.value)
    this.req = {
      days: ''
    };
    this.req = {
      days: $event.value
    }
    this.getData()
  }
  semesterOptionChange($event: MatSelectChange) {
    this.req = {
      semesterIds: ''
    };
    this.req = {
      semesterIds: $event.value
    }
    this.getData()
  }
  udpateChart(data: any) {
    this.chartData.datasets[0].data = [];

    data.forEach((element: any) => {
      element.options.chartType == 'bar' || element.options.chartType == 'line' ?
        this.chartData.datasets[0].data = element.data.frequency :
        this.chartData.datasets[0].data = element.data.accumulatedDataset;
    })
    this.chartData.labels = data[0].data.labels
    data[0].options.chartType == ('bar' || 'line') ? this.max = data[0].options.frequencyMax : this.max = 100;
    data[0].options.chartType == ('bar' || 'line') ? this.chartData.datasets[0].backgroundColor = ['rgb(54, 162, 235)'] : this.chartData.datasets[0].backgroundColor = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)'];
    this.chartOptions = {
      scales: {
        y: {
          max: this.max
        },

      }
    }
    this.chartType = data[0].options.chartType;
    this.chartData.datasets[0].label = data[0].options.label
    this.barChart?.update();
  }
}
