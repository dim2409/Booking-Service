import { Component, Input } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarModule, CalendarView, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { isSameMonth, isSameDay } from 'date-fns';
import { Subject } from 'rxjs';

/* Services */
import { DialogService } from 'src/app/services/dialog/dialog.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.less'
})
export class CalendarComponent {
  selectedValue!: string;
  handleEvent(arg0: string, event: CalendarEvent) {
    this.dialogService.openInfoDialog(event);
  }
  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent):void {
    throw new Error('Method not implemented.');
  }

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  refresh = new Subject<void>();

  @Input() bookings: CalendarEvent[] = [];

  activeDayIsOpen: boolean = false;
  events: any;

  
  constructor(private dialogService: DialogService) { }

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
}
