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
  req: any = {
    
  }

  constructor(private BookingsService: BookingsService, private RoomsService: RoomsService, private dialogService: DialogService) { }
  ngOnInit(): void {
    this.RoomsService.getRooms().subscribe((resp: any) => {
      this.rooms = resp;
    });
    this.getBookings();
    document.body.classList.remove('body-overflow');
  }
  filterUpdated(event: any) {
    event.room_id !== '' ? this.req.room_id = event.room_id : delete this.req.room_id;
    this.getBookings();
  }
  openInfo(booking: any) {
    this.dialogService.openInfoDialog(booking);
  }

  scrollCalendar(event: any) {
    this.req.date = event.viewDate;
    this.getBookings();
  }

  getBookings() {
    this.BookingsService.getActiveBookings(this.req).subscribe((resp: any) => {
      this.bookings = resp;
    });
  }
}
