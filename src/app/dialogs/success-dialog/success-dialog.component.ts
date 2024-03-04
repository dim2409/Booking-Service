import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-success-dialog',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './success-dialog.component.html',
  styleUrl: './success-dialog.component.less'
})
export class SuccessDialogComponent {

  constructor(public dialogRef: MatDialogRef<SuccessDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, ) { }
  public close(){
    this.dialogRef.close();
  }
}
