import { Component, ViewChild } from '@angular/core';

import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { CalendarComponentModule } from 'src/app/components/calendar/calendar.component.module';
import { FormsModule, NgForm } from '@angular/forms';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
@Component({
  selector: 'app-booking-request',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule, CalendarComponentModule, FormsModule],
  templateUrl: './booking-request.component.html',
  styleUrl: './booking-request.component.less'
})
export class BookingRequestComponent {
  start!: Date;
  end!: Date;

  constructor(private BookingsService: BookingsService) { }
  
  selectedStart!: BigInteger;
  selectedEnd!: BigInteger;
  room!: BigInteger;
  @ViewChild('bookingRequestForm') myForm!: NgForm;
  onSubmit(bookingRequestForm: any) {
    this.start = new Date(bookingRequestForm.value.date.setHours(this.selectedStart[0],0,0));
    this.end = new Date(bookingRequestForm.value.date.setHours(this.selectedEnd[0],0,0));
    bookingRequestForm.value.start = this.start;
    bookingRequestForm.value.end = this.end;
    this.BookingsService.createBooking(bookingRequestForm.value).subscribe((response) => {
      console.log(response);
    });
  }
}
