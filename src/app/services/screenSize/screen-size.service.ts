import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScreenSizeService {
  private isMobileSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isMobile$: Observable<boolean> = this.isMobileSubject.asObservable();

  constructor() {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }

  private checkScreenSize() {
    const isMobile = window.innerWidth <= 768;
    this.isMobileSubject.next(isMobile);
  }
}
