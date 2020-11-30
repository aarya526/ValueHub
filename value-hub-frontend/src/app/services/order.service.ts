import { Injectable } from '@angular/core';
import { Order } from '../common/order';
import { Observable, throwError, Subject } from 'rxjs';
import { BillingAddress } from '../common/billing-address';
import { ShippingAddress } from '../common/shipping-address';
import { PaymentDetails } from '../common/payment-details';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl = "http://localhost:8080/api/placeOrder";

  errors: Subject<Error[]> = new Subject<Error[]>();

  constructor(private httpClient: HttpClient) { }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      // console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(error.error);
  }

  placeOrder(order: Order) {

    console.log(order);
    this.httpClient.post(this.baseUrl, order, {
      responseType: "text"
    })
      .pipe(
        catchError(this.handleError)
      )
      .subscribe(
        data => console.log(data)
      )
  }

}


