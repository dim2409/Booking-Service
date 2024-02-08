import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarModule, CalendarView, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { isSameMonth, isSameDay } from 'date-fns';
import { Subject } from 'rxjs';
import { BookingInfoDialogComponent } from 'src/app/dialogs/booking-info-dialog/booking-info-dialog.component';

/* Services */
import { BookingsService } from 'src/app/services/bookings.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.less'
})
export class CalendarComponent {
  handleEvent(arg0: string, event: CalendarEvent) {
    const dialogRef = this.dialog.open(BookingInfoDialogComponent, {
      data: event,
      autoFocus: false,
      width: "90vw",
      height: "90%",
      maxWidth: "90vw"
    });
    return dialogRef.afterClosed();
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

  bookings: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;
  events: any;

  constructor(private BookingsService: BookingsService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.setView(CalendarView.Month);
    this.bookings = this.BookingsService.getBookings();
    console.log(this.bookings);
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
