import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatChipListbox, MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, NgForm } from '@angular/forms';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { RoomsService } from 'src/app/services/rooms/rooms.service';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import * as moment from 'moment-timezone';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenu, MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-booking-form-dialog',
  standalone: true,
  imports: [CommonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatButtonModule,
    MatOptionModule,
    FormsModule,
    DragDropModule,
    MatMenuModule],
  templateUrl: './booking-form-dialog.component.html',
  styleUrl: './booking-form-dialog.component.less'
})
export class BookingFormDialogComponent implements OnInit {
  start!: any;
  end!: any;
  selectedStart: Date = new Date();
  selectedEnd: Date = new Date();
  startOptions: Date[] = [];
  endOptions: Date[] = [];
  selectedDate: Date = new Date();
  bookingTitle: any;
  bookings: any;

  rooms: any;
  roomIds: any;
  room!: BigInteger;
  selectedRoom: number = 1;

  recurringCheck: boolean = false;
  publicityCheck: boolean = false;

  @ViewChild('chipList') chipList!: MatChipListbox;
  @ViewChild('bookingRequestForm') myForm!: NgForm;
  @ViewChild('timeMenu') timeMenu!: MatMenu;

  public days: any[] = [
    { label: 'Monday', name: 1, selected: false, start: Date, end: Date },
    { label: 'Tuesday', name: 2, selected: false, start: Date, end: Date },
    { label: 'Wednesday', name: 3, selected: false, start: Date, end: Date },
    { label: 'Thursday', name: 4, selected: false, start: Date, end: Date },
    { label: 'Friday', name: 5, selected: false, start: Date, end: Date },
  ];

  public options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };

  bookingInfo: any;

  constructor(
    private BookingsService: BookingsService,
    private RoomsService: RoomsService,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }


  toggleSelectDay(day: any) {
    day.selected = !day.selected;
  }

  ngOnInit() {
    console.log(this.data)
    if (this.data.rooms) {
      this.rooms = this.data.rooms;
    } else {
      this.RoomsService.getAllRooms().subscribe((resp: any) => {
        this.rooms = resp;
      });
    }
    console.log(this.rooms)
    
   

    this.initializeTimeOptions(this.startOptions, this.selectedStart);
    this.initializeTimeOptions(this.endOptions, this.selectedEnd, this.selectedStart);
    this.selectedEnd.setHours(this.selectedEnd.getHours() + 1);
    this.data.recurringCheck ? this.recurringCheck = true : this.recurringCheck = false;

    this.data.booking?.publicity == 1 ? this.publicityCheck = true : this.publicityCheck = false;

    if (this.data.booking) {
      this.bookingTitle = this.data.booking.title;
      this.selectedRoom = this.data.booking.rooms[0].id;
      this.recurringCheck = this.data.booking.type === 'recurringGroup';
      this.selectedDate = new Date(this.data.booking.start);

      this.bookingInfo = this.data.booking.info;
      this.selectedStart = this.getTimeOption(this.data.booking.start, this.startOptions);
      this.selectedEnd = this.getTimeOption(this.data.booking.end, this.endOptions);
    }
    if (this.recurringCheck) {
      this.data.booking.days.forEach((bookingDay: any) => {
        this.days.forEach((day: any) => {
          if (day.name == bookingDay.name) {
            day.id = bookingDay.id;
            day.start = this.getTimeOption(bookingDay.start, this.startOptions);
            day.end = this.getTimeOption(bookingDay.end, this.endOptions);
            day.room_id = bookingDay.room_id;
            day.selected = true;
          }
        })
      })
    }
  }
  onSave(bookingRequestForm: any) {

    const startTime = new Date(this.selectedStart);
    const startHour = startTime.getHours();
    const startMinute = startTime.getMinutes();

    // Extract time from selected end time
    const endTime = new Date(this.selectedEnd);
    const endHour = endTime.getHours();
    const endMinute = endTime.getMinutes();

    this.start = new Date(bookingRequestForm.value.date);
    this.end = new Date(bookingRequestForm.value.date);
    this.start.setHours(startHour, startMinute, 0, 0);
    this.end.setHours(endHour, endMinute, 0, 0);
    this.start = moment.utc(this.start).tz('Europe/Athens').format();
    this.end = moment.utc(this.end).tz('Europe/Athens').format();

    var booking = {
      ...this.data.booking,
      ...this.data,
      ...bookingRequestForm.value,
      start: this.start,
      end: this.end,
      room_id: this.selectedRoom,
      is_recurring: this.recurringCheck,
      publicity: this.publicityCheck ? 1 : 0,
      days: []
    }
    if (this.recurringCheck) {
      const today = new Date();
      this.days.forEach(day => {
        if (day.selected) {
          const start = new Date(day.start);
          day.start = start;
          day.start = moment.utc(day.start).tz('Europe/Athens').format();
          const end = new Date(day.end);
          day.end = end;
          day.end = moment.utc(day.end).tz('Europe/Athens').format();
          booking.days.push(day);
          booking.start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          booking.end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        }
      });
    }
    this.dialogRef.close(booking);
  }
  close() {
    this.dialogRef.close(false);
  }
  selectRoom(event: MatSelectChange) {
    this.selectedRoom = event.value;

    const roomArray: number[] = [this.selectedRoom]
    this.BookingsService.getActiveBookings({ room_id: roomArray }).subscribe((resp: any) => {
      this.bookings = resp;
    })

  }


  initializeTimeOptions(timeOptions: Date[], selectedTime: Date, pivot: Date | null = null) {
    timeOptions.length = 0;
    const start = pivot ? moment.tz(pivot, 'Europe/Athens') : moment.tz('2022-01-01T08:00:00', 'Europe/Athens');

    for (let i = start.hours(); i <= 18; i++) {
      const startMinute = (i === start.hours()) ? start.minutes() : 0;
      for (let j = startMinute; j < 60; j += 15) {
        const date = moment.tz('2022-01-01T00:00:00', 'Europe/Athens').add(i, 'hours').add(j, 'minutes').toDate();
        timeOptions.push(date);
      }
    }
    // Update selectedTime to match the first time option
    selectedTime.setTime(timeOptions[0].getTime());
  }
  onInputChange(value: any) {
    console.log(value);
    // Parse the input value using Moment.js
    const parsedTime = moment(value, 'HH:mm');

    // Check if the parsed time is valid
    if (parsedTime.isValid()) {
      // Create a Date object from the parsed time
      const pivotDate = parsedTime.toDate();

      // Call the initializeTimeOptions function with the pivotDate
      this.initializeTimeOptions(this.endOptions, this.selectedEnd, pivotDate);
    } else {
      console.error('Invalid input format. Please use the format "HH:mm".');
    }
  }
  getTimeOption(timeInput: Date, timeOptions: Date[]) {
    const hours = new Date(timeInput).getHours();
    const minutes = new Date(timeInput).getMinutes();
    const timeIndex = timeOptions.findIndex(time => {
      return time.getHours() === hours && time.getMinutes() === minutes;
    })
    return timeOptions[timeIndex];
  }
}
