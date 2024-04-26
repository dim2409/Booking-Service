import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { GeneralRequestService } from 'src/app/services/general/general-request.service';
import { FiltersComponent } from "../../components/filters/filters.component";
import { ControlCardComponent } from "../../components/control-card/control-card.component";
import { CardListComponent } from "../../components/card-list/card-list.component";
import { LoadingSpinnerComponent } from "../../components/loading-spinner/loading-spinner.component";
import { PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { FiltersService } from 'src/app/services/filters/filters.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import _ from 'lodash';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { StatisticsService } from 'src/app/services/statistics/statistics.service';
import { Chart } from 'chart.js/dist';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-semester-management',
  standalone: true,
  templateUrl: './semester-management.component.html',
  styleUrl: './semester-management.component.less',
  imports: [CommonModule, FiltersComponent, ControlCardComponent, CardListComponent, LoadingSpinnerComponent, BaseChartDirective]
})

export class semesterManagementComponent {

  @Output() semesterUpdate: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(ControlCardComponent) controlCard!: ControlCardComponent;

  pageIndex: number = 0;

  selectCount: number = 0;
  loading!: boolean;
  chips = [
    { label: 'Day created', value: 'created_at', selected: true, asc: false },
    { label: 'Alphabetical', value: 'title', selected: false, asc: false },
    { label: 'Date', value: 'start', selected: false, asc: false },
  ]

  params =
    {
      pageSizeOptions: [10, 25, 50],
      totalItems: 0
    };

  buttons = [
    {
      icon: 'fa-pencil',
      action: 'editsemester',
    },
    {
      icon: 'fa-xmark',
      action: 'deletesemester',
    },
  ]

  req: any = {
    perPage: 10,
    page: 1,
    id: 2
  }
  semesters: any;
  buildings: any;
  departments: any;
  filters: any;
  semesterDayFrequency: any;
  constructor(private _snackBar: MatSnackBar, private generalRequestService: GeneralRequestService, private statisticsService: StatisticsService, private filterService: FiltersService, private dialogService: DialogService) {
  }
  openSnackBar(message: string, action?: string) {
    this._snackBar.open(message, action ? action : 'Dismiss')._dismissAfter(3000);
  }
  ngOnInit() {
    
    this.getData();

  }

  filterUpdated(event: any) {
    
    this.req = {
      page: 1,
      perPage: 10,
      id: 2
    }
    this.req = { ...this.req, ...event }
    this.controlCard.resetPageIndex();
    this.getData();
  }

  getData() {
    this.loading = true;
    this.generalRequestService.getSemesters(this.req).subscribe((resp: any) => {
      this.semesters = resp.data;
      this.params.totalItems = resp.total
      this.loading = false
    })
  }
  onPageChange(event: PageEvent): void {
    // Check if the page index has changed
    if (event.pageIndex + 1 !== this.req.page) {
      this.req.page = event.pageIndex + 1;
    }

    // Check if the page size has changed
    if (event.pageSize !== this.req.perPage) {
      this.req.perPage = event.pageSize;
    }
    this.getData();
  }

  sorterUpdated(event: any) {
    if (event.selected) {
      this.req.sortBy = event.value
      this.req.sortOrder = event.asc ? 'asc' : 'desc'
    } else {
      delete this.req.sortBy;
      delete this.req.sortOrder;
    }
    this.req.page = 1;
    this.getData();
  }

  updateSemester(event: any) {
    if (event.action == 'editsemester') {
      this.editSemester(event)
    }
    if (event.action == 'deletesemester') {
      this.deleteSemester(event)
    }
  }
  editSemester(semester: any) {
    this.dialogService.openCreateSemesterDialog(semester.booking).subscribe((resp: any) => {
      if (resp != false) {
        this.getData();
        this.openSnackBar('semester Updated');
      }
    })
  }

  deleteSemester(event: any) {
    this.dialogService.openConfirmDialog(event.booking,'Are you sure you want to delete this semester?').subscribe(res => {
      if (res) {
        this.generalRequestService.deleteSemester({id:[event.booking.id]}).subscribe((resp: any) => {
          if (resp) {
            this.getData();
            this.openSnackBar('semester Deleted');
          }
        })
      }
    })
  }
  addSemester() {
    this.dialogService.openCreateSemesterDialog().subscribe((resp: any) => {
      if(resp!=false){
        this.getData();
        this.openSnackBar('semester Added');
      }
    })
  }
}
