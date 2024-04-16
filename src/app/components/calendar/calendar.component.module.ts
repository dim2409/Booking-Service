import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarComponent } from './calendar.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { FiltersComponent } from "../filters/filters.component";



@NgModule({
    declarations: [CalendarComponent],
    imports: [
        CommonModule,
        FormsModule,
        NgbModalModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
        MatButtonModule,
        MatButtonToggleModule,
        MatDialogModule,
        MatChipsModule,
        FiltersComponent
    ],
    exports: [CalendarComponent],
})
export class CalendarComponentModule { }
