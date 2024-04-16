import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {

  constructor(private http: HttpClient) { }

  getRooms(req: any): Observable <any> {
    return this.http.post('http://localhost:8000/getRooms', req);
  }
  getDepartments(req: any): Observable <any> {
    return this.http.post('http://localhost:8000/getDepartments', req);
  }
  getBuildings(req: any): Observable <any> {
    return this.http.post('http://localhost:8000/getBuildings', req);
  }

  getAllRooms(): Observable <any> {
    return this.http.get('http://localhost:8000/getAllRooms');
  }

  getModeratedRooms(id: number): Observable <any> {
    return this.http.get('http://localhost:8000/getModeratedRooms/'+id);
  }

  createRoom(req: any): Observable <any> {
    return this.http.post('http://localhost:8000/createRoom', req);
  }
}
