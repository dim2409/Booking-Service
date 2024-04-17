import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private http: HttpClient) { }

  roomDayFrequency(room: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/roomDayFrequencyPercentage', {id: room});
  }
}
