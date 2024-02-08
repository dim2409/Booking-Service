import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './routes/home/home.component';
import { MyBookingsComponent } from './routes/my-bookings/my-bookings.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'myBookings', component: MyBookingsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
  