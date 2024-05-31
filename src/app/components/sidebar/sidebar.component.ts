import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar/sidebar.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.less'
})
export class SidebarComponent implements OnInit {
  items: any;
  isOpen = false;
  isAuthenticated: any;

  constructor(public sidebarService: SidebarService, private router: Router, private authenticationService: AuthenticationService) {
    this.sidebarService.getState().subscribe(isOpen => {
      this.isOpen = isOpen;
    });
  }

  ngOnInit() {
    console.log('init')
    this.items = this.sidebarService.getMainSidebarItems();
    this.isAuthenticated = this.authenticationService.isAuthenticated();
  }

  //Actions
  toggleSidebar() {
    this.sidebarService.toggle();
  }

  changeLocation(location: any) {
    if (location == '/logout') {
      this.authenticationService.logout();
      this.isAuthenticated = this.authenticationService.isAuthenticated();

    } else if (location == '/login') {
      this.login();
    } else {
      this.sidebarService.toggle();
      this.router.navigate([location]);
    }
  };
  login() {
    const casLoginUrl = this.authenticationService.generateCASLoginUrl();
    this.isAuthenticated = this.authenticationService.isAuthenticated();
    window.location.href = casLoginUrl;
  }
}
