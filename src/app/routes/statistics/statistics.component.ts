import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { StatisticsService } from 'src/app/services/statistics/statistics.service';
import { Chart } from 'chart.js/dist';
import { MatDividerModule } from '@angular/material/divider';
import { StatisticComponent } from 'src/app/components/statistic/statistic.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RoomsService } from 'src/app/services/rooms/rooms.service';
import { th } from 'date-fns/locale';
import { LoadingSpinnerComponent } from 'src/app/components/loading-spinner/loading-spinner.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    BaseChartDirective,
    MatDividerModule,
    StatisticComponent,
    CommonModule,
    MatCardModule,
    LoadingSpinnerComponent,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.less'
})
export class StatisticsComponent implements OnInit {
  statsLoading = true;
  /* CHART SHIT START */
  data = {
    labels: [],
    datasets: [{
      label: 'My First Dataset',
      data: [300, 50, 100],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4,
    }]
  };
  public chartOptions: any['options'] = {
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: { display: false, },
      y: {
        min: 0, display: false,
        //max: this.max
      },
    },
    plugins: {
      legend: {
        display: true,
      }
    },
    cutout: '80%',
    maintainAspectRatio: false,
    responsive: true,
    events: [], // Disables all interactive events, including hover
  };
  charts: any[] = [
    {
      labels: [],
      datasets: [{
        label: 'My First Dataset',
        data: [25, 25, 25, 25],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgba(255, 99, 132, 0)'
        ],
        hoverOffset: 4,
      }]
    },
    {
      labels: [],
      datasets: [{
        label: 'My First Dataset',
        data: [25, 25, 25, 25],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgba(255, 99, 132, 0)'
        ],
        hoverOffset: 4,
      }]
    },
    {
      labels: [],
      datasets: [{
        label: 'My First Dataset',
        data: [25, 25, 25, 25],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgba(255, 99, 132, 0)'
        ],
        hoverOffset: 4,
      }]
    },
    {
      labels: [],
      datasets: [{
        label: 'My First Dataset',
        data: [25, 25, 25, 25],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgba(255, 99, 132, 0)'
        ],
        hoverOffset: 4,
      }]
    },
    {
      labels: [],
      datasets: [{
        label: 'My First Dataset',
        data: [25, 25, 25, 25],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgba(255, 99, 132, 0)'
        ],
        hoverOffset: 4,
      }]
    },
    {
      labels: [],
      datasets: [{
        label: 'My First Dataset',
        data: [25, 25, 25, 25],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgba(255, 99, 132, 0)'
        ],
        hoverOffset: 4,
      }]
    },
  ]
  chartData = {
    labels: [],
    datasets: [{
      label: 'My First Dataset',
      data: [90, 10],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgba(255, 99, 132, 0)'  // Transparent color
      ],
      hoverOffset: 4,
    }]
  };
  public doughnut: any = 'doughnut';
  public indicatorOptions: any['options'] = {
    scales: {
      x: { display: false, },
      y: {
        min: 0, display: false,
        //max: this.max
      },
    },
    plugins: {
      legend: {
        display: false,
      }
    },
    cutout: '80%',
    //cutout : '90%',
    maintainAspectRatio: false,
    responsive: true,
    events: [], // Disables all interactive events, including hover
  }
  rooms: any;
  constructor(private statisticsService: StatisticsService, private RoomsService: RoomsService) { }
  public roomDayFrequency: any = [];
  @ViewChild(BaseChartDirective) barChart: BaseChartDirective<'bar'> | undefined;

  @ViewChild(BaseChartDirective) approvalChart: BaseChartDirective | undefined;
  @ViewChild(BaseChartDirective) weekIndicatorChart: BaseChartDirective | undefined;
  @ViewChild(BaseChartDirective) monthIndicatorChart: BaseChartDirective | undefined;
  @ViewChild(BaseChartDirective) weekOccupancyChart: BaseChartDirective | undefined;
  @ViewChild(BaseChartDirective) monthOccupancyChart: BaseChartDirective | undefined;
  @ViewChild(BaseChartDirective) semesterOccupancyChart: BaseChartDirective | undefined;


  stats: any = [];

  totals!: { totalSemester: number, totalMonth: number, totalWeek: number };
  meanDuration: number = 0;
  bussiestRoomsThisSemester: any[] = [];
  bussiestRoomsThisWeek!: { name: string, frequency: number };
  weekCapacityIndicator!: { capacityIndicator: number, remainingHoursInWeek: number };
  monthCapacityIndicator!: { capacityIndicator: number, remainingHoursInMonth: number };
  approvalRate!: { approvalRate: number, approvedBookings: number, canceledBookings: number, cancelationRate: number, allBookings: number };

  ngOnInit(): void {
    document.body.classList.remove('body-overflow');

    this.RoomsService.getAllRooms().subscribe((resp: any) => {
      this.rooms = resp;
    })
    this.statisticsService.getGeneralStatistics().subscribe((resp: any) => {
      this.totals = resp.totals;
      this.meanDuration = resp.meanDuration;
      this.bussiestRoomsThisSemester = resp.bussiestRoomsThisSemester;
      this.bussiestRoomsThisWeek = resp.bussiestRoomsThisWeek;
      this.weekCapacityIndicator = resp.weekCapacityIndicator;
      this.monthCapacityIndicator = resp.monthCapacityIndicator;
      this.approvalRate = resp.approvalRate;
      this.setUpcharts(resp);
      this.statsLoading = false
    })

  }

  setUpcharts(data: any) {
    let i = 0;
    data.charts.forEach((chart: any) => {
      chart.forEach((element: any) => {
        this.charts[i].datasets[0] = {
          data: element.data.percentageDataset,
          backgroundColor: '',
        }
        if (element.roomIds == undefined) {
          this.charts[i].datasets[0] = {
            ...this.charts[i].datasets[0],
            backgroundColor: [...this.charts[i].datasets[0].backgroundColor, '#f72571', 'rgba(255, 99, 132, 0)'],
          }
        } else {
          element.roomIds.forEach((room: any) => {
            this.charts[i].datasets[0] = {
              ...this.charts[i].datasets[0],
              backgroundColor: [...this.charts[i].datasets[0].backgroundColor, this.rooms[room - 1].color],
            }
          })

          this.charts[i].datasets[0] = {
            ...this.charts[i].datasets[0],
            backgroundColor: [...this.charts[i].datasets[0].backgroundColor, '#e3e3e3'],
          }
        }
      })
      i++
    })
  }


  addStat() {
    this.stats.push({});
  }
  removeStat(index: number) {
    this.stats.splice(index, 1);
  }
}
