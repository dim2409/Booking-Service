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
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CalendarComponentModule, MatDialogModule, MatMenuModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less'
})
export class HomeComponent {
  roomIds: any;
  selectRoom(event: MatSelectChange) {
    const selectedRoom = event.value;
    if (selectedRoom === 'all') {
      this.BookingsService.getActiveBookings({'room_id': this.roomIds}).subscribe((resp: any) => {
        this.bookings = resp;
      });
    }else{
      const roomArray: number[] = [selectedRoom]
      this.BookingsService.getActiveBookings({'room_id': roomArray}).subscribe((resp: any) => {
        this.bookings = resp;
      })
    }
  }
  bookings: any;
  rooms: any;

  constructor(private BookingsService: BookingsService, private RoomsService: RoomsService, private dialogService: DialogService) { }
  ngOnInit(): void {
    this.RoomsService.getRooms().subscribe((resp: any) => {
      this.rooms = resp;
      this.roomIds = this.rooms.map((room: any) => room.id);
      this.BookingsService.getActiveBookings({'room_id': this.roomIds}).subscribe((resp: any) => {
        this.bookings = resp;
      });
    });
  }
  openInfo(booking: any) {
    this.dialogService.openInfoDialog(booking);
  }
}
