import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CardListComponent } from 'src/app/components/card-list/card-list.component';
import { ControlCardComponent } from 'src/app/components/control-card/control-card.component';
import { LoadingSpinnerComponent } from 'src/app/components/loading-spinner/loading-spinner.component';

import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { RoomsService } from 'src/app/services/rooms/rooms.service';
@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatDividerModule, MatButtonModule, MatProgressBarModule, CardListComponent, LoadingSpinnerComponent, ControlCardComponent],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.less'
})

export class MyBookingsComponent implements OnInit {
  userId: number = 4;
  bookings!: any;
  buttons: any;
  loading!: boolean;
  selectCount: number = 0;
  req: any = {
    booker_id: 4,
    page: 1,
    perPage: 10,
    user_id: 2
  }  
  params =
  {
    pageSizeOptions: [10, 25, 50],
    totalItems: 0
  };
  rooms: any;
  constructor(private BookingsService: BookingsService, private dialogService: DialogService, private _snackBar: MatSnackBar, private RoomsService: RoomsService) { }

  ngOnInit(): void {
    document.body.classList.remove('body-overflow');

    this.loading = true;
    this.RoomsService.getRooms({}).subscribe((resp: any) => {
      this.rooms = resp
    })
    this.buttons = [
      {
        icon: 'fa-pencil',
        action: 'editBooking',
      },
      {
        icon: 'fa-trash',
        action: 'deleteBooking',
      },
      {
        icon: 'fa-expand',
        action: 'openInfo',
      }
    ]
    this.getData();
  }
  getData() {
    
    this.BookingsService.getUserBookings(this.req).subscribe((resp: any) => {
      this.bookings = resp.bookings;
      this.params.totalItems = resp.total
      this.loading = false;
    });
  }
  onPageChange(event: PageEvent): void {
    // Check if the page index has changed
    if (event.pageIndex + 1 !== this.req.page) {
      this.req.page = event.pageIndex + 1;
    }
    // Check if the page size has changed
    if (event.pageSize !== this.req.perPage) {
      this.req.perPage = event.pageSize;
    }
    this.getData();
  }
  selectAll(event: any) {
    this.bookings.forEach((booking: any) => {
      booking.selected = event
    })
    this.selectCount = 0
  }
  updateBooking(data: any) {
    switch (data.action) {
      case 'createBooking':
        this.BookingsService.createBooking(data.req).subscribe((resp: any) => {
          this.openSnackBar('Booking Created');
          this.updateTabs();
        })
        break
      case 'approveBooking':
        {
          this.dialogService.openConfirmDialog(data.booking, 'Are you sure you want to confirm this booking?').subscribe((resp: any) => {
            if (resp) {
              this.BookingsService.approveBooking({ id: data.selectedBookings, type: data.type }).subscribe((resp: any) => {
                this.openSnackBar('Booking Status Updated');
                this.updateTabs();
              })
            }
          })
        }
        break;
      case 'editBooking':
        this.dialogService.openBookingFormDialog({ booking: data.booking, rooms: this.rooms }).subscribe((resp: any) => {
          if (resp) {
            this.BookingsService.editBooking(resp).subscribe((resp: any) => {
              this.openSnackBar('Booking Updated');
              this.updateTabs();
            })
          }
        });
        break;
      case 'cancelBooking':
        this.dialogService.openConfirmDialog(data.booking, 'Are you sure you want to cancel this booking?').subscribe((resp: any) => {
          if (!resp) { return; }
          this.BookingsService.cancelBooking({ id: data.selectedBookings, type: data.type }).subscribe((resp: any) => {
            this.openSnackBar('Booking Canceled');
            this.updateTabs();
          })
        })
        break;
      case 'openInfo':
        this.dialogService.openInfoDialog(data.booking);
        break;
      case 'resolveConflict':
        this.openSnackBar('Conflict Resolved');
        this.updateTabs();
        break;
    }
  }
  openSnackBar(message: string, action?: string) {
    this._snackBar.open(message, action ? action : 'Dismiss')._dismissAfter(3000);
  }
  updateTabs() {
    this.getData();
  }
}
