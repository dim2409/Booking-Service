import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CardListComponent } from 'src/app/components/card-list/card-list.component';
import { RoomsService } from 'src/app/services/rooms/rooms.service';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { NormalBookingsTabComponent } from "./normal-bookings-tab/normal-bookings-tab.component";
import { RecurringBookingsTabComponent } from "./recurring-bookings-tab/recurring-bookings-tab.component";
import { ConflictingBookingsTabComponent } from "./conflicting-bookings-tab/conflicting-bookings-tab.component";
import { RecurringConflictsTabComponent } from "./recurring-conflicts-tab/recurring-conflicts-tab.component";
import { LoadingSpinnerComponent } from "../../components/loading-spinner/loading-spinner.component";
@Component({
  selector: 'app-moderator-dashboard',
  standalone: true,
  templateUrl: './moderator-dashboard.component.html',
  styleUrl: './moderator-dashboard.component.less',
  imports: [MatTabsModule,
    CardListComponent,
    CommonModule,
    MatExpansionModule,
    MatButtonModule,
    MatDatepickerModule,
    NormalBookingsTabComponent,
    RecurringBookingsTabComponent,
    ConflictingBookingsTabComponent, RecurringConflictsTabComponent, LoadingSpinnerComponent]
})
export class ModeratorDashboardComponent implements OnInit {

  dataSource: any[] = [];
  pageSizeOptions: number[] = [10, 25, 50];
  totalItems: number = 0;
  currentPage: number = 1;
  pageSize: number = 10; // Default page size
  rooms: any;
  loading!: boolean;

  constructor(private BookingsService: BookingsService, private RoomsService: RoomsService, private dialogService: DialogService) { }

  @ViewChild(NormalBookingsTabComponent) normalBookingsTab!: NormalBookingsTabComponent;
  @ViewChild(RecurringBookingsTabComponent) recurringBookingsTabComponent!: RecurringBookingsTabComponent;
  @ViewChild(ConflictingBookingsTabComponent) conflictingBookingsTabComponent!: ConflictingBookingsTabComponent;
  ngOnInit(): void {
    this.loading = true;
    document.body.classList.add('body-overflow');
    this.getRooms();
  }
  getRooms() {
    this.RoomsService.getModeratedRooms(2).subscribe((resp: any) => {
      this.rooms = resp;
    });
  }

  updateBooking(data: any) {
    switch (data.action) {
      case 'approveBooking':
        {
          this.dialogService.openConfirmDialog(data.booking, 'Are you sure you want to confirm this booking?').subscribe((resp: any) => {
            if (resp) {
              this.BookingsService.approveBooking({ id: data.selectedBookings, type: data.type }).subscribe((resp: any) => {
                this.dialogService.openSuccessDialog('Booking Status Updated');
                this.updateTabs();
              })
            }
          })
        }
        break;
      case 'editBooking':
        this.dialogService.openEditBookingDialog({ booking: data.booking, rooms: this.rooms }).subscribe((resp: any) => {
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

          this.BookingsService.cancelBooking({ id: data.selectedBookings, type: data.type }).subscribe((resp: any) => {
            this.dialogService.openSuccessDialog('Booking Canceled');
            this.updateTabs();
          })
        })
        break;
      case 'openInfo':
        this.dialogService.openInfoDialog(data.booking);
        break;
      case 'resolveConflict':
        this.updateTabs();
        break;
    }
  }
  updateTabs() {
    this.normalBookingsTab.getData();
    this.recurringBookingsTabComponent.getData();
    this.conflictingBookingsTabComponent.getData();
  }

}
