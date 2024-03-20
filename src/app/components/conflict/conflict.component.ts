import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { BookingListComponent } from 'src/app/components/booking-list/booking-list.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { DayNamePipe } from "../../pipes/day-name.pipe";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { RoomsService } from 'src/app/services/rooms/rooms.service';
import { Observable } from 'rxjs';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import moment from 'moment';
import { LoadingSpinnerComponent } from "../loading-spinner/loading-spinner.component";
@Component({
  selector: 'app-conflict',
  standalone: true,
  templateUrl: './conflict.component.html',
  styleUrl: './conflict.component.less',
  imports: [
    BookingListComponent,
    MatOptionModule,
    CommonModule,
    MatExpansionModule,
    DayNamePipe,
    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatDividerModule,
    LoadingSpinnerComponent
  ]
})
export class ConflictComponent implements OnInit {


  @Output() bookingUpdated: EventEmitter<any> = new EventEmitter<any>();

  @Input() conflictGroup: any;
  @Input() isRecurring: any;
  @Input() rooms: any[] = [];

  buttons = [
    {
      icon: 'fa-expand',
      action: 'openInfo',
    },
    {
      icon: 'fa-pencil',
      action: 'editBooking',
    },
  ]
  drawerLoading!: boolean;


  constructor(private bookingsService: BookingsService, private dialogService: DialogService,) { }

  ngOnInit() {
    this.conflictGroup.bookings.forEach((booking: any) => {
      booking.resolved = false;
      booking.toKeep = false;
      if (this.isRecurring) {
        booking.days.forEach((day: any) => {
          const start = new Date(day.start);
          day.start = start;
          day.start = moment.utc(day.start).tz('Europe/Athens').format();
          const end = new Date(day.end);
          day.end = end;
          day.end = moment.utc(day.end).tz('Europe/Athens').format();
        })
      } else {
        booking.start = moment.utc(booking.start).tz('Europe/Athens').format();
        booking.end = moment.utc(booking.end).tz('Europe/Athens').format();

      }
    })
    this.conflictGroup.bookings[0].toKeep = true
  }

  updateBooking(event: any) {
    this.bookingUpdated.emit({ action: event.action, booking: event.conflictGroup });
  }
  buttonAction(action: string, booking: any, event: MouseEvent) {
    event.stopPropagation();
    switch (action) {
      case 'openInfo': {
        this.dialogService.openInfoDialog(booking)
        break
      }
      case 'editBooking': {
        this.editBooking(booking)
      }
    }
  }


  selectToKeep(booking: any) {
    this.conflictGroup.bookings.find((b: any) => b.toKeep == true).toKeep = false
    booking.toKeep = true
    this.checkResolved();
  }
  editBooking(data: any) {
    let booking = data
    booking.type = this.isRecurring ? 'recurringGroup' : ''
    const bookingIndex = this.conflictGroup.bookings.findIndex((b: any) => b.id === booking.id)
    this.dialogService.openEditBookingDialog(booking).subscribe((resp: any) => {
      if (resp) {
        booking = resp
        this.conflictGroup.bookings[bookingIndex] = resp
        this.checkResolved();
        this.updateBooking(booking);
      }
    })
  }

  checkResolved() {
    this.conflictGroup.bookings.forEach((booking: any) => {
      this.drawerLoading = true
      this.checkConflicts(booking).subscribe((resp) => {
        if (!resp) {
          if (!this.checkEditingConflict(booking)) {
            this.drawerLoading = false
            booking.resolved = true
          } else {
            this.drawerLoading = false
            booking.resolved = false
          }
        } else {
          this.drawerLoading = false
          booking.resolved = false
        }
      })
    })
  }

  checkConflicts(booking: any): Observable<any> {
    booking.isRecurring = this.isRecurring;
    return new Observable<boolean>(observer => {
      let isConflicting = false
      this.bookingsService.checkConflict(booking).subscribe((resp: any) => {
        if (resp.isConflicting) {
          const filteredConflicts = resp.conflicts.filter((conflict: any) => {
            const localConflict = this.conflictGroup.bookings.find((b: any) => b.id === conflict.id);
            return !localConflict || !localConflict.resolved;
          });
          if (filteredConflicts.length > 0) {
            isConflicting = true;
          }
        }
        observer.next(isConflicting);
        observer.complete();
      });
    });
  }

  checkEditingConflict(newBooking: any) {
    let conflicts = false;
    this.conflictGroup.bookings.forEach((booking: any) => {
      if (newBooking.id !== booking.id && (
        (newBooking.start >= booking.start && newBooking.start < booking.end) ||
        (newBooking.end > booking.start && newBooking.end <= booking.end) ||
        (newBooking.start < booking.start && newBooking.end > booking.end)
      )) {
        conflicts = true;
      }
    })
    return conflicts;
  }

  resolve(event: any) {
    this.dialogService.openConfirmDialog(this.conflictGroup, 'Are you sure you want to resolve this conflict?').subscribe((resp: any) => {
      if (resp) {
        if (!this.isRecurring) {
          this.bookingsService.resolveConflict(this.conflictGroup).subscribe((resp: any) => {
            this.updateBooking(event)
            this.dialogService.openSuccessDialog('Conflict resolved successfully')
          })

        } else {
          this.bookingsService.resolveRecurringConflict(this.conflictGroup).subscribe((resp: any) => {
            this.updateBooking(event)
            this.dialogService.openSuccessDialog('Conflict resolved successfully')
          })
        }
      }
    })
  }
}
