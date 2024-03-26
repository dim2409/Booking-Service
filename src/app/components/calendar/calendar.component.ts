import {
  trigger,
  style,
  state,
  transition,
  animate,
  AnimationTriggerMetadata,
} from '@angular/animations'; 
import { Component, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { MatChipListbox } from '@angular/material/chips';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarModule, CalendarView, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { isSameMonth, isSameDay } from 'date-fns';
import { Subject } from 'rxjs';


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
  animations: [collapseAnimation]
})
export class CalendarComponent {


  isSmallScreen!: boolean;

  @Output() scrollCalendarEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() bookingClicked: EventEmitter<any> = new EventEmitter<any>();


  @Output() filterUpdated: EventEmitter<any> = new EventEmitter<any>();
  @Input() roomChips!: any;

  selectedValue!: string;
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


  constructor() {
    this.isSmallScreen = window.innerWidth < 600;
  }

  @HostListener('window:resize', ['$event'])
  onResize(_event: any) {
    this.isSmallScreen = window.innerWidth < 600; // Adjust the breakpoint as needed
  }

  ngOnInit(): void {
    this.setView(CalendarView.Month);

    this.selectedValue = 'Month';
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

}
