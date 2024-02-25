import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {

  constructor(private http: HttpClient) { }

  getRooms() {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:8000/api/getRooms').subscribe((data: any) => {
        resolve(data);
      })
    })
  }

  getModeratedRooms(id: number) {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:8000/api/getModeratedRooms/'+id).subscribe((data: any) => {
        resolve(data);
      })
    })
  }
}
