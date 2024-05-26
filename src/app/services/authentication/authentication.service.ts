import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }
  generateCASLoginUrl(): string {
    // CAS server base URL
    const casBaseUrl = 'https://sso.ihu.gr';
    
    // URL of your Angular application's CAS callback endpoint
    const serviceUrl = encodeURIComponent('http://booking.iee.ihu.gr/cas/callback');

    // Construct the CAS login URL
    return `${casBaseUrl}/login?service=${serviceUrl}`;
  }

  validateCASTicket(ticket: string): Observable<any> {
    // Send a validation request to the CAS server to validate the ticket
    return this.http.get<any>(`https://sso.ihu.gr/serviceValidate?ticket=${ticket}`);
  }
  login(): Observable<any> {
    return this.http.get<any>(environment.apiUrl + '/login');
  }

}
