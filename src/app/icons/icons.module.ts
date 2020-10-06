import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatherModule } from 'angular-feather';
import { Home, List, Circle, Droplet, EyeOff, Check, Grid, CheckSquare, LifeBuoy, Star, Copy, User, Edit, Lock, Trash, Archive } from 'angular-feather/icons';

const icons = {
  Home,
  List,
  Circle,
  Droplet,
  EyeOff,
  Copy,
  Star,
  Check,
  Grid,
  LifeBuoy,
  CheckSquare,
  User,
  Lock,
  Edit,
  Trash,
  Archive
};


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
	FeatherModule.pick(icons)
  ],
  exports: [
    FeatherModule
  ]
})
export class IconsModule { }
