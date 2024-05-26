import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './routes/home/home.component';
import { MyBookingsComponent } from './routes/my-bookings/my-bookings.component';
import { BookingRequestComponent } from './routes/booking-request/booking-request.component';
import { ModeratorDashboardComponent } from './routes/moderator-dashboard/moderator-dashboard.component';
import { RoomManagementComponent } from './routes/room-management/room-management.component';
import { StatisticsComponent } from './routes/statistics/statistics.component';
import { semesterManagementComponent } from './routes/semester/semester-management.component';
import { AuthenticationService } from './services/authentication/authentication.service';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'myBookings', component: MyBookingsComponent},
  { path: 'makeABooking', component: BookingRequestComponent},
  { path: 'moderator', component: ModeratorDashboardComponent},
  { path: 'roomManagement', component: RoomManagementComponent},
  { path: 'statistics', component: StatisticsComponent},
  { path: 'semester', component: semesterManagementComponent},
  { path: 'cas/callback', canActivate: [AuthenticationService], data: { casCallback: true } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),RouterModule.forRoot(routes ,{onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
  