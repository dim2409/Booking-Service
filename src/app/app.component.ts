import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/core'; 
import { ScreenSizeService } from './services/screenSize/screen-size.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'Booking-Service';
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: []
  };
  isModeratorRoute!: boolean;
  constructor(private router: Router, private screenSizeService: ScreenSizeService) { }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }
}
