import { Component, ViewChild } from '@angular/core';
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
@Component({
  selector: 'app-booking-request',
  standalone: true,
  imports: [
    CommonModule,
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
    FormsModule],
  templateUrl: './booking-request.component.html',
  styleUrl: './booking-request.component.less'
})
export class BookingRequestComponent {
  start!: Date;
  end!: Date;
  bookings: any;
  rooms: any;
  selectedRoom: number = 1;
  timeOptions: Date[] = [];
  selectedDate: Date = new Date();
  recurringCheck: boolean = false;
  @ViewChild('chipList') chipList!: MatChipListbox;
  roomIds: any;
  constructor(private BookingsService: BookingsService, private RoomsService: RoomsService, private router: Router) { }

  selectedStart!: Date;
  selectedEnd!: Date;
  room!: BigInteger;
  @ViewChild('bookingRequestForm') myForm!: NgForm;
  public days: any[] = [
    { label: 'Monday', name: 1, selected: false, start: Date, end: Date },
    { label: 'Tuesday', name: 2, selected: false, start: Date, end: Date },
    { label: 'Wednesday', name: 3, selected: false, start: Date, end: Date },
    { label: 'Thursday', name: 4, selected: false, start: Date, end: Date },
    { label: 'Friday', name: 5, selected: false, start: Date, end: Date },
  ];

  toggleSelectDay(day: any) {
    day.selected = !day.selected;
  }

  ngOnInit() {
    this.RoomsService.getRooms().subscribe((resp: any) => {
      this.rooms = resp;
      this.roomIds = this.rooms.map((room: any) => room.id);
      this.BookingsService.getActiveBookings({ room_id: this.roomIds }).subscribe((resp: any) => {
        this.bookings = resp;
      });
    });
    
    this.initializeTimeOptions();
  }
  onSubmit(bookingRequestForm: any) {
    const timezoneOffset = new Date().getTimezoneOffset() / 60;
    const athensOffset = 0; // UTC+3 for Europe/Athens
    const timezoneDifference = athensOffset - timezoneOffset;

    const startTime = new Date(this.selectedStart);
    startTime.setHours(startTime.getHours() + timezoneDifference);
    const startHour = startTime.getHours();
    const startMinute = startTime.getMinutes();

    // Extract time from selected end time
    const endTime = new Date(this.selectedEnd);
    endTime.setHours(endTime.getHours() + timezoneDifference);
    const endHour = endTime.getHours();
    const endMinute = endTime.getMinutes();

    this.start = new Date(bookingRequestForm.value.date);
    this.end = new Date(bookingRequestForm.value.date);
    this.start.setHours(startHour, startMinute);
    this.end.setHours(endHour, endMinute);

    var booking = {
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
          start.setHours(start.getHours() + timezoneDifference);
          day.start= start;
          const end = new Date(day.end);
          end.setHours(end.getHours() + timezoneDifference);
          day.end= end;
          booking.days.push(day);
          booking.start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          booking.end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        }
      });
    }

    this.BookingsService.createBooking(booking).subscribe((response) => {
      alert("Booking created successfully!");

      this.router.navigateByUrl('/myBookings');
    });
  }
  selectRoom(event: MatSelectChange) {
    this.selectedRoom = event.value;

    const roomArray  = [this.selectedRoom]
    this.BookingsService.getActiveBookings(roomArray).subscribe((resp: any) => {
      this.bookings = resp;
    })

  }
  initializeTimeOptions() {
    for (let i = 8; i <= 20; i++) {
      const date = new Date(Date.UTC(2022, 0, 1, i, 0, 0));
      date.setHours(i, 0, 0);
      this.timeOptions.push(date);
    }
  }
}
