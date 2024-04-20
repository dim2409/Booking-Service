import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Action {
  label: string;
  action: (req: any) => Observable<any>;
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
      label: 'Hour of Day of Week Frequency',
      action: (req: any) => this.http.post<any>(environment.apiUrl + '/roomHourOfDayOfWeekFrequency', req)
    },
    roomDayOfWeekFrequency: {
      label: 'Day of Week Frequency',
      action: (req: any) => this.http.post<any>(environment.apiUrl + '/roomDayOfWeekFrequency', req)
    },
    roomDayOfMonthFrequency: {
      label: 'Day of Month Frequency',
      action: (req: any) => this.http.post<any>(environment.apiUrl + '/roomDayOfMonthFrequency', req)
    },
    roomMonthOfSemesterFrequency: {
      label: 'Month of Semester Frequency',
      action: (req: any) => this.http.post<any>(environment.apiUrl + '/roomMonthOfSemesterFrequency', req)
    },
    roomOccupancyByDayOfWeekPercentage: {
      label: 'Occupancy by Day of Week Percentage',
      action: (req: any) => this.http.post<any>(environment.apiUrl + '/roomOccupancyByDayOfWeekPercentage', req)
    },
    roomOccupancyByYearMonthPercentage: {
      label: 'Occupancy by Year Month Percentage',
      action: (req: any) => this.http.post<any>(environment.apiUrl + '/roomOccupancyByYearMonthPercentage', req)
    },
    roomOccupancyBySemester: {
      label: 'Occupancy by Semester',
      action: (req: any) => this.http.post<any>(environment.apiUrl + '/roomOccupancyBySemester', req)
    },
    calculateSemesterCapacity: {
      label: 'Calculate Semester Capacity',
      action: (req: any) => this.http.post<any>(environment.apiUrl + '/calculateSemesterCapacity', req)
    },
    roomOccupancyByDateRange: {
      label: 'Occupancy by Date Range',
      action: (req: any) => this.http.post<any>(environment.apiUrl + '/roomOccupancyByDateRange', req)
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
      value: key
    }));
  }
}
