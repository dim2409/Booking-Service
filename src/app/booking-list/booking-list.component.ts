import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import {MatProgressBarModule} from '@angular/material/progress-bar';
@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatDividerModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './booking-list.component.html',
  styleUrl: './booking-list.component.less'
})
export class BookingListComponent {
  public options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
  alert(arg0: string) {
    alert(arg0)
  }

  @Output() bookingUpdated: EventEmitter<any> = new EventEmitter<any>();

  @Input() bookings: any[] = [];
  @Input() rooms: any[] = [];
  @Input() buttons: any[] = [];
  @Input() removeConflicts: boolean = false;
  constructor(private BookingsService: BookingsService) { }
  



//ToDo emmit event to parent
  buttonAction(action: string, booking: any) {
    this.bookingUpdated.emit({action: action, booking: booking});
  }
}
