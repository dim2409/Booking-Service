import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { CardListComponent } from './components/card-list/card-list.component';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { JwtModule, JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { AuthenticationService } from './services/authentication/authentication.service';

export function tokenGetter() {
    return localStorage.getItem('access_token');
}

@NgModule({
    declarations: [
        AppComponent,
    ],
    providers: [
        { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true } },
        { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS },
        provideCharts(withDefaultRegisterables()),
        AuthenticationService,
        {
            provide: JWT_OPTIONS,
            useFactory: () => ({
                tokenGetter: tokenGetter,
                allowedDomains: ['booking.iee.ihu.gr'],  // Replace with your API domain
                disallowedRoutes: ['http://example.com/examplebadroute/'],  // Replace with disallowed routes
            }),
        },
        JwtHelperService
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatButtonModule,
        FullCalendarModule,
        FlatpickrModule.forRoot(),
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
        FontAwesomeModule,
        NavbarComponent,
        SidebarComponent,
        CardListComponent,
        HttpClientModule,
        MatDialogModule,
        MatNativeDateModule,
        NgxMatColorPickerModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter,
                allowedDomains: ['http://booking.iee.ihu.gr/api'],  // Replace with your API domain
                disallowedRoutes: ['http://example.com/examplebadroute/'],  // Replace with disallowed routes
            }
        })
    ]
})
export class AppModule { }
