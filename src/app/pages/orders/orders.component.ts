import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Orders } from './orders';
import { AppServiceService } from './../app-service.service';
import { AuthService } from './../../auth/auth.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  orderForm: FormGroup;
  driverForm: FormGroup;
  masterSelected:boolean;
  checkedList:any;
  userInfo: usersInfo;
  username: string;
  order: any;
  orders_num: number;
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
  orderTotal: string;
  editId: number;
  branchVal = 'all';
  order_status = 'disabled';
  allBranchs = [
      {text: 'Van Nuys', value: 'Van Nuys'},
      {text: 'Lancaster', value: 'Lancaster'},
      {text: 'Vernon', value: 'Vernon'}
  ]


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private appService: AppServiceService,
    private authService: AuthService
    ) { }

  ngOnInit(): void {

    // this.order = {'delivery_address':'eeeeeeeeee'};
    this.editId = 0; 
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
        ordered_by_vip: '',
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
          this.orders_num = data['data'].length;
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

  checkUncheckAll(){
    for (var i = 0; i < this.orders_num; i++) {
      this.orders[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  getCheckedItemList(){
    this.checkedList = [];
    for (var i = 0; i < this.orders_num; i++) {
      if(this.orders[i].isSelected)
      this.checkedList.push(this.orders[i]);
    }
    this.checkedList = JSON.stringify(this.checkedList);
  }

  maintainStatus(x,y,z){
      this.order_id = x;
      this.index_id = y;
      if(z){
          this.appService.getDriverByNumber(x,y,z).subscribe(
            (data: Drivers) => {
              this.drivers = data['driverdata'];
              if(data['data'].driver_status == '1'){
                this.driverForm.patchValue({
                  driver_name: '',
                  vehicle_number: '',
                  status: ''
                });
              }else{
                this.driverForm.patchValue({
                  driver_name: data['data'].truck_number,
                  vehicle_number: data['data'].truck_number,
                  status: data['data'].driver_status
                });
              }
            }
          );
      }else{
        this.appService.getDrivers().subscribe(
          (data: Drivers) => this.drivers = data['data'],
          error => this.error = error
        );

        this.driverForm.patchValue({
          driver_name: '',
          vehicle_number: '',
          status: ''
        });
      }
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

    if(parseInt(this.order.yards) < parseInt(this.order.truck_load_size)){
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

  filterOrder(){
      this.appService.getOrdersFilter(this.branchVal).subscribe(
        (data: Orders) =>  {
            this.orders = data['data'];
            this.colors = data['colordata'];
            this.drivers = data['driverdata'];
        }
      );
  }


  orderTotalCount(){
        const pumpTotal = this.pump_total;
        const shortFee = this.calculatedShortFee;
        const loads = this.calculatedLoads;

        const admixFee = parseFloat(this.order.admix_fee);
        const loadSize = parseFloat(this.order.truck_load_size);
        const yardsQty = parseFloat(this.order.yards);
        const otherFee = parseFloat(this.order.other_fees);
        const price = parseFloat(this.order.psi);
        const standByMinutes = parseFloat(this.order.standby_minutes);
        const discount = this.order.discount;
        let orderTotals = (((shortFee + (yardsQty * price + admixFee) + (loads * 60))) * 0.095) + shortFee + ((yardsQty * (price + admixFee) + (loads * 60))) + pumpTotal + otherFee + standByMinutes;
        if(discount && parseInt(discount) > 0){
          let full_orderTotal = orderTotals - (orderTotals * discount)/100;
          this.orderTotal = (Math.round(full_orderTotal * 100) / 100).toFixed(2);
        }else{
          this.orderTotal = (Math.round(orderTotals * 100) / 100).toFixed(2);
        }
      }
  
  addOrder() {
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
          ordered_by_vip: '',
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
        this.calculatedLoads = 0;
        this.calculatedShortFee = 0;
        this.pump_total = 0;
        this.calculateStandByMinutes = 0;
        this.orderTotal = '';
        this.order_status = 'disabled';
  }


  editOrder(id) {
      // console.log('qqqqqqqqqqqqqqqqqq '+id);
      this.appService.getOrderId(id).subscribe((data) =>  {
            if(data['status']){
              this.editId = data['data']['id'];
              this.order = {
                'branch': data['data']['branch'],
                'status': data['data']['status'],
                'delivery_date': data['data']['delivery_date'],
                'delivery_time': data['data']['delivery_time'],
                'delivery_address': data['data']['delivery_address'],
                'delivery_city': data['data']['delivery_city'],
                'delivery_zip': data['data']['delivery_zip'],
                'order_company': data['data']['order_company'],
                'order_contact': data['data']['order_contact'],
                'bill_to_company': data['data']['bill_to_company'],
                'bill_to_contact': data['data']['bill_to_contact'],
                'ordered_by_vip': data['data']['ordered_by_vip'],
                'yards': data['data']['yards'],
                'clean_up': data['data']['clean_up'],
                'truck_load_size': data['data']['truck_load_size'],
                'psi': data['data']['psi'],
                'slump': data['data']['slump'],
                'color': data['data']['color'],
                'admix_fee': data['data']['admix_fee'],
                'pump_setup_fee': data['data']['pump_setup_fee'],
                'pumper_name': data['data']['pumper_name'],
                'standby_minutes': data['data']['standby_minutes'],
                'other_fees': data['data']['other_fees'],
                'discount': data['data']['discount'],
                'terms': data['data']['terms']
              };
              this.calculatedLoads = data['data']['calculatedLoads'];
              this.calculatedShortFee = data['data']['calculatedShortFee'];
              // this.pump_total = data['data']['calculatedShortFee'];

              const pumpFee = parseFloat(data['data']['pump_setup_fee']);
              const yardsQty = (data['data']['yards']) ? parseFloat(data['data']['yards']) : 0;
              if (pumpFee > 0) {
                this.pump_total = yardsQty * 9 + pumpFee;
              }else{
                this.pump_total = 0;
              }
              this.calculateStandByMinutes = data['data']['calculateStandByMinutes'];
              this.orderTotal = data['data']['calculatedPumpTotal'];
              this.order_status = 'enabled';
            }
        }
      );

  }

  onSubmit() {
    // console.log(this.editId);
    let saveData = this.order;
        saveData.calculatedLoads = this.calculatedLoads;
        saveData.calculatedShortFee = this.calculatedShortFee;
        saveData.pump_total = this.pump_total;
        saveData.calculateStandByMinutes = this.calculateStandByMinutes;
        saveData.calculatedPumpTotal = this.orderTotal;
        saveData.calculatedTotalDue = this.orderTotal;
        this.userInfo = JSON.parse(this.authService.userInfo());
        if(this.userInfo){
          saveData.username = this.userInfo.name;
        }else{
          saveData.username = 'John';
        }

      if(this.editId){
        this.appService.updateProduct(saveData,this.editId).subscribe((data: Orders) => {
          this.editId = 0;
          this.orders = data['data'];
        });
      }else{
        this.appService.addProduct(saveData).subscribe((data: Orders) => {
          this.orders = data['data'];
        });
      }
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

interface usersInfo {
  name: string;
  email: string;
  displayName: string;
}