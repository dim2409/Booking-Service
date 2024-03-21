import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatChipListbox, MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { CalendarComponentModule } from 'src/app/components/calendar/calendar.component.module';
import { FormsModule, NgForm } from '@angular/forms';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { RoomsService } from 'src/app/services/rooms/rooms.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-edit-booking-dialog',
  standalone: true,
  imports: [CommonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    CalendarComponentModule,
    MatOptionModule,
    FormsModule,],
  templateUrl: './edit-booking-dialog.component.html',
  styleUrl: './edit-booking-dialog.component.less'
})
export class EditBookingDialogComponent implements OnInit {
  start!: any;
  end!: any;
  selectedStart!: Date;
  selectedEnd!: Date;
  timeOptions: Date[] = [];
  selectedDate: Date = new Date();
  bookingTitle: any;
  bookings: any;

  rooms: any;
  roomIds: any;
  room!: BigInteger;
  selectedRoom: number = 1;

  recurringCheck: boolean = false;

  @ViewChild('chipList') chipList!: MatChipListbox;
  @ViewChild('bookingRequestForm') myForm!: NgForm;

  public days: any[] = [
    { label: 'Monday', name: 1, selected: false, start: Date, end: Date },
    { label: 'Tuesday', name: 2, selected: false, start: Date, end: Date },
    { label: 'Wednesday', name: 3, selected: false, start: Date, end: Date },
    { label: 'Thursday', name: 4, selected: false, start: Date, end: Date },
    { label: 'Friday', name: 5, selected: false, start: Date, end: Date },
  ];

  bookingInfo: any;

  constructor(private cdr: ChangeDetectorRef, private BookingsService: BookingsService, private RoomsService: RoomsService, private router: Router, private dialogService: DialogService, public dialogRef: MatDialogRef<ConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  toggleSelectDay(day: any) {
    day.selected = !day.selected;
  }

  ngOnInit() {

    this.RoomsService.getModeratedRooms(2).subscribe((resp: any) => {
      this.rooms = resp;
      this.roomIds = this.rooms.map((room: any) => room.id);
      this.BookingsService.getActiveBookings({ room_id: this.roomIds }).subscribe((resp: any) => {
        this.bookings = resp;
      });
    });
    this.bookingTitle = this.data.title;
    this.selectedRoom = this.data.room_id;
    this.recurringCheck = this.data.type === 'recurringGroup';
    this.selectedDate = new Date(this.data.start);

    this.bookingInfo = this.data.info;
    this.initializeTimeOptions();
    if (this.recurringCheck) {
      this.data.days.forEach((bookingDay: any) => {
        this.days.forEach((day: any) => {
          if (day.name == bookingDay.name) {
            day.id = bookingDay.id;
            day.start = this.getTimeOption(bookingDay.start);
            day.end = this.getTimeOption(bookingDay.end);
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
      ...this.data,
      ...bookingRequestForm.value,
      start: this.start,
      end: this.end,
      room_id: this.selectedRoom,
      is_recurring: this.recurringCheck,
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

  initializeTimeOptions() {
    for (let i = 8; i <= 20; i++) {
      const date = new Date(Date.UTC(2022, 0, 1, i, 0, 0));
      date.setHours(i, 0, 0);
      this.timeOptions.push(date);
    }
    this.selectedStart = this.getTimeOption(this.data.start);
    this.selectedEnd = this.getTimeOption(this.data.end);

  }

  getTimeOption(timeInput: Date) {
    const hours = new Date(timeInput).getHours();
    const minutes = new Date(timeInput).getMinutes();
    const timeIndex = this.timeOptions.findIndex(time => {
      return time.getHours() === hours && time.getMinutes() === minutes;
    })
    return this.timeOptions[timeIndex];
  }
}
