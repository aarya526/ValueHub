import { Customer } from './customer';
import { CartItem } from './cart-item';
import { BillingAddress } from './billing-address';
import { ShippingAddress } from './shipping-address';
import { PaymentDetails } from './payment-details';

export class Error {

    customer: Customer;
    subTotal: number;
    quantityOrdered: number;
    billingAddress: BillingAddress;
    shippingAddress: ShippingAddress;
    paymentDetails: PaymentDetails;
}
