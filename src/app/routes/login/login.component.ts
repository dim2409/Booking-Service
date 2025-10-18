import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./login.component.less']
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  onLogin(): void {
    this.authenticationService.login(this.username, this.password).subscribe({
          next: (response) => {
            if(response.status === 'success'){
              this.router.navigate(['/']);
            }else{
              console.error(response.message);
            }
          },
          error: (error) => {
            console.error('Login failed:', error);
          }
        });
  }
}
