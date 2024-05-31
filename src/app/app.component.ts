import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/core';
import { ScreenSizeService } from './services/screenSize/screen-size.service';
import { AuthenticationService } from './services/authentication/authentication.service';
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
  authenticated!: boolean;
  constructor(private router: Router, private screenSizeService: ScreenSizeService, private authService: AuthenticationService) { }
  ngOnInit(): void {
    this.authService.checkAuthentication().subscribe(
      response => {
        this.authenticated = response.authenticated;
        if(!this.authenticated)this.authService.clearToken();
      },
      error => {
        console.error('Error checking authentication:', error);
      }
    );
  }
}
