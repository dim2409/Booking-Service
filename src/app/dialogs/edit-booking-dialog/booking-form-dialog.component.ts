import { ChangeDetectorRef, Component, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatSelect, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatChipListbox, MatChipsModule } from '@angular/material/chips';
import { MatInput, MatInputModule } from '@angular/material/input';
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
import { MatCardModule } from '@angular/material/card';
import _ from 'lodash';

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
    MatMenuModule,
    MatCardModule],
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
  selectedType: any;
  selectedAttendance: any;
  reqStartOptions = Array.from({ length: 7 }, () => []);
  reqEndOptions = Array.from({ length: 7 }, () => []);
  selectedDate: Date = new Date();
  bookingTitle: any;
  bookings: any;

  lectureTypeChips = [
    {
      name: 'Lecture',
      selected: false,
      id: 'lecture'
    },
    {
      name: 'Seminar',
      selected: false,
      id: 'seminar'
    },
    {
      name: 'Teleconference',
      selected: false,
      id: 'teleconference'
    },
    {
      name: 'Other',
      selected: false,
      id: 'other'
    },
  ]
  attendance = [
    {
      name: '<20',
      selected: false,
      id: '20'
    },
    {
      name: '20-50',
      selected: false,
      id: '20-50'
    },
    {
      name: '50-100',
      selected: false,
      id: '50-100'
    },
    {
      name: '>100',
      selected: false,
      id: '>100'
    },
  ]

  rooms: any;
  roomIds: any;
  room!: BigInteger;
  selectedRoom: number = 1;

  recurringCheck: boolean = false;
  publicityCheck: boolean = false;

  @ViewChild('chipList') chipList!: MatChipListbox;
  @ViewChild('bookingRequestForm') myForm!: NgForm;
  @ViewChild('timeMenu') timeMenu!: MatMenu;

  @ViewChildren(MatSelect) matSelects!: QueryList<MatSelect>;
  @ViewChildren(MatInput) matInputs!: QueryList<MatInput>;


  public days: any[] = [
    { label: 'M', name: 1, selected: false, start: new Date(), end: new Date() },
    { label: 'T', name: 2, selected: false, start: new Date(), end: new Date() },
    { label: 'W', name: 3, selected: false, start: new Date(), end: new Date() },
    { label: 'T', name: 4, selected: false, start: new Date(), end: new Date() },
    { label: 'F', name: 5, selected: false, start: new Date(), end: new Date() },
    { label: 'S', name: 6, selected: false, start: new Date(), end: new Date() },
    { label: 'S', name: 7, selected: false, start: new Date(), end: new Date() },
  ];

  public options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };

  bookingInfo: any;
  bookingUrl: any;

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

    if (this.data.booking) {
      this.bookingTitle = this.data.booking.title;
      this.selectedRoom = this.data.booking.room_id;
      this.recurringCheck = this.data.booking.type === 'recurringGroup';
      this.selectedDate = new Date(this.data.booking.start);

      this.bookingUrl = this.data.booking.url

      this.bookingInfo = this.data.booking.info;
      this.selectedStart = _.cloneDeep(this.data.booking.start);
      this.selectedEnd = _.cloneDeep(this.data.booking.end);

      this.initializeTimeOptions(this.startOptions);
      this.initializeTimeOptions(this.endOptions, this.selectedStart);

      if (this.recurringCheck) {
        this.data.booking.days.forEach((bookingDay: any) => {
          this.days.forEach((day: any) => {
            if (day.name == bookingDay.name) {
              day.id = bookingDay.id;
              day.start = _.cloneDeep(bookingDay.start);
              day.end = _.cloneDeep(bookingDay.end);
              day.room_id = bookingDay.room_id;
              day.selected = true;
              this.initializeTimeOptions(this.reqStartOptions[day.name - 1]);
              this.initializeTimeOptions(this.reqEndOptions[day.name - 1], day.start);
              //day.end.setTime(this.reqStartOptions[day.name - 1][0]);
            }
          })
        })
      }
    } else {
      this.initializeTimeOptions(this.startOptions);
      this.selectedStart.setTime(this.startOptions[0].getTime());
      this.initializeTimeOptions(this.endOptions, this.selectedStart);
      this.selectedEnd.setTime(this.endOptions[0].getTime());
      this.selectedEnd.setHours(this.selectedEnd.getHours() + 1);
      this.selectedDate = this.data.date;
    }

    this.data.booking?.publicity == 1 ? this.publicityCheck = true : this.publicityCheck = false;

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
      lecture_type: this.selectedType,
      expected_attendance: this.selectedAttendance,
      start: this.start,
      end: this.end,
      room_id: this.selectedRoom,
      is_recurring: this.recurringCheck,
      publicity: this.publicityCheck ? 1 : 0,
      url: this.bookingUrl ?? null,
      info: this.bookingInfo ?? null,
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
    console.log(booking)
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

  initializeTimeOptions(timeOptions: Date[], pivot: Date | null = null) {
    timeOptions?.length ? timeOptions.length = 0 : timeOptions;
    const start = pivot ? moment.tz(pivot, 'Europe/Athens') : moment.tz('2022-01-01T08:00:00', 'Europe/Athens');
    for (let i = start.hours(); i <= 20; i++) {
      const startMinute = start.minutes();
      for (let j = startMinute; j < 60; j += 15) {
        const date = moment.tz('2022-01-01T00:00:00', 'Europe/Athens').add(i, 'hours').add(j, 'minutes').toDate();
        timeOptions.push(date);
      }
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

  onReqToggleChange(event: MatSlideToggleChange) {
    this.recurringCheck = event.checked;
    this.days.forEach((day: any) => {
      day.selected = false;
      this.initializeTimeOptions(this.reqStartOptions[day.name - 1]);
      day.start.setTime(this.reqStartOptions[day.name - 1][0]);
      this.initializeTimeOptions(this.reqEndOptions[day.name - 1], day.start);
      day.end.setTime(this.reqStartOptions[day.name - 1][0]);
      day.end.setHours(day.end.getHours() + 1);

    })
  }
  openSelect(selectId: string) {
    const select = this.matSelects.find(item => item.id === selectId);
    if (select) {
      select.open();
    } else {
      console.error('MatSelect not found with ID:', selectId);
    }
  }
  onInputChange(value: any) {
    // Parse the input value using Moment.js
    const parsedTime = moment(value, 'HH:mm');
    var regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    if (regex.test(value)) {
      this.selectedStart = moment(value, 'HH:mm').toDate();
    }

    // Check if the parsed time is valid
    if (parsedTime.isValid()) {
      // Create a Date object from the parsed time
      const pivotDate = parsedTime.toDate();

      // Call the initializeTimeOptions function with the pivotDate
      this.initializeTimeOptions(this.endOptions, pivotDate);
    } else {
      console.error('Invalid input format. Please use the format "HH:mm".');
    }
  }
  onReqInputChange(value: any, id: number, start: boolean) {
    value = value.target?.value ?? value;
    if (start) {
      const input = this.matInputs.find(item => item.id == id + 'StartInput');
      if (input) {
        var regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
        if (regex.test(value)) {
          this.days[id - 1].start = moment(value, 'HH:mm');
        }
        const parsedTime = moment(value, 'HH:mm');
        if (parsedTime.isValid()) {
          // Create a Date object from the parsed time
          const pivotDate = parsedTime.toDate();
          // Call the initializeTimeOptions function with the pivotDate
          this.initializeTimeOptions(this.reqEndOptions[id - 1], pivotDate);
          this.days[id - 1].end = _.cloneDeep(this.reqStartOptions[id - 1][0]);
          this.days[id - 1].end.setHours(this.days[id - 1].end.getHours() + 1);
        }
      } else {
        console.error('MatInput not found with ID:', id);
      }
    } else {
      var regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
      if (regex.test(value)) {
        this.days[id - 1].end = moment(value, 'HH:mm');
      }
    }
  }
  onSelectionChange(selectedValue: any, id: number, start: boolean) {
    const day = this.days.find(day => day.name == id);
    if (start) {
      day.start = selectedValue;
    } else {
      day.end = selectedValue;
    }
  }
}