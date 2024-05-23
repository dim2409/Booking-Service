import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
export class LoginComponent {
  
  username: string = '';
  password: string = '';

  constructor(private authenticationService: AuthenticationService) { }
  login() {
    this.authenticationService.login(this.username, this.password).subscribe(response => {
      console.log('logged in')
    });
  }
}
