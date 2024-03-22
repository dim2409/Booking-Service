import { Injectable } from '@angular/core';
interface Filter {
  title: string;
  chips?: { name: string; selected: boolean; id: any; }[]; // Add chips property if needed
  id: string;
  field: string;
}
@Injectable({
  providedIn: 'root'
})

export class FiltersService {
  statusChips = [
    {
      name: 'Pending',
      selected: false,
      id: 0
    },
    {
      name: 'Active',
      selected: false,
      id: 1
    },
    {
      name: 'Cancelled',
      selected: false,
      id: 2
    }
  ]
  dayChips = [
    {
      name: 'Monday',
      selected: false,
      id: 1
    },
    {
      name: 'Tuesday',
      selected: false,
      id: 2
    },
    {
      name: 'Wednesday',
      selected: false,
      id: 3
    },
    {
      name: 'Thursday',
      selected: false,
      id: 4
    },
    {
      name: 'Friday',
      selected: false,
      id: 5
    },        
  ]
  typeChips = [
    {
      name: 'Normal',
      selected: false,
      id: 'normal'
    },
    {
      name: 'Recurring',
      selected: false,
      id: 'recurring'
    },
  ]
  monthChips = [
    {
      name: 'JAN',
      selected: false,
      id: 1
    },
    {
      name: 'FEB',
      selected: false,
      id: 2
    },
    {
      name: 'MAR',
      selected: false,
      id: 3
    },
    {
      name: 'APR',
      selected: false,
      id: 4
    },
    {
      name: 'MAY',
      selected: false,
      id: 5
    },
    {
      name: 'JUN',
      selected: false,
      id: 6
    },
    {
      name: 'JUL',
      selected: false,
      id: 7
    },
    {
      name: 'AUG',
      selected: false,
      id: 8
    },
    {
      name: 'SEP',
      selected: false,
      id: 9
    },
    {
      name: 'OCT',
      selected: false,
      id: 10
    },
    {
      name: 'NOV',
      selected: false,
      id: 11
    },
    {
      name: 'DEC',
      selected: false,
      id: 12
    },
  ]
  filters: { [key: string]: Filter } = {
    rooms: {
      title: 'Rooms',
      id: 'roomList',
      field: 'room_id'
    },
    status: {
      title: 'Status',
      chips: this.statusChips, // Example chips data
      id: 'status',
      field: 'status'
    },
    type: {
      title: 'Type',
      chips: this.typeChips, // Example chips data
      id: 'type',
      field: 'type'
    },
    months: {
      title: 'Months',
      chips: this.monthChips, // Example chips data
      id: 'monthsFilter',
      field: 'start'
    },
    days: {
      title: 'Days',
      chips: this.dayChips, // Example chips data
      id: 'daysFilter',
      field: 'days'
    },
    // Add more filters as needed
  };

  constructor() { }

  getFilters(filterNames: string[], rooms?: any): any[] {
    if(rooms) {
      this.filters['rooms'].chips = rooms
    }
    return filterNames.map(name => this.filters[name]);
  }
}
