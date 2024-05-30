import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private tokenKey = 'auth_token';
  constructor(private http: HttpClient, private router: Router, public jwtHelper: JwtHelperService) { }
  generateCASLoginUrl(): string {
    // CAS server base URL
    const casBaseUrl = 'https://sso.ihu.gr';

    // URL of your Angular application's CAS callback endpoint
    const serviceUrl = encodeURIComponent('http://booking.iee.ihu.gr/cas/callback');

    // Construct the CAS login URL
    return `${casBaseUrl}/login?service=${serviceUrl}`;
  }
  login(): Observable<any> {
    return this.http.get<any>(environment.apiUrl + '/login');
  }
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (route.data['casCallback']) {
      const ticket = route.queryParams['ticket'];
      if (ticket) {
        const params = new HttpParams().set('ticket', ticket);
        try {
          const response = await this.http.get<any>(`${environment.apiUrl}/cas/callback`, { params }).toPromise();
          if (response.status === 'success') {
            this.storeToken(response.token);
            this.router.navigate([response.redirect_url]);
          } else {
            console.error(response.message);
            this.router.navigate([response.redirect_url]);
          }
        } catch (error) {
          console.error('CAS callback failed:', error);
          this.router.navigate(['/login']);
        }
      } else {
        console.error('CAS ticket missing');
        this.router.navigate(['/login']);
      }
      return false; // Prevent the route from activating until the callback is handled
    }
    return true;
  }

  storeToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
    console.log('Token stored:', this.getToken());
    console.log('Token exists:', this.isAuthenticated());
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): any {
    const token = this.getToken();
    return token && !this.jwtHelper.isTokenExpired(token);
  }

}
