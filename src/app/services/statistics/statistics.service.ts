import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private http: HttpClient) { }

  roomHourOfDayOfWeekFrequency(req: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/roomHourOfDayOfWeekFrequency', req);
  }
  roomDayOfWeekFrequency(req: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/roomDayOfWeekFrequency', req);
  }
  roomDayOfMonthFrequency(req: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/roomDayOfMonthFrequency', req);
  }
  roomMonthOfSemesterFrequency(req: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/roomMonthOfSemesterFrequency', req);
  }
  roomOccupancyByDayOfWeekPercentage(req: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/roomOccupancyByDayOfWeekPercentage', req);
  }
  roomOccupancyByYearMonthPercentage(req: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/roomOccupancyByYearMonthPercentage', req);
  }
  roomOccupancyBySemester(req: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/roomOccupancyBySemester', req);
  }
  calculateSemesterCapacity(req: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/calculateSemesterCapacity', req);
  }
  roomOccupancyByDateRange(req: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/roomOccupancyByDateRange', req);
  }
}
