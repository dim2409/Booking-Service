import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeneralRequestService {
  constructor(private http: HttpClient) { }
  getAllSemesters(): Observable <any> {
    return this.http.get(environment.apiUrl + '/getAllSemesters');
  }
}
