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

  @ViewChild(BaseChartDirective) barChart: BaseChartDirective | undefined;

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
    labels: [],
    datasets: [
      { data: [], backgroundColor: [],},
    ],
  };

  public chartType: any = 'line';

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
      console.log(element.data.accumulatedDataset)
      console.log(element.data.frequency)
      element.options.chartType == 'bar' || element.options.chartType == 'line' ?
        this.barChartData.datasets[0].data = element.data.frequency :
        this.barChartData.datasets[0].data = element.data.accumulatedDataset;
    })
    this.barChartData.labels = data[0].data.labels
    data[0].options.chartType == ('bar' || 'line') ? this.max = data[0].options.frequencyMax : this.max = 100;
    data[0].options.chartType == ('bar' || 'line') ? this.barChartData.datasets[0].backgroundColor = ['rgb(54, 162, 235)'] : this.barChartData.datasets[0].backgroundColor = ['rgb(255, 99, 132)','rgb(54, 162, 235)'];
    this.barChartOptions = {
      scales: {
        y: {
          max: this.max
        },

      }
    }
    this.chartType = data[0].options.chartType;
    this.barChart?.update();
    console.log(this.barChartData)


    /* data[0].data[0].datasets.forEach((element: any) => {
      this.barChartData.datasets[0].data[i] = element.datasetFrequency;
      i++;
    });
     */
  }
}
