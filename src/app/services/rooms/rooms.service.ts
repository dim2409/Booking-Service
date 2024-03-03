import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {

  constructor(private http: HttpClient) { }

  getRooms(): Observable <any> {
    return this.http.get('http://localhost:8000/api/getRooms');
  }

  getModeratedRooms(id: number): Observable <any> {
    return this.http.get('http://localhost:8000/api/getModeratedRooms/'+id);
  }
}
