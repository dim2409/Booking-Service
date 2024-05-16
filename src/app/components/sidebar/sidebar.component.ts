import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar/sidebar.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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

  constructor(public sidebarService: SidebarService, private router: Router) {
    this.sidebarService.getState().subscribe(isOpen => {
      this.isOpen = isOpen;
    });
  }

  ngOnInit() {
    this.items = this.sidebarService.getMainSidebarItems();
  }

  //Actions
  toggleSidebar() {
    this.sidebarService.toggle();
  }

  changeLocation(location: any) {
    this.sidebarService.toggle();
    this.router.navigate([location]);
  };
}
