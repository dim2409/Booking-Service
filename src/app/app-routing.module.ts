import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './routes/home/home.component';
import { MyBookingsComponent } from './routes/my-bookings/my-bookings.component';
import { BookingRequestComponent } from './routes/booking-request/booking-request.component';
import { ModeratorDashboardComponent } from './routes/moderator-dashboard/moderator-dashboard.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'myBookings', component: MyBookingsComponent},
  { path: 'makeABooking', component: BookingRequestComponent},
  { path: 'moderator', component: ModeratorDashboardComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
  