import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppServiceService } from './../app-service.service';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.css']
})
export class DriversComponent implements OnInit {

  driverForm: FormGroup;
  drivers: Drivers;
  error: string;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private appService: AppServiceService
  ) { }

  ngOnInit(): void {

    this.driverForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
      mobile_phone: ['', Validators.required],
      truck_number: ['', Validators.required]
    });

    this.appService.getDrivers().subscribe(
      (data: Drivers) => this.drivers = data['data'],
      error => this.error = error
    );
  }

  get first_name() { return this.driverForm.get('first_name'); }
  get last_name() { return this.driverForm.get('last_name'); }
  get email() { return this.driverForm.get('email'); }
  get mobile_phone() { return this.driverForm.get('mobile_phone'); }
  get truck_number() { return this.driverForm.get('truck_number'); }

  addDriver() {
      let obj = {
        first_name : this.first_name.value,
        last_name : this.last_name.value,
        email : this.email.value,
        mobile_phone : this.mobile_phone.value,
        truck_number : this.truck_number.value
      }
      this.appService.addDrivers(obj).subscribe(
        (data: Drivers) => {
          this.drivers = data['data'];
        }
      );

  }

}


interface Drivers {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile_phone: string;
  truck_number	: string;
}
