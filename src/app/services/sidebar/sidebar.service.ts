import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';
@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private sidebarState = new BehaviorSubject<boolean>(false);
  private filterSidebarState = new BehaviorSubject<boolean>(false);
  constructor(private authService: AuthenticationService) { }
  mainItems: any = {
    HOME: {
      filter: ['all'],
      data: {
        label: 'Home',
        icon: 'fas fa-home h2',
        location: '/',
        action: "changeLocation('')",
      },
    },
    MOD: {
      filter: ['faculty', 'admin'],
      data: {
        label: 'Moderator View',
        icon: 'fa-solid fa-gauge h2',
        location: '/moderator',
        action: "changeLocation('moderator')",
      },
    },
    STATS: {
      filter: ['faculty', 'admin'],
      data: {
        label: 'Statistics',
        icon: 'fa-solid fa-chart-pie h2',
        location: '/statistics',
        action: "changeLocation('statistics')",
      },
    },
    SEMESTERS: {
      filter: ['admin'],
      data: {
        label: 'Semester Management',
        icon: 'fa-solid fa-calendar-days h2',
        location: '/semester',
        action: "changeLocation('semester')",
      },
    },
    ROOMS: {
      filter: ['admin'],
      data: {
        label: 'Room Management',
        icon: 'fa-solid fa-building h2',
        location: '/roomManagement',
        action: "changeLocation('roomManagement')",
      },
    },
    USERBOOKINGS: {
      filter: ['all'],
      data: {
        label: 'My Bookings',
        icon: 'fa-solid fa-file-signature h2',
        location: '/myBookings',
        action: "changeLocation('myBookings')",
      },
    }
  };
  getMainSidebarItems() {
    let items = [];
    if(this.authService.isAuthenticated()) {
      
      let userRoles = this.authService.getUserRoles().map((role: { name: any; }) => role.name);
    
      for (let key in this.mainItems) {
        const item = this.mainItems[key];
        const filters = item.filter;
    
        if (filters.includes('all') || filters.some((role: any) => userRoles.includes(role))) {
          items.push(item.data);
        }
      }
    
    }
    return items;
  }
  toggle() {
    this.sidebarState.next(!this.sidebarState.value);
  }

  toggleFilterSidebar() {
    this.filterSidebarState.next(!this.sidebarState.value);
  }

  getState(): Observable<boolean> {
    return this.sidebarState.asObservable();
  }



}
