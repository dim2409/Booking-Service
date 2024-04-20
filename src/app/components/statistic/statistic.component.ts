import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
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
    MatSelectModule
  ],
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.less'
})
export class StatisticComponent implements OnInit {
  statOptions: { label: string, value: string }[] = [];
  constructor(private statisticsService: StatisticsService) {

  }
  ngOnInit(): void {
    this.statOptions = this.statisticsService.getActions();
    console.log(this.statOptions)
  }
  getData($event: MatSelectChange) {
    let req = {};
    this.statisticsService.callAction($event.value, req).subscribe((resp: any) => {
    })
  }
}
