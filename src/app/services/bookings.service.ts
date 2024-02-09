import { Injectable } from '@angular/core';
import { CalendarEvent, CalendarEventAction } from 'angular-calendar';
import { subDays, startOfDay, addDays, endOfMonth, addHours } from 'date-fns';
import { EventColor } from 'calendar-utils';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  

  colors: Record<string, EventColor> = {
    red: {
      primary: '#ad2121',
      secondary: '#FAE3E3',
    },
    blue: {
      primary: '#1e90ff',
      secondary: '#D1E8FF',
    },
    yellow: {
      primary: '#e3bc08',
      secondary: '#FDF1BA',
    },
    green: {
      primary: '#32cf1d',
      secondary: '#32cf1d',
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
      info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In diam augue, vulputate id nisl vel, feugiat egestas ex. Phasellus eget pretium odio. Phasellus gravida mi id ipsum consequat suscipit. Maecenas malesuada hendrerit ex, lacinia tristique lacus venenatis ac. Fusce semper risus eget elit feugiat, at facilisis erat pretium. Praesent tincidunt, diam vel congue cursus, tortor arcu commodo diam, sit amet scelerisque dolor dolor a ante. Nunc eget metus sapien. Phasellus in consequat justo. Suspendisse porta porta erat id maximus. Donec vitae luctus felis, posuere vestibulum risus. Donec viverra pretium laoreet. Nullam non dolor dictum, aliquam urna ut, malesuada mi. Ut lacus velit, tempus ut condimentum tempor, tempus vulputate elit. Suspendisse vel tortor pellentesque, mollis lacus in, rutrum est. Donec rutrum pretium mauris in mattis. Quisque quis ipsum a mauris gravida tristique. Proin faucibus purus nec mollis commodo. Mauris at felis sit amet lacus tempus blandit nec sed nibh. Phasellus sed pulvinar mi. Quisque ac varius felis, sit amet molestie justo. Praesent ut finibus est. Vivamus venenatis aliquam erat ut imperdiet. Praesent nec eleifend justo. Mauris egestas dapibus enim. Proin dignissim tincidunt tortor. Morbi faucibus orci ut sodales placerat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia.',

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

  constructor() { }

  getBookings() {
    return this.bookings;
  }
}
