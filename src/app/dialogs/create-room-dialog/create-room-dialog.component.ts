import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Color, NgxMatColorPickerModule } from '@angular-material-components/color-picker';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { RoomsService } from 'src/app/services/rooms/rooms.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';


@Component({
  selector: 'app-create-room-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMatColorPickerModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './create-room-dialog.component.html',
  styleUrl: './create-room-dialog.component.less'
})
export class CreateRoomDialogComponent {
  possibleModerators: any;

  selectedModeratorIds: number[] = [];

  constructor(private roomService: RoomsService, public dialogRef: MatDialogRef<CreateRoomDialogComponent>) { }

  @ViewChild('createRoomForm') createRoomForm!: NgForm;

  colorCtr: AbstractControl = new FormControl(new Color(255, 243, 0), [Validators.required]);
  color: any;
  iconColor: string = '#236794';
  departments: any;
  buildings: any;

  get colorControl(): FormControl {
    return this.colorCtr as FormControl;
  }

  ngOnInit(): void {
    this.roomService.getDepartments({}).subscribe((data: any) => {
      this.departments = data;
    });
    this.roomService.getPossibleModerators({}).subscribe((data: any) => {
      this.possibleModerators = data;
    })
  }

  selectDepartment($event: MatSelectChange) {
    this.roomService.getBuildings({ department_id: $event.value }).subscribe((data: any) => {
      this.buildings = data;
    })
  }

  onSubmit(createRoomForm:any) {
    this.roomService.createRoom({
      ...createRoomForm.value,
      color: '#'+this.colorControl.value.hex
    }).subscribe((resp: any) => {
      if(resp) {
        this.dialogRef.close();
      }
    })
  }
  close() {
    this.dialogRef.close(false);
  }
}
