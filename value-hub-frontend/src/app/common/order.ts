import { CartItem } from './cart-item';
import { BillingAddress } from './billing-address';
import { ShippingAddress } from './shipping-address';
import { PaymentDetails } from './payment-details';
import { Customer } from './customer';

export class Order {

    customer: Customer;
    subTotal: number;
    quantityOrdered: number;
    cartItems: CartItem[];
    billingAddress: BillingAddress;
    shippingAddress: ShippingAddress;
    paymentDetails: PaymentDetails;

}
