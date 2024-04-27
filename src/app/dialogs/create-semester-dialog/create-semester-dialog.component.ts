import { Component, Inject, Input, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Color, NgxMatColorPickerModule } from '@angular-material-components/color-picker';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Observable } from 'rxjs';
import { LoadingSpinnerComponent } from 'src/app/components/loading-spinner/loading-spinner.component';
import { GeneralRequestService } from 'src/app/services/general/general-request.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import moment from 'moment';


@Component({
  selector: 'app-create-semester-dialog',
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
    LoadingSpinnerComponent,
    MatDatepickerModule
  ],
  templateUrl: './create-semester-dialog.component.html',
  styleUrl: './create-semester-dialog.component.less'
})
export class CreateSemesterDialogComponent {
  possibleModerators: any;

  selectedModeratorIds: number[] = [];
  semesterInfo: any;
  selectedBuildingId: any;
  selectedDepartmentId: any;
  semesterName: any;
  contentLoading!: boolean;
  selectedType: any;
  start: any;
  end: any;
  is_current: any = false;

  constructor(private semesterService: GeneralRequestService, public dialogRef: MatDialogRef<CreateSemesterDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  @ViewChild('createsemesterForm') createsemesterForm!: NgForm;

  @Input() semester: any;

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
    console.log(this.data)
    if (this.data) {
      this.start = this.data.start;
      this.end = this.data.end;
      this.is_current = this.data.is_current;
      this.selectedType = this.data.type;
      this.is_current = this.data.is_current == 1;
    }

    this.contentLoading = false;
  }


  onSubmit(createsemesterForm: any) {
    if (this.data) {
      this.semesterService.updateSemester({
        ...createsemesterForm.value,
        id: this.data.id,
        is_current: this.is_current ? 1 : 0,
        start: moment.utc(this.start).tz('Europe/Athens').format(),
        end: moment.utc(this.end).tz('Europe/Athens').format(),
        color: '#' + this.colorControl.value.hex
      }).subscribe((resp: any) => {
        if (resp) {
          this.dialogRef.close();
        }
      })
    } else {
      this.semesterService.createSemester({
        ...createsemesterForm.value,
        is_current: this.is_current ? 1 : 0,
        start: moment.utc(this.start).tz('Europe/Athens').format(),
        end: moment.utc(this.end).tz('Europe/Athens').format(),
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
