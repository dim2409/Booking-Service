import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { RoomsService } from 'src/app/services/rooms/rooms.service';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
@Component({
  selector: 'app-resolve-conflict-dialog',
  standalone: true,
  imports: [
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
  displayedColumns: string[] = ['title','room', 'date', 'start', 'end', 'keep', 'action', 'edit'];	
  rooms: any;
  toKeep: any;
  constructor(public BookingsService: BookingsService, public RoomsService: RoomsService, public dialogRef: MatDialogRef<ConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  
  ngOnInit(): void {
    console.log(this.data)
    this.RoomsService.getRooms().subscribe((resp: any) => {
      this.rooms = resp;
    });
  }
  roomName(roomId: number) {
    return this.rooms?.find((room: any) => room.id == roomId)?.name
  }
  onResolve(conflictResolveForm: any) {
    console.log(conflictResolveForm)
    
  }
  selectToKeep(toKeep: any) {
    this.toKeep = toKeep
  }
  editBooking(booking: any) {
    
  }
}
