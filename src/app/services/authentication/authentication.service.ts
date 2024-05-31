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
            window.location.href = '/'
            //this.router.navigate([response.redirect_url]);
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
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): any {
    const token = this.getToken();
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  logout(): void {
    this.http.get<any>(`${environment.apiUrl}/logout`, {}).subscribe(
      response => {
        //this.clearToken();
        const casLogoutUrl = 'https://sso.ihu.gr/logout';
        //window.location.href = casLogoutUrl + '?service=' + encodeURIComponent(window.location.origin);
      },
      error => {
        console.error('Logout failed:', error);
        // Still clear the token and navigate to login page on failure
        this.clearToken();
        window.location.href = '/';
      }
    );
  }

  checkAuthentication(): Observable<{ authenticated: boolean }> {
    return this.http.get<{ authenticated: boolean }>(`${environment.apiUrl}/authenticated`, {});
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    console.log('Token Cleared')
  }

}
