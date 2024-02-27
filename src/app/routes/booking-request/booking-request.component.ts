import { Component, ViewChild } from '@angular/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker'
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
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule, CalendarComponentModule, MatOptionModule, FormsModule],
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

  constructor(private BookingsService: BookingsService, private RoomsService: RoomsService, private router: Router) { }

  selectedStart!: BigInteger;
  selectedEnd!: BigInteger;
  room!: BigInteger;
  @ViewChild('bookingRequestForm') myForm!: NgForm;


  ngOnInit() {
    this.BookingsService.getActiveBookings().then((resp: any) => {
      this.bookings = resp;
    });
    this.RoomsService.getRooms().then((resp: any) => {
      this.rooms = resp;
    });

    this.initializeTimeOptions();
  }
  onSubmit(bookingRequestForm: any) {

    this.start = new Date(bookingRequestForm.value.date.setHours(this.selectedStart[0], 0, 0));
    this.end = new Date(bookingRequestForm.value.date.setHours(this.selectedEnd[0], 0, 0));
    console.log(this.start);
    console.log(this.end);
    console.log(this.selectedStart);
    console.log(this.selectedEnd);
    bookingRequestForm.value.start = this.selectedStart;
    bookingRequestForm.value.end = this.selectedEnd;
    bookingRequestForm.value.room_id = this.selectedRoom;
    /* this.BookingsService.createBooking(bookingRequestForm.value).subscribe((response) => {
      alert("Booking created successfully!");

      this.router.navigateByUrl('/myBookings');
    }); */
  }
  selectRoom(event: MatSelectChange) {
    this.selectedRoom = event.value;

    this.BookingsService.getBookingByRoom(this.selectedRoom).then((resp: any) => {
      this.bookings = resp;
    })

  }
  selectDateTime(event: MatSelectChange) {
    console.log(event.value);
  }
  initializeTimeOptions() {
    for (let i = 8; i <= 20; i++) {
      const date = this.selectedDate;
      date.setHours(i, 0, 0);
      console.log(date);
      this.timeOptions.push(date);
    }
  }
}
