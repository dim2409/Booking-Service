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
roomInfo: any;
selectedBuildingId: any;
selectedDepartmentId: any;
roomName: any;

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
    this.roomService.getDepartments({}).subscribe((data: any) => {
      this.departments = data;
      this.roomService.getPossibleModerators({}).subscribe((data: any) => {
        this.possibleModerators = data;
        console.log(this.data)
        if(this.data) { 
          this.color = this.data.color;
          this.iconColor = this.data.color;  
          this.roomName = this.data.name;
          this.selectedDepartmentId =  this.data.department_id;
          this.selectedBuildingId = this.data.building_id;
          this.selectDepartment({value: this.data.department_id})
        }
      })
    });
  }

  selectDepartment($event: any) {
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
