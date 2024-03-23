import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Color, NgxMatColorPickerModule } from '@angular-material-components/color-picker';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';


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
    MatIconModule
  ],
  templateUrl: './create-room-dialog.component.html',
  styleUrl: './create-room-dialog.component.less'
})
export class CreateRoomDialogComponent {

  
  
  @ViewChild('createRoomForm') myForm!: NgForm;

  colorCtr: AbstractControl = new FormControl(new Color(255, 243, 0), [Validators.required]);
  color: any;
  iconColor: string = '#236794';

  get colorControl(): FormControl {
    return this.colorCtr as FormControl;
  }
}
