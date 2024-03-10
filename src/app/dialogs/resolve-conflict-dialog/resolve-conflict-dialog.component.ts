import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { RoomsService } from 'src/app/services/rooms/rooms.service';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-resolve-conflict-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    CommonModule,
    MatRadioModule,
    MatFormFieldModule,
    MatButtonModule],
  templateUrl: './resolve-conflict-dialog.component.html',
  styleUrl: './resolve-conflict-dialog.component.less'
})
export class ResolveConflictDialogComponent implements OnInit {
  @ViewChild('conflictResolveForm') myForm!: NgForm;
  displayedColumns: string[] = ['title', 'room', 'date', 'start', 'end', 'keep', 'action', 'edit'];
  rooms: any;
  toKeep: any;
  constructor(public dialogService: DialogService, public bookingsService: BookingsService, public RoomsService: RoomsService, public dialogRef: MatDialogRef<ConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  dataSource = this.data.conflictGroup.bookings;
  ngOnInit(): void {
    console.log(this.data)
    this.RoomsService.getRooms().subscribe((resp: any) => {
      this.rooms = resp;
    });
    this.data.conflictGroup.bookings.forEach((booking: any) => {
      booking.resolved = false;
      booking.toKeep = false;
    })
    this.data.conflictGroup.bookings[0].toKeep = true;
  }

  resetDataSource() {
    this.dataSource = this.data.conflictGroup.bookings
    this.dataSource = [...this.dataSource]
  }

  roomName(roomId: number) {
    return this.rooms?.find((room: any) => room.id == roomId)?.name
  }
  onResolve(conflictResolveForm: any) {
    console.log(conflictResolveForm)

  }
  selectToKeep(booking: any) {
    this.data.conflictGroup.bookings.find((b: any) => b.toKeep == true).toKeep = false
    booking.toKeep = true
    this.checkResolved();
  }
  editBooking(data: any) {
    let booking = data
    const bookingIndex = this.data.conflictGroup.bookings.findIndex((b: any) => b.id === booking.id)
    this.dialogService.openEditBookingDialog(booking).subscribe((resp: any) => {
      booking = resp
      this.data.conflictGroup.bookings[bookingIndex] = resp
      this.checkResolved();
      this.resetDataSource();
    })
  }

  checkResolved() {
    this.data.conflictGroup.bookings.forEach((booking: any) => {
      this.checkConflicts(booking).subscribe((resp) => {
        if(!resp){
          if(!this.checkEditingConflict(booking)){
            booking.resolved = true
          }else{
            booking.resolved = false
          }
        }else{
          booking.resolved = false
        }
      })
    })
  }

  checkConflicts(booking: any): Observable<any> {
    return new Observable<boolean>(observer => {
      let isConflicting = false
      this.bookingsService.checkConflict(booking).subscribe((resp: any) => {
        if (resp.isConflicting) {
          const filteredConflicts = resp.conflicts.filter((conflict: any) => {
            const localConflict = this.data.conflictGroup.bookings.find((b: any) => b.id === conflict.id);
            return !localConflict || !localConflict.resolved;
          });
          if (filteredConflicts.length > 0) {
            isConflicting = true;
          }
        }
        console.log('isConflicting:',isConflicting)
        observer.next(isConflicting); 
        observer.complete();
      });
    });
  }

  checkEditingConflict(newBooking: any) {
    let conflicts = false;
    this.data.conflictGroup.bookings.forEach((booking: any) => {
      if (newBooking.id !== booking.id && (
        (newBooking.start >= booking.start && newBooking.start < booking.end) ||
        (newBooking.end > booking.start && newBooking.end <= booking.end) ||
        (newBooking.start < booking.start && newBooking.end > booking.end)
      )){
        conflicts = true;
      }
    })
    return conflicts;
  }

  onClose() {
    this.dialogRef.close()
  }
  resolve(){
    this.bookingsService.resolveConflict(this.data.conflictGroup).subscribe((resp: any) => {
      this.dialogRef.close(resp)
    })
  }
}
