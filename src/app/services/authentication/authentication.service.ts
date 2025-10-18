import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';


export interface User {
  email: string;
  id: number;
  username: string;
  roles: ['admin' | 'moderator' | 'guest'| 'faculty'];
}
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  private currentUserSubject = new BehaviorSubject<User | null>(
    {
      email: '',
      id: 0,
      username: 'guest',
      roles: ['guest']
    }
  );
  currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  private tokenKey = 'auth_token';
  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('user');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
   }
  generateCASLoginUrl(): string {
    // CAS server base URL
    const casBaseUrl = 'https://sso.ihu.gr';

    // URL of your Angular application's CAS callback endpoint
    const serviceUrl = encodeURIComponent('http://booking.iee.ihu.gr/cas/callback');

    // Construct the CAS login URL
    return `${casBaseUrl}/login?service=${serviceUrl}`;
  }
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/login', {username, password}).pipe(
      map(response => {
        if (response.status === 'success') {
          this.storeToken(response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        } else {
          console.error(response.message);
        }
        return response;
      })
    );
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
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
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): any {
    const token = this.getToken();
    return token ;//&& !this.jwtHelper.isTokenExpired(token);
  }

}
