import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {

  constructor(private http: HttpClient) { }

  getRooms(req: any): Observable <any> {
    return this.http.post('http://localhost:8000/api/getRooms', req);
  }

  getAllRooms(): Observable <any> {
    return this.http.get('http://localhost:8000/api/getAllRooms');
  }

  getModeratedRooms(id: number): Observable <any> {
    return this.http.get('http://localhost:8000/api/getModeratedRooms/'+id);
  }
}
