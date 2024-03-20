import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CalendarComponentModule } from 'src/app/components/calendar/calendar.component.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { RoomsService } from 'src/app/services/rooms/rooms.service';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { get } from 'lodash';
import { FiltersComponent } from "../../components/filters/filters.component";
@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.less',
    imports: [CommonModule, CalendarComponentModule, MatDialogModule, MatMenuModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, RouterModule, FiltersComponent]
})
export class HomeComponent {
  roomIds: any = "";
  date: any;
  bookings: any;
  rooms: any;

  constructor(private BookingsService: BookingsService, private RoomsService: RoomsService, private dialogService: DialogService) { }
  ngOnInit(): void {
    this.RoomsService.getRooms().subscribe((resp: any) => {
      this.rooms = resp;
    });
    this.getBookings();
  }
  filterUpdated(event: any) {
    this.getBookings(event);
  }
  openInfo(booking: any) {
    this.dialogService.openInfoDialog(booking);
  }

  scrollCalendar(event: any) {
    this.date = event.viewDate;
    this.getBookings();
  }

  getBookings(req?: any) {
    this.BookingsService.getActiveBookings(req).subscribe((resp: any) => {
      this.bookings = resp;
    });
  }
}
