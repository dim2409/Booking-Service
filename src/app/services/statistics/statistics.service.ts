import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private http: HttpClient) { }

  roomDayFrequency(room: any): Observable<any> {
    return this.http.post<any>('http://localhost:8000/api/roomDayFrequency', {id: room});
  }
}
