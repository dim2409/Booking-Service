import { Component, Inject, Input, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Color, NgxMatColorPickerModule } from '@angular-material-components/color-picker';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { RoomsService } from 'src/app/services/rooms/rooms.service';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Observable } from 'rxjs';
import { LoadingSpinnerComponent } from 'src/app/components/loading-spinner/loading-spinner.component';


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
    MatCheckboxModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './create-room-dialog.component.html',
  styleUrl: './create-room-dialog.component.less'
})
export class CreateRoomDialogComponent {
  possibleModerators: any;

  selectedModeratorIds: number[] = [];
  roomInfo: any;
  selectedBuildingId: any;
  selectedDepartmentId: any;
  roomName: any;
  contentLoading!: boolean;

  constructor(private roomService: RoomsService, public dialogRef: MatDialogRef<CreateRoomDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  @ViewChild('createRoomForm') createRoomForm!: NgForm;

  @Input() room: any;

  colorCtr: AbstractControl = new FormControl(new Color(255, 243, 0), [Validators.required]);
  color: any;
  iconColor: string = '#236794';
  departments: any;
  buildings: any;

  get colorControl(): FormControl {
    return this.colorCtr as FormControl;
  }

  ngOnInit(): void {
    if (this.data) this.contentLoading = true;
    this.roomService.getDepartments({}).subscribe((data: any) => {
      this.departments = data;
      this.roomService.getPossibleModerators({}).subscribe((data: any) => {
        this.possibleModerators = data;
        console.log(this.data)
        if (this.data) {
          this.color = this.data.color;
          this.colorControl.setValue(this.data.color);
          this.iconColor = this.data.color;
          this.roomName = this.data.name;
          this.data.moderators.forEach((moderator: any) => {
            this.selectedModeratorIds.push(moderator.id);
          })
          this.roomInfo = this.data.info? this.data.info : 'No info';
          this.selectedDepartmentId = this.data.department_id;
          this.selectedBuildingId = this.data.building_id;
          this.selectDepartment({ value: this.data.department_id })
        }

        this.contentLoading = false;
      })
    });
  }

  selectDepartment($event: any) {
    this.roomService.getBuildings({ department_id: $event.value }).subscribe((data: any) => {
      this.buildings = data;

    })
  }

  onSubmit(createRoomForm: any) {
    if (this.data) {
      this.roomService.editRoom({
        id: this.data.id,
        ...createRoomForm.value,
        color: this.colorControl.value.hex ? '#' + this.colorControl.value.hex : this.data.color
      }).subscribe((resp: any) => {
        if (resp) {
          this.dialogRef.close();
        }
      })
    } else {
      this.roomService.createRoom({
        ...createRoomForm.value,
        color: '#' + this.colorControl.value.hex
      }).subscribe((resp: any) => {
        if (resp) {
          this.dialogRef.close();
        }
      })
    }
  }
  close() {
    this.dialogRef.close(false);
  }
}
