import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../services/sidebar/sidebar.service';
import { Observable } from 'rxjs';
import { ScreenSizeService } from 'src/app/services/screenSize/screen-size.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, RouterModule, MatSidenavModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.less'
})
export class NavbarComponent implements OnInit {
  isMobile$!: Observable<boolean>;
  constructor(public sidebarService: SidebarService, private screenSizeService: ScreenSizeService) {
    this.isMobile$ = this.screenSizeService.isMobile$;
   }
  ngOnInit(): void {
  }
  toggleSidebar() {
    this.sidebarService.toggle();
  }
}