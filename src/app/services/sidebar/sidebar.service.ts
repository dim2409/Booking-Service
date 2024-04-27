import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private sidebarState = new BehaviorSubject<boolean>(false);
  constructor() { }
  mainItems: any = {
    HOME: {
      data: {
        label: 'Home',
        icon: 'fas fa-home h2',
        location: '/',
        action: "changeLocation('')",
      },
    },
    MOD: {
      data: {
        label: 'Moderator View',
        icon: 'fa-solid fa-gauge h2',
        location: '/moderator',
        action: "changeLocation('moderator')",
      },
    },
    STATS: {
      data: {
        label: 'Statistics',
        icon: 'fa-solid fa-chart-pie h2', 
        location: '/statistics',
        action: "changeLocation('statistics')",
      },
    },
    SEMESTERS: {
      data: {
        label: 'Semester Management',
        icon: 'fa-solid fa-calendar-days h2', 
        location: '/semester',
        action: "changeLocation('semester')",
      },
    },
    ROOMS: {
      data: {
        label: 'Room Management',
        icon: 'fa-solid fa-building h2', 
        location: '/roomManagement',
        action: "changeLocation('roomManagement')",
      },
    },
    USERBOOKINGS: {
      data: {
        label: 'My Bookings',
        icon: 'fa-solid fa-file-signature h2', 
        location: '/myBookings',
        action: "changeLocation('myBookings')",
      },
    },
  };
  getMainSidebarItems() {
    let items = []
    for (let item in this.mainItems) items.push(this.mainItems[item].data);
    return items;
  }
  toggle() {
    this.sidebarState.next(!this.sidebarState.value);
  }

  getState(): Observable<boolean> {
    return this.sidebarState.asObservable();
  }

}
