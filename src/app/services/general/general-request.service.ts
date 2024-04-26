import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeneralRequestService {
  constructor(private http: HttpClient) { }
  getSemesters(req: any): Observable <any> {
    return this.http.post(environment.apiUrl + '/getAllSemesters', req);
  }
  deleteSemester(req: any): Observable <any> {
    return this.http.post(environment.apiUrl + '/deleteSemester', req);
  }
}
