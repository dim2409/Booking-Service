import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { BookingListComponent } from 'src/app/components/booking-list/booking-list.component';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { RoomsService } from 'src/app/services/rooms/rooms.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { DayNamePipe } from "../../pipes/day-name.pipe";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { NormalBookingsTabComponent } from "./normal-bookings-tab/normal-bookings-tab.component";
import { RecurringBookingsTabComponent } from "./recurring-bookings-tab/recurring-bookings-tab.component";
import { ConflictingBookingsTabComponent } from "./conflicting-bookings-tab/conflicting-bookings-tab.component";
@Component({
    selector: 'app-moderator-dashboard',
    standalone: true,
    templateUrl: './moderator-dashboard.component.html',
    styleUrl: './moderator-dashboard.component.less',
    imports: [MatTabsModule, BookingListComponent, MatSelectModule, MatOptionModule, CommonModule, MatExpansionModule, DayNamePipe, MatCardModule, MatButtonModule, MatDatepickerModule, MatPaginatorModule, NormalBookingsTabComponent, RecurringBookingsTabComponent, ConflictingBookingsTabComponent]
})
export class ModeratorDashboardComponent implements OnInit {

  dataSource: any[] = [];
  pageSizeOptions: number[] = [10, 25, 50];
  totalItems: number = 0;
  currentPage: number = 1;
  pageSize: number = 10; // Default page size

  constructor(private BookingsService: BookingsService, private RoomsService: RoomsService, private dialogService: DialogService) { }

  @ViewChild(NormalBookingsTabComponent) normalBookingsTab!: NormalBookingsTabComponent;
  @ViewChild(RecurringBookingsTabComponent) recurringBookingsTabComponent!: RecurringBookingsTabComponent;
  @ViewChild(ConflictingBookingsTabComponent) conflictingBookingsTabComponent!:ConflictingBookingsTabComponent;
  ngOnInit(): void {
  }

  updateBooking(data: any) {
    switch (data.action) {
      case 'approveBooking':
        {
          this.dialogService.openConfirmDialog(data.booking, 'Are you sure you want to confirm this booking?').subscribe((resp: any) => {
            if (resp) {
              const idArray: number[] = [data.booking.id]
              this.BookingsService.approveBooking({ id: idArray, type: data.booking.type }).subscribe((resp: any) => {
                this.dialogService.openSuccessDialog('Booking Status Updated');
                this.updateTabs();
              })
            }
          })
        }
        break;
      case 'editBooking':
        this.dialogService.openEditBookingDialog(data.booking).subscribe((resp: any) => {
          if (resp) {
            this.BookingsService.editBooking(resp).subscribe((resp: any) => {
              this.dialogService.openSuccessDialog('Booking Updated');
              this.updateTabs();
            })
          }
        });
        break;
      case 'cancelBooking':
        this.dialogService.openConfirmDialog(data.booking, 'Are you sure you want to cancel this booking?').subscribe((resp: any) => {
          if (!resp) { return; }
          const idArray: number[] = [data.booking.id]

          this.BookingsService.cancelBooking({ id: idArray, type: data.booking.type }).subscribe((resp: any) => {
            this.dialogService.openSuccessDialog('Booking Canceled');
            this.updateTabs();
          })
        })
        break;
      case 'openInfo':
        this.dialogService.openInfoDialog(data.booking);
        break;
      case 'resolveConflict':
        console.log(data)
        this.dialogService.openResolveConflictDialog(data.conflictGroup, data.isRecurring).subscribe((resp: any) => {
          if (resp) {
            this.dialogService.openSuccessDialog('Conflict Resolved');
            this.updateTabs();
          }
        })
      break;
    }
  }
  updateTabs() {
    this.normalBookingsTab.getData();
    this.recurringBookingsTabComponent.getData();
    this.conflictingBookingsTabComponent.getData();
  }

}
