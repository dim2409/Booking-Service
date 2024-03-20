import { Component } from '@angular/core';
import {ProgressSpinnerMode, MatProgressSpinnerModule} from '@angular/material/progress-spinner';
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [
    MatProgressSpinnerModule
  ],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.less'
})
export class LoadingSpinnerComponent {
  mode: ProgressSpinnerMode = 'indeterminate';
}