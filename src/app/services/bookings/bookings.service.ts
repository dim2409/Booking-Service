import { Injectable } from '@angular/core';
import { CalendarEvent, CalendarEventAction } from 'angular-calendar';
import { subDays, startOfDay, addDays, endOfMonth, addHours } from 'date-fns';
import { EventColor } from 'calendar-utils';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {


  colors: Record<string, EventColor> = {
    blue: {
      primary: '#86b6f6',
      secondary: '#46B95C',
    },
    pink: {
      primary: '#a393e8',
      secondary: '#B99646',
    },
    green: {
      primary: '#6edec5',
      secondary: '#A3B946',
    },
    red: {
      primary: '#f66a6a',
      secondary: '#B94646',
    },
    orange: {
      primary: '#f6b26a',
      secondary: '#B94646',
    },
    purple: {
      primary: '#b66af6',
      secondary: '#B94646',
    },
    yellow: {
      primary: '#edce1c',
      secondary: '#B94646',
    }
  };
  constructor(private http: HttpClient) { }

  mapBookings(data: any[], colors: any): any[] {
    return data.map(item => {
      let startDate = moment.utc(item.start).tz('Europe/Athens').toDate();
      let endDate = moment.utc(item.end).tz('Europe/Athens').toDate();;
      return {
        ...item,
        start: startDate,
        end: endDate,
        draggable: false,
        color: { ...colors[item.color] },
      };
    });
  };
  
  getBookings(req: any): Observable<any> {
    return this.http.post<any>('http://localhost:8000/api/getBookings', req).pipe(map((data: any) => {
      const resp = this.mapBookings(data, this.colors);
      return resp;
    }))
  }

  getRcurringBookings(roomIds: any): Observable<any> {
    return this.http.post<any>('http://localhost:8000/api/getRecurring',roomIds)
  }

  getConflicts(req: any): Observable<any> {
    return this.http.post<any>('http://localhost:8000/api/getConflicts', req).pipe(map((data: any) => {
      const resp = data
      for (const item of resp.conflictingBookings) {
        item.bookings = this.mapBookings(item.bookings, this.colors);
      }
      return resp
    }))
  }

  checkConflict(req: any): Observable<any> {
    return this.http.post<any>('http://localhost:8000/api/checkConflict', req)
  }

  resolveConflict(req: any): Observable<any> {
    return this.http.post<any>('http://localhost:8000/api/resolveConflict', req)
  }

  getActiveBookings(req:any): Observable<any> {
    return this.http.post<any>('http://localhost:8000/api/getActiveBookings', req).pipe(map((data: any) => {
      const resp = this.mapBookings(data, this.colors);
      return resp;        
    }))
  }

  getUserBookings(id: number) {
    return new Promise(resolve => {
      this.http.get<any>('http://localhost:8000/api/getUserBookings/' + id).subscribe((data) => {
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
            color: { ...this.colors[item.color] },
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
    return this.http.post<any>('http://localhost:8000/api/createBooking', booking, { headers });
  }

  approveBooking(req: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<any>('http://localhost:8000/api/approveBooking', req, { headers });
  }

  cancelBooking(req: any): Observable<any> {
    return this.http.post<any>('http://localhost:8000/api/cancelBooking', req)
  }

  editBooking(req: any): Observable<any> {
    return this.http.post<any>('http://localhost:8000/api/editBooking', req)
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

