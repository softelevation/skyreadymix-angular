import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { IconsModule } from './../icons/icons.module';

import { PagesRoutingModule } from './pages-routing.module';
import { OrdersComponent } from './orders/orders.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ColorsComponent } from './colors/colors.component';
import { DriversComponent } from './drivers/drivers.component';

import { HeaderComponent } from './../include/header/header.component';
import { SidebarComponent } from './../include/sidebar/sidebar.component';
import { FooterComponent } from './../include/footer/footer.component';
import { from } from 'rxjs';

@NgModule({
  declarations: [OrdersComponent, DashboardComponent, ColorsComponent, DriversComponent, HeaderComponent, SidebarComponent, FooterComponent],
  imports: [
    CommonModule,
    IconsModule,
    ReactiveFormsModule,
    FormsModule,
    PagesRoutingModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ]
})
export class PagesModule { }
