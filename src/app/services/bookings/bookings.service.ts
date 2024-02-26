import { Injectable } from '@angular/core';
import { CalendarEvent, CalendarEventAction } from 'angular-calendar';
import { subDays, startOfDay, addDays, endOfMonth, addHours } from 'date-fns';
import { EventColor } from 'calendar-utils';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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
      primary: '#f6f26a',
      secondary: '#B94646',
    }
  };
  /* Actions for the Calendar once you click on booking */
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        //function to go to edit booking
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        //this.bookings = this.bookings.filter((iEvent) => iEvent !== event);
        //function to delete booking
      },
    },
  ];
  bookings: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'Booking 1 - Room 1',
      color: { ...this.colors['red'] },
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,

      id: 1,
      //info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In diam augue, vulputate id nisl vel, feugiat egestas ex. Phasellus eget pretium odio. Phasellus gravida mi id ipsum consequat suscipit. Maecenas malesuada hendrerit ex, lacinia tristique lacus venenatis ac. Fusce semper risus eget elit feugiat, at facilisis erat pretium. Praesent tincidunt, diam vel congue cursus, tortor arcu commodo diam, sit amet scelerisque dolor dolor a ante. Nunc eget metus sapien. Phasellus in consequat justo. Suspendisse porta porta erat id maximus. Donec vitae luctus felis, posuere vestibulum risus. Donec viverra pretium laoreet. Nullam non dolor dictum, aliquam urna ut, malesuada mi. Ut lacus velit, tempus ut condimentum tempor, tempus vulputate elit. Suspendisse vel tortor pellentesque, mollis lacus in, rutrum est. Donec rutrum pretium mauris in mattis. Quisque quis ipsum a mauris gravida tristique. Proin faucibus purus nec mollis commodo. Mauris at felis sit amet lacus tempus blandit nec sed nibh. Phasellus sed pulvinar mi. Quisque ac varius felis, sit amet molestie justo. Praesent ut finibus est. Vivamus venenatis aliquam erat ut imperdiet. Praesent nec eleifend justo. Mauris egestas dapibus enim. Proin dignissim tincidunt tortor. Morbi faucibus orci ut sodales placerat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia.',

    },
    {
      start: startOfDay(new Date()),
      title: 'Booking 2 - Room 2',
      color: { ...this.colors['green'] },
      actions: this.actions,
      id: 2,
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'Booking 3 - Room 1',
      color: { ...this.colors['red'] },
      allDay: true,
      id: 3,
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      title: 'Booking 4 - Room 3',
      color: { ...this.colors['yellow'] },
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
      id: 4,
    },
    {
      start: startOfDay(new Date()),
      title: 'Booking 5 - Room 4',
      color: { ...this.colors['blue'] },
      actions: this.actions,
      id: 5,
    },
  ];

  constructor(private http: HttpClient) { }

  mapBookings(data: {
    end: string | number | Date;
    color: any;
    start: string | number | Date;
  }[], colors: any): any[] {
    return data.map(item => {
      const startDate = new Date(item.start);
      const endDate = new Date(item.end);
      return {
        ...item,
        start: startDate,
        end: endDate,
        draggable: false,
        color: { ...colors[item.color] },
      };
    });
  };
  getActiveBookings() {
    return new Promise(resolve => {
      this.http.get<any>('http://localhost:8000/api/getActiveBookings').subscribe((data) => {
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
            draggable: true,
            color: { ...this.colors[item.color] },
          }
        })
        resolve(resp);
      })
    })
  }

  getBookingByRoom(id: number) {
    return new Promise(resolve => {
      this.http.get<any>('http://localhost:8000/api/getBookingByRoom/' + id).subscribe((data) => {
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

  getAllBookingsByRoom(id: number[]) {
    return new Promise(resolve => {
      this.http.post<any[]>('http://localhost:8000/api/getAllBookingsByRoom', { ids: id }).subscribe((data: any) => {
        console.log(data)
        const resp = {conflicts: this.mapBookings(data.conflicts.original, this.colors), 
          bookings: this.mapBookings(data.bookings, this.colors)
        }
        console.log(resp)
        resolve(resp);
      })
    })
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

  updateBookingStatus(bookingId: number, status: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.put<any>('http://localhost:8000/api/updateBookingStatus/' + bookingId, { status: status }, { headers });
  }
}

