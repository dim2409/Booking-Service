import { Injectable } from '@angular/core';
import { CalendarEvent, CalendarEventAction } from 'angular-calendar';
import { subDays, startOfDay, addDays, endOfMonth, addHours } from 'date-fns';
import { EventColor } from 'calendar-utils';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import * as moment from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  constructor(private http: HttpClient) { }

  mapBookings(data: any[]): any[] {
    return data.map(item => {
      let startDate = moment.utc(item.start).tz('Europe/Athens').toDate();
      let endDate = moment.utc(item.end).tz('Europe/Athens').toDate();;
      return {
        ...item,
        start: startDate,
        end: endDate,
        draggable: false,
      };
    });
  };
  
  getBookings(req: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/getBookings', req).pipe(map((data: any) => {
      const resp = {bookings: this.mapBookings(data.bookings), total: data.total};
      return resp;
    }))
  }

  getRecurringBookings(roomIds: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/getRecurring',roomIds)
  }

  getConflicts(req: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/getConflicts', req).pipe(map((data: any) => {
      const resp = data
      for (const item of resp.data) {
        item.bookings = this.mapBookings(item.bookings);
      }
      return resp
    }))
  }
  getRecurringConflicts(req: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/getRecurringConflicts', req).pipe(map((data: any) => {
      return data
    }))
  }

  checkConflict(req: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/checkConflict', req)
  }

  resolveConflict(req: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/resolveConflict', req)
  }
  resolveRecurringConflict(req: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/resolveRecurringConflict', req)
  }

  getActiveBookings(req:any): Observable<any> {
    console.log(environment)
    return this.http.post<any>(environment.apiUrl + '/api/getActiveBookings', req).pipe(map((data: any) => {
      const resp = this.mapBookings(data);
      return resp;        
    }))
  }

  getUserBookings(id: number) {
    return new Promise(resolve => {
      this.http.get<any>(environment.apiUrl + '/getUserBookings/' + id).subscribe((data) => {
        const resp = data.map((item: {
          end: string | number | Date;
          color: any; start: string | number | Date;
        }) => {
          const startDate = new Date(item.start);
          const endDate = new Date(item.end);
          return {
            ...item,
            start: startDate,
            end: endDate,
            draggable: false,
          }
        })
        resolve(resp);
      })
    })
  }

  createBooking(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let booking = {
      ...data,
      color: 'blue',
      participants: 'No participants',
      booker_id: 4,
      type: 'normal',
      semester_id: 1,
    }
    return this.http.post<any>(environment.apiUrl + '/createBooking', booking, { headers });
  }

  approveBooking(req: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<any>(environment.apiUrl + '/approveBooking', req, { headers });
  }

  cancelBooking(req: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/cancelBooking', req)
  }

  editBooking(req: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/editBooking', req)
  }

  sortBookings(bookings: any[], key: string): any {
    return bookings.sort((a, b) => {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    });
  }

  groupBookings(bookings: any[], key: string): any {
    const groupedBookings = new Map<string, any[]>
    bookings.forEach(booking => {
      const keyValue = booking['conflict_id'];
      if (!groupedBookings.has(keyValue)) {
        groupedBookings.set(keyValue, [])
      }
      groupedBookings.get(keyValue)!.push(booking)
    });
    const result: any[][] = Array.from(groupedBookings.values());

    return result;
  }

  filterBookings(bookings: any[], key: string, value: any): any {
    return bookings.filter(booking => booking[key] === value);
  }
  filterOutBookings(bookings: any[], key: string, value: any): any {
    return bookings.filter(booking => booking[key] !== value);
  }
}

