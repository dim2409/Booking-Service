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

  selectedStart!: Date;
  selectedEnd!: Date;
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

    const startTime = new Date(this.selectedStart);
    const startHour = startTime.getHours();
    const startMinute = startTime.getMinutes();

    // Extract time from selected end time
    const endTime = new Date(this.selectedEnd);
    const endHour = endTime.getHours();
    const endMinute = endTime.getMinutes();
    this.start = new Date(bookingRequestForm.value.date);
    this.end = new Date(bookingRequestForm.value.date);
    this.start.setHours(startHour, startMinute);
    this.end.setHours(endHour, endMinute);

    bookingRequestForm.value.start = this.start;
    bookingRequestForm.value.end = this.end;
    bookingRequestForm.value.room_id = this.selectedRoom;
    this.BookingsService.createBooking(bookingRequestForm.value).subscribe((response) => {
      alert("Booking created successfully!");

      this.router.navigateByUrl('/myBookings');
    });
  }
  selectRoom(event: MatSelectChange) {
    this.selectedRoom = event.value;

    this.BookingsService.getBookingByRoom(this.selectedRoom).then((resp: any) => {
      this.bookings = resp;
    })

  }
  initializeTimeOptions() {
    for (let i = 8; i <= 20; i++) {
      const date = new Date();
      date.setHours(i, 0, 0);
      console.log(date);
      this.timeOptions.push(date);
    }
  }
}
