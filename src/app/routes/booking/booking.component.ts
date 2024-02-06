import { Component } from '@angular/core';
import { DemoModule } from 'src/app/mwl-demo-component/mwl-demo-component.module';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [DemoModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.less'
})
export class BookingComponent {

}
