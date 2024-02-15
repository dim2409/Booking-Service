import { Component } from '@angular/core';

import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { CalendarComponentModule } from 'src/app/components/calendar/calendar.component.module';
@Component({
  selector: 'app-booking-request',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule, CalendarComponentModule],
  templateUrl: './booking-request.component.html',
  styleUrl: './booking-request.component.less'
})
export class BookingRequestComponent {

}
