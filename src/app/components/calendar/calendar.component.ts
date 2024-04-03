import {
  trigger,
  style,
  state,
  transition,
  animate,
  AnimationTriggerMetadata,
} from '@angular/animations';
import { Component, EventEmitter, HostListener, Injectable, Input, Output, ViewChild } from '@angular/core';
import { MatChipListbox } from '@angular/material/chips';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarModule, CalendarView, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { isSameMonth, isSameDay, subWeeks, startOfMonth, addWeeks, endOfMonth } from 'date-fns';
import _ from 'lodash';
import { Subject } from 'rxjs';
import { FiltersService } from 'src/app/services/filters/filters.service';
import { RoomsService } from 'src/app/services/rooms/rooms.service';
import { GetMonthViewArgs, MonthView } from 'calendar-utils';
import { CalendarUtils } from 'angular-calendar';

@Injectable()
export class MyCalendarUtils extends CalendarUtils {
  //ToDo: add check for last day of month to show same number of rows 
  override getMonthView(args: GetMonthViewArgs): MonthView {
    args.viewStart = subWeeks(startOfMonth(args.viewDate), 1);
    args.viewEnd = addWeeks(endOfMonth(args.viewDate), 0);
    return super.getMonthView(args);
  }
}
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
  providers: [
    {
      provide: CalendarUtils,
      useClass: MyCalendarUtils,
    },
  ],
})
export class CalendarComponent {
  isSmallScreen!: boolean;

  @Output() scrollCalendarEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() bookingClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() filterUpdated: EventEmitter<any> = new EventEmitter<any>();
  @Input() roomChips!: any;

  selectedValue!: string;
  departments: any;
  buildings: any;
  filters!: any[];
  handleEvent(arg0: string, event: CalendarEvent) {
    this.bookingClicked.emit(event);
  }
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
  events: any;


  constructor(private RoomService: RoomsService, private filterService: FiltersService) {
    this.isSmallScreen = window.innerWidth < 600;
  }

  @HostListener('window:resize', ['$event'])
  onResize(_event: any) {
    this.isSmallScreen = window.innerWidth < 600; // Adjust the breakpoint as needed
  }

  ngOnInit(): void {
    this.setView(CalendarView.Month);

    this.RoomService.getBuildings({ user_id: 2 }).subscribe((resp: any) => {
      this.buildings = resp
      this.filters = _.cloneDeep(this.filterService.getRoomFilters(['buildings'], this.buildings));
    })

    this.selectedValue = 'Month';
  }

  updateFilter(event: any) {
    if (event.building?.length > 0) {
      this.RoomService.getRooms({ building: event.building }).subscribe((resp: any) => {
        if (resp.rooms.length > 0) {
          this.filters[1] = this.filterService.getRoomFilters(['rooms'], resp.rooms)[0];
          if (event.room_id?.length > 0) {
            event.room_id.forEach((element: any) => {
              this.filters[1].chips.find((x: any) => x.id == element).selected = true
            });
          }
          console.log(this.filters)
        }
      })
    }
    this.filterUpdated.emit(event);
  }
  //Set view kind to month, week or day
  setView(view: CalendarView) {
    /* if(view=='month'){
      getMonthView
    } */
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

}
