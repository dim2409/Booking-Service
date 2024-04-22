import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Observable } from 'rxjs';
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

  @ViewChild(BaseChartDirective) barChart: BaseChartDirective<'bar'> | undefined;
  
  public max = 100;
  public barChartOptions: ChartConfiguration['options'] = {
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

  public barChartData: ChartData = {
    labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    datasets: [
      { data: [], label: 'Room Day Frequency' },
    ],
  };

  public chartType:any = 'line';

  statOptions: { label: string, value: string }[] = [];

  constructor(private statisticsService: StatisticsService) {

  }
  ngOnInit(): void {
    this.statOptions = this.statisticsService.getActions();
    console.log(this.barChartData)
  }
  getData($event: MatSelectChange) {
    let req = {};
    this.statisticsService.callAction($event.value, req).subscribe((resp: any) => {
      this.udpateChart(resp)
    })
  }
  udpateChart(data: any) {
    let i = 0;
    this.barChartData.datasets[0].data = [];
    
    data.forEach((element: any) => {
      this.barChartData.datasets[0].data = element.data.frequency;
    })
    this.barChartData.labels = data[0].data.labels
    this.max = data[0].options.frequencyMax;
    this.barChartOptions = {
      scales: {
        y: {
          max: this.max
        },
        
      }
    }
    this.chartType = data[0].options.chartType;
    this.barChart?.update();
    
    /* data[0].data[0].datasets.forEach((element: any) => {
      this.barChartData.datasets[0].data[i] = element.datasetFrequency;
      i++;
    });
     */
  }
}
