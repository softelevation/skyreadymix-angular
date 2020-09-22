import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Orders } from './orders';
import { AppServiceService } from './../app-service.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  orderForm: FormGroup;
  driverForm: FormGroup;
  order: any;
  orders: Orders;
  colors: Colors;
  drivers: Drivers;
  error: string;
  order_id: number;
  index_id: number;
  calculatedLoads: number;
  calculatedShortFee: number;
  pump_total: number;
  calculateStandByMinutes: number;
  orderTotal: number;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private appService: AppServiceService
    ) { }

  ngOnInit(): void {

    // this.order = {'delivery_address':'eeeeeeeeee'};

    this.driverForm = this.fb.group({
      driver_name: ['', Validators.required],
      vehicle_number: ['', Validators.required],
      status: ['', Validators.required]
    });
    
    this.order = {
        branch: '',
        status: '',
        delivery_date: '',
        delivery_time: '',
        delivery_address: '',
        delivery_city: '',
        delivery_zip: '',
        order_company: '',
        order_contact: '',
        bill_to_company: '',
        bill_to_contact: '',
        yards: '',
        clean_up: '',
        truck_load_size: '',
        psi: '',
        slump: '',
        color: '',
        admix_fee: '',
        pump_setup_fee: '',
        pumper_name: '',
        standby_minutes: '',
        other_fees: '',
        discount: '',
        terms: ''
      };

    this.appService.getOrders().subscribe(
      (data: Orders) =>  {
          this.orders = data['data'];
          this.colors = data['colordata'];
          this.drivers = data['driverdata'];
      }
    );
  }

  get driver_name() { return this.driverForm.get('driver_name'); }
  get vehicle_number() { return this.driverForm.get('vehicle_number'); }
  get status() { return this.driverForm.get('status'); }

  changeDriver(){
      this.driverForm.patchValue({
        vehicle_number: this.driver_name.value
      });
  }

  maintainStatus(x,y){
      this.order_id = x;
      this.index_id = y;
  }

  addOrderDriver(){
    // {item: {order_id: 3, index_id: 0, driver_status: 2, vehicle_number: "545646"}}
      let obj = {
        vehicle_number : this.vehicle_number.value,
        driver_status : this.status.value,
        order_id: this.order_id,
        index_id: this.index_id
      }
      this.appService.addDriver(obj).subscribe((data: Orders) => {
        this.orders = data['data'];
      });
  }

  calculatedLoadData(){
    this.calculatedLoads = Math.ceil(parseFloat(this.order.yards) / parseFloat(this.order.truck_load_size));

    if(this.order.yards < this.order.truck_load_size){
      this.calculatedShortFee = (parseFloat(this.order.truck_load_size) - parseFloat(this.order.yards)) * 20;
    }else{
      this.calculatedShortFee = 0;
    }
  }

  pumpSetupFee(){
    const pumpFee = parseFloat(this.order.pump_setup_fee);
    const yardsQty = this.order.yards ? parseFloat(this.order.yards) : 0;

    if (pumpFee > 0) {
      this.pump_total = yardsQty * 9 + pumpFee;
    }else{
      this.pump_total = 0;
    }      
  }

  standbyMinutes(){
  const standby_minutes_val = parseFloat(this.order.standby_minutes);
    if (standby_minutes_val > 0) {
        this.calculateStandByMinutes = standby_minutes_val * 2.5;
    }else{
        this.calculateStandByMinutes = 0;
    }
  }


  orderTotalCount(){
        const pumpTotal = this.pumpSetupFee();
        const shortFee = this.calculatedShortFee;
        const loads = this.calculatedLoads;

        const admixFee = parseFloat(this.order.admix_fee);
        const loadSize = parseFloat(this.order.truck_load_size);
        const yardsQty = parseFloat(this.order.yards);
        const otherFee = parseFloat(this.order.other_fees);
        const price = parseFloat(this.order.psi);
        const standByMinutes = parseFloat(this.order.standby_minutes);
        const discount = this.order.discount;
        // let return_data = (((shortFee + (yardsQty * price + admixFee) + (loads * 60))) * 0.095) + shortFee + ((yardsQty * (price + admixFee) + (loads * 60))) + pumpTotal + otherFee + standByMinutes;
        // if (discount) this.orderTotal = (return_data - (return_data * discount)/100);
        // return this.orderTotal = return_data;
        this.orderTotal = ((shortFee + (yardsQty * price + admixFee) +  (loads * 60)) * 0.095) + shortFee + (yardsQty * (price + admixFee) + (loads * 60));
  }
  // orderTotal calculatedTotalDue

  onSubmit() {
    let saveData = this.order;
        saveData.calculatedLoads = this.calculatedLoads;
        saveData.calculatedShortFee = this.calculatedShortFee;
        saveData.pump_total = this.pump_total;
        saveData.calculateStandByMinutes = this.calculateStandByMinutes;
        saveData.calculatedPumpTotal = this.orderTotal;
        saveData.calculatedTotalDue = this.orderTotal;
      this.appService.addProduct(saveData).subscribe((data: Orders) => {
        this.orders = data['data'];
      });
  }

}


interface Colors {
  id: number;
  manufacturer: string;
  color: string;
  rate: string;
}

interface Drivers {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile_phone: string;
  truck_number	: string;
}