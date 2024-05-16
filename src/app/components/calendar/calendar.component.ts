import {
  trigger,
  style,
  state,
  transition,
  animate,
  AnimationTriggerMetadata,
} from '@angular/animations';
import { Component, ElementRef, EventEmitter, HostListener, Injectable, Input, Output, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { MatChipListbox } from '@angular/material/chips';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarModule, CalendarView, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { isSameMonth, isSameDay, subWeeks, startOfMonth, addWeeks, endOfMonth } from 'date-fns';
import _ from 'lodash';
import { Subject } from 'rxjs';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { FiltersService } from 'src/app/services/filters/filters.service';
import { RoomsService } from 'src/app/services/rooms/rooms.service';

const collapseAnimation: AnimationTriggerMetadata = trigger('collapse', [
  state(
    'void',
    style({
      height: 0,
      overflow: 'hidden',
      'padding-top': 0,
      'padding-bottom': 0,
    })
  ),
  state(
    '*',
    style({
      height: '*',
      overflow: 'hidden',
      'padding-top': '*',
      'padding-bottom': '*',
    })
  ),
  transition('* => void', animate('150ms ease-out')),
  transition('void => *', animate('150ms ease-in')),
]);
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.less',
  animations: [collapseAnimation],
})
export class CalendarComponent {
  isSmallScreen!: boolean;

  @Output() scrollCalendarEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() filterUpdated: EventEmitter<any> = new EventEmitter<any>();
  @Output() getData: EventEmitter<any> = new EventEmitter<any>();
  @Input() roomChips!: any;

  selectedValue!: string;
  departments: any;
  buildings: any;
  filters!: any[];
  openDialogFlag: boolean = false;
  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    throw new Error('Method not implemented.');
  }

  @ViewChild('roomList') roomList!: MatChipListbox;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  refresh = new Subject<void>();

  @Input() bookings: CalendarEvent[] = [];

  activeDayIsOpen: boolean = false;


  constructor(private RoomService: RoomsService, private filterService: FiltersService, private dialogService: DialogService, private bookingsService: BookingsService) {
    this.isSmallScreen = window.innerWidth < 600;
    document.documentElement.style.setProperty('--cellCount', `${5}`);
  }

  @HostListener('window:resize', ['$event'])
  onResize(_event: any) {
    this.isSmallScreen = window.innerWidth < 600; // Adjust the breakpoint as needed
  }

  ngOnInit(): void {
    this.setView(CalendarView.Month);

    this.RoomService.getBuildings({ user_id: 2 }).subscribe((resp: any) => {
      this.buildings = resp
      const roomFilters = _.cloneDeep(this.filterService.getRoomFilters(['buildings'], this.buildings));
      const otherFilters = _.cloneDeep(this.filterService.getFilters(['lecture_type']));
      this.filters =  [ ...otherFilters,...roomFilters] ;
    })

    this.selectedValue = 'Month';
  }

  viewDateUpadate(event: any) {
    const dayName = startOfMonth(event).getDay();
    const dateNumber = endOfMonth(event).getDate();
    if ((dayName == 0 && dateNumber >= 30) || (dayName == 6 && dateNumber > 30)) {
      document.documentElement.style.setProperty('--cellCount', `${6}`);
    } else {
      document.documentElement.style.setProperty('--cellCount', `${5}`);
    }
  }

  updateFilter(event: any) {
    if (event.building?.length > 0) {
      this.RoomService.getRooms({ building: event.building }).subscribe((resp: any) => {
        if (resp.rooms.length > 0) {
          this.filters[2] = this.filterService.getRoomFilters(['rooms'], resp.rooms)[0];
          if (event.room_id?.length > 0) {
            event.room_id.forEach((element: any) => {
              this.filters[2].chips.find((x: any) => x.id == element).selected = true
            });
          }
        }
      })
    }
    this.filterUpdated.emit(event);
  }
  //Set view kind to month, week or day
  setView(view: CalendarView) {
    this.view = view;
  }

  //Toggle day accordion
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  scrollCalendar(event: any) {
    this.scrollCalendarEvent.emit(event);
  }

  handleEvent(action: string, event: CalendarEvent) {
    switch (action) {
      case 'eventClicked':
        this.dialogService.openInfoDialog(event);
        break;
        case 'add':
        if(!this.openDialogFlag){
          this.openDialogFlag = true
          this.dialogService.openBookingFormDialog(event).subscribe((resp: any) => {
            if (resp) {
              this.bookingsService.createBooking(resp).subscribe((resp: any) => {
                if (resp) {
                  this.dialogService.openSuccessDialog(resp.message);
                  this.getData.emit()
                }
              })
            }
            this.openDialogFlag = false;
          });
        }
        break;
    }
  }

}
