import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from "../../environments/environment";
import { Orders } from './orders/orders';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  serverUrl = environment.API;
  errorData: {};
  
  constructor(private http: HttpClient) { }

  getColors() {
    return this.http.get<Colors>(this.serverUrl + 'data-list/colors').pipe(
      catchError(this.handleError)
    );
  }

  getOrderId(id) {
    return this.http.get<Colors>(this.serverUrl + 'data-list/products/'+id).pipe(
      catchError(this.handleError)
    );
  }
  
  getOrders() {
    return this.http.get<Orders>(this.serverUrl + 'data-list/products').pipe(
      catchError(this.handleError)
    );
  }

  getOrdersFilter(input) {
    return this.http.get<Orders>(this.serverUrl + 'data-list/products?status_product='+input).pipe(
      catchError(this.handleError)
    );
  }

  getDrivers() {
    return this.http.get<Drivers>(this.serverUrl + 'data-list/drivers').pipe(
      catchError(this.handleError)
    );
  }

  addDrivers(input) {
    return this.http.post<Drivers>(this.serverUrl + 'data-list/drivers',input).pipe(
      catchError(this.handleError)
    );
  }

  addColor(input) {
    return this.http.post<Colors>(this.serverUrl + 'data-list/colors',input).pipe(
      catchError(this.handleError)
    );
  }

  addProduct(input) {
    return this.http.post<Orders>(this.serverUrl + 'data-list/products',input).pipe(
      catchError(this.handleError)
    );
  }

  updateProduct(input,id) {
    return this.http.post<Orders>(this.serverUrl + 'data-list/products/'+id,input).pipe(
      catchError(this.handleError)
    );
  }


  addDriver(input) {
    return this.http.post<Orders>(this.serverUrl + 'add_driver',input).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {

      // A client-side or network error occurred. Handle it accordingly.

      console.error('An error occurred:', error.error.message);
    } else {

      // The backend returned an unsuccessful response code.

      // The response body may contain clues as to what went wrong.

      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }

    // return an observable with a user-facing error message
    
    return throwError('Something bad happened. Please try again later.');
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

