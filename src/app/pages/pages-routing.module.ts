import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { OrdersComponent } from './orders/orders.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ColorsComponent } from './colors/colors.component';
import { DriversComponent } from './drivers/drivers.component';


const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  {path: 'orders', component: OrdersComponent},
  {path: 'colors', component: ColorsComponent},
  {path: 'drivers', component: DriversComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
