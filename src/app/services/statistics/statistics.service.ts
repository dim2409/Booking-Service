import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Action {
  label: string;
  action: (req: any) => Observable<any>;
  roomPicker?: boolean;
  singleRoomPicker?: boolean;
  daypicker?: boolean;
  semesterPicker?: boolean;
  monthPicker?: boolean;
  datePicker?: boolean;
}

interface ActionsMap {
  [key: string]: Action;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private http: HttpClient) { }

  private actionsMap: ActionsMap = {
    roomHourOfDayOfWeekFrequency: {
      daypicker: true,
      semesterPicker: true,
      roomPicker: true,
      label: 'Hour of Day - Fr',
      action: (req: any) => this.http.post<any>(environment.apiUrl + '/roomHourOfDayOfWeekFrequency', req)
    },
    roomDayOfWeekFrequency: {
      label: 'Day of Week - Fr',
      semesterPicker: true,
      roomPicker: true,
      action: (req: any) => this.http.post<any>(environment.apiUrl + '/roomDayOfWeekFrequency', req)
    },
    roomDayOfMonthFrequency: {
      monthPicker: true,
      semesterPicker: true,
      roomPicker: true,
      label: 'Day of Month - Fr',
      action: (req: any) => this.http.post<any>(environment.apiUrl + '/roomDayOfMonthFrequency', req)
    },
    roomMonthOfSemesterFrequency: {
      semesterPicker: true,
      roomPicker: true,
      label: 'Month of Semester - Fr',
      action: (req: any) => this.http.post<any>(environment.apiUrl + '/roomMonthOfSemesterFrequency', req)
    },
    roomDayOfWeekDurationFrequency: {
      semesterPicker: true,
      roomPicker: true,
      label: 'Day of Week Duration - Fr',
      action: (req: any) => this.http.post<any>(environment.apiUrl + '/roomDayOfWeekDurationFrequency', req)
    },
    roomMonthDurationFrequency: {
      semesterPicker: true,
      monthPicker: true,
      roomPicker: true,
      label: 'Month Duration - Fr',
      action: (req: any) => this.http.post<any>(environment.apiUrl + '/roomMonthDurationFrequency', req)
    },
    roomOccupancyByDayOfWeekPercentage: {
      roomPicker: true,
      daypicker: true,
      semesterPicker: true,
      label: 'Occupancy by Day of Week',
      action: (req: any) => this.http.post<any>(environment.apiUrl + '/roomOccupancyByDayOfWeekPercentage', req)
    },
    roomOccupancyByMonthPercentage: {
      label: 'Occupancy by Month',
      roomPicker: true,
      monthPicker: true,
      semesterPicker: true,
      action: (req: any) => this.http.post<any>(environment.apiUrl + '/roomOccupancyByMonthPercentage', req)
    },
    roomOccupancyBySemester: {
      roomPicker: true,
      singleRoomPicker: true,
      label: 'Occupancy by Semester',
      action: (req: any) => this.http.post<any>(environment.apiUrl + '/roomOccupancyBySemester', req)
    },
    roomOccupancyByDateRange: {
      roomPicker: true,
      datePicker: true,
      label: 'Occupancy by Date Range',
      action: (req: any) => this.http.post<any>(environment.apiUrl + '/roomOccupancyByDateRange', req)
    },
    roomDateRangeFrequency: {
      roomPicker: true,
      datePicker: true,
      label: 'Date Range - Fr',
      action: (req: any) => this.http.post<any>(environment.apiUrl + '/roomDateRangeFrequency', req)
    },
    roomDateRangeDurationFrequency: {
      roomPicker: true,
      datePicker: true,
      label: 'Date Range Duration - Fr',
      action: (req: any) => this.http.post<any>(environment.apiUrl + '/roomDateRangeDurationFrequency', req)
    }
  };

  // Function to dynamically call the appropriate method based on user action
  callAction(action: string, req: any): Observable<any> {
    const selectedAction = this.actionsMap[action];
    if (selectedAction) {
      return selectedAction.action(req);
    } else {
      throw new Error(`Action '${action}' is not supported.`);
    }
  }

  // Function to get all available actions along with their labels and functions
  getActions(): { label: string, value: string }[] {
    return Object.keys(this.actionsMap).map(key => ({
      label: this.actionsMap[key].label,
      value: key,
      roomPicker: this.actionsMap[key].roomPicker,
      singleRoomPicker: this.actionsMap[key].singleRoomPicker,
      daypicker: this.actionsMap[key].daypicker,
      monthPicker: this.actionsMap[key].monthPicker,
      semesterPicker: this.actionsMap[key].semesterPicker,
      datePicker: this.actionsMap[key].datePicker
    }));
  }
}
