import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DayNamePipe } from "../../pipes/day-name.pipe";
@Component({
    selector: 'app-card-list',
    standalone: true,
    templateUrl: './card-list.component.html',
    styleUrl: './card-list.component.less',
    imports: [MatCardModule, CommonModule, MatDividerModule, MatButtonModule, MatProgressBarModule, DayNamePipe]
})
export class CardListComponent {
  public options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
  alert(arg0: string) {
    alert(arg0)
  }

  @Output() bookingUpdated: EventEmitter<any> = new EventEmitter<any>();
  @Output() bookingSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() addEvent: EventEmitter<any> = new EventEmitter<any>();

  @Input() elements: any[] = [];
  @Input() rooms: any[] = [];
  @Input() buttons: any[] = [];
  @Input() removeConflicts: boolean = false;
  constructor(private BookingsService: BookingsService) { }

  buttonAction(action: string, booking: any) {
    this.bookingUpdated.emit({ action: action, selectedBookings: [booking.id], type: 'normal' , individualAction: true, booking: booking});
  }
  toggleSelect(booking: any) {
    booking.selected = !booking.selected;
    this.bookingSelected.emit(booking.selected);
  }

  add() {
    this.addEvent.emit();
  }
}
