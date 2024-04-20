import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { StatisticsService } from 'src/app/services/statistics/statistics.service';
import { Chart } from 'chart.js/dist';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    BaseChartDirective,
    MatDividerModule
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.less'
})
export class StatisticsComponent implements OnInit{
addStat() {
throw new Error('Method not implemented.');
}

  constructor(private statisticsService: StatisticsService) { }
  public roomDayFrequency: any = [];
  @ViewChild(BaseChartDirective) barChart: BaseChartDirective<'bar'> | undefined;


  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 0,
      },
    },
    plugins: {
      legend: {
        display: true,
      }
    },
  };
  public barChartType = 'bar' as const;

  public barChartData: ChartData<'bar'> = {
    labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    datasets: [
      { data: [], label: 'Room Day Frequency' },
    ],
  };
  ngOnInit(): void {
    /* this.statisticsService.roomHourOfDayOfWeekFrequency(1).subscribe((resp: any) => {
      this.roomDayFrequency = resp;
      resp.forEach((element: any) => {
        //this.barChartData.labels?.push(element.day_of_week);
        this.barChartData.datasets[0].data?.push(element.frequency);
        this.barChart?.update();
        console.log(this.barChartData)
      })
    }) */
  }
}