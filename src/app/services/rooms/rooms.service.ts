import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {

  constructor(private http: HttpClient) { }

  getRooms(req: any): Observable <any> {
    return this.http.post(environment.apiUrl + '/getRooms', req);
  }
  getDepartments(req: any): Observable <any> {
    return this.http.post(environment.apiUrl + '/getDepartments', req);
  }
  getBuildings(req: any): Observable <any> {
    return this.http.post(environment.apiUrl + '/getBuildings', req);
  }

  getAllRooms(): Observable <any> {
    return this.http.get(environment.apiUrl + '/getAllRooms');
  }

  getModeratedRooms(id: number): Observable <any> {
    return this.http.get(environment.apiUrl + '/getModeratedRooms/'+id);
  }

  getPossibleModerators(req: any): Observable <any> {
    return this.http.get(environment.apiUrl + '/getPossibleModerators', req);
  }

  createRoom(req: any): Observable <any> {
    return this.http.post(environment.apiUrl + '/createRoom', req);
  }
  deleteRoom(req: any): Observable <any> {
    return this.http.post(environment.apiUrl + '/deleteRoom', req);
  }
}
