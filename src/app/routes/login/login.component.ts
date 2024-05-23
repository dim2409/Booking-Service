import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.less'
})
export class LoginComponent implements OnInit{
  
  username: string = '';
  password: string = '';

  constructor(private authenticationService: AuthenticationService, private route: ActivatedRoute) { }
  login() {
    this.authenticationService.login(this.username, this.password).subscribe(response => {
      console.log('logged in')
    });
  }
  ngOnInit(): void {
    // Extract ticket parameter from the URL
    this.route.queryParams.subscribe(params => {
      const ticket = params['ticket'];
      if (ticket) {
        // Validate the ticket with the CAS server
        this.authenticationService.validateCASTicket(ticket).subscribe(response => {
          // Once validated, handle user authentication and redirect to protected route
        });
      }
    });
  }
}
