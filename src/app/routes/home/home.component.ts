import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CalendarComponentModule } from 'src/app/components/calendar/calendar.component.module';
import { DemoModule } from 'src/app/mwl-demo-component/mwl-demo-component.module';
import {MatMenuModule} from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DemoModule, CalendarComponentModule, MatDialogModule, MatMenuModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less'
})
export class HomeComponent {

}
