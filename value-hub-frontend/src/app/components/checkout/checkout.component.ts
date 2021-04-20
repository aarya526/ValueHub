import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CartService } from 'src/app/services/cart.service';
import { ValueHubFormService } from 'src/app/services/value-hub-form.service';
import { Router } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/common/order';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { ValueHubValidators } from 'src/app/validators/value-hub-validators';
import { CheckoutService } from 'src/app/services/checkout.service';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  totalPrice: number = 0.00;
  totalQuantity: number = 0;
  checkoutFormGroup: FormGroup;
  errors : Error[] = [];
  cartItems: CartItem[] = [];
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];
  countries : Country[] = [];
  shippingAddressStates : State[] = [];
  billingAddressStates : State[] = [];

  constructor(private formBuilder: FormBuilder,
    private valueHubService: ValueHubFormService,
    private router: Router,
    private cartService: CartService,
    private checkoutService: CheckoutService) { }


  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required,Validators.minLength(2), ValueHubValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required,Validators.minLength(2), ValueHubValidators.notOnlyWhitespace]),
        email: new FormControl('', 
                                 [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required,Validators.minLength(2), ValueHubValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required,Validators.minLength(2), ValueHubValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required,Validators.minLength(2), ValueHubValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required,Validators.minLength(2), ValueHubValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required,Validators.minLength(2), ValueHubValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required,Validators.minLength(2), ValueHubValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType:  new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required,Validators.minLength(2), ValueHubValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required,Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required,Validators.pattern('[0-9]{3}')]),
        expirationMonth:  new FormControl('', [Validators.required]),
        expirationYear:  new FormControl('', [Validators.required])
      })
    });

    this.getCartTotalAndQuantity();
    //populate credit card month

    const startMonth: number = new Date().getMonth() + 1;
    this.valueHubService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    )

    //populate countries

    this.valueHubService.getCountries().subscribe(
      data => {
        console.log("retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    )

    //populate credit card years

    this.valueHubService.getCreditCardYears().subscribe(
      data => this.creditCardYears = data
    )
  }


  //populate states
  getStates(formGroupName : string){

    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;
    console.log(`${formGroupName} country code : ${countryCode}`);
    console.log(`${formGroupName} country name : ${countryName}`);

     this.valueHubService.getStates(countryCode).subscribe(
       data => {
        if(formGroupName === 'shippingAddress'){

          this.shippingAddressStates = data;

        }else{
          this.billingAddressStates = data;
        }

        // set first item by default
        formGroup.get('state').setValue(data[0]);
       }
     )

  }

  onSubmit() {
   console.log('handling submit button');
   console.log(this.checkoutFormGroup.get('customer').value);
   if(this.checkoutFormGroup.invalid){
     this.checkoutFormGroup.markAllAsTouched();
     return;
   }

   // set up order
   let order = new Order();
   order.totalPrice = this.totalPrice;
   order.totalQuantity = this.totalQuantity;

   // get cart item
   const cartItems = this.cartService.cartItems;

   // create order items from cartitems

   // long way
   let orderItems: OrderItem[] = [];
   for(let i=0; i < cartItems.length; i++){
     orderItems[i] = new OrderItem(cartItems[i]);
   }

   // short wat

  //  let orderItems: OrderItem[] = cartItems.map(c => new OrderItem(c));


   // set up purchase
   let purchase = new Purchase();
  

   // populate purchase - customer
   purchase.customer = this.checkoutFormGroup.controls['customer'].value;
  
   // populate purchase - shipping
   purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
   const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
   const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
   purchase.shippingAddress.state = shippingState.name;
   purchase.shippingAddress.country = shippingCountry.name;

   // populate purchase -billing

   purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
   const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
   const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
   purchase.billingAddress.state = billingState.name;
   purchase.billingAddress.country = billingCountry.name;
  
   // populate purchase - order and order items
   purchase.order = order;
   purchase.orderItems = orderItems;

   // call api via checkout service
   this.checkoutService.placeOrder(purchase).subscribe({
       next: response => {
         alert(`Your Order has been recieved.\nOrder Tracking Number: ${response.orderTrackingNumber}`);

         // reset cart
         this.resetCart();
       },
       error: err => {
         alert(`There was an error: ${err.message}`);
       }
     }
   );

  }
  resetCart() {
    // reset cart after order

    this.cartService.cartItems = [];
    this.cartService.totalQuantity.next(0);
    this.cartService.totalPrice.next(0);
    // reset form data
    this.checkoutFormGroup.reset();

    //navigate back to main product page

    this.router.navigateByUrl('/products');
  }


  get firstName(){  return this.checkoutFormGroup.get('customer.firstName');}
  get lastName(){  return this.checkoutFormGroup.get('customer.lastName');}
  get email(){  return this.checkoutFormGroup.get('customer.email');}
  get shippingAddressStreet(){  return this.checkoutFormGroup.get('shippingAddress.street');}
  get shippingAddressCity(){  return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingAddressState(){  return this.checkoutFormGroup.get('shippingAddress.state');}
  get shippingAddressCountry(){  return this.checkoutFormGroup.get('shippingAddress.country');}
  get shippingAddressZipcode(){  return this.checkoutFormGroup.get('shippingAddress.zipCode');}
  get billingAddressStreet(){  return this.checkoutFormGroup.get('billingAddress.street');}
  get billingAddressCity(){  return this.checkoutFormGroup.get('billingAddress.city');}
  get billingAddressState(){  return this.checkoutFormGroup.get('billingAddress.state');}
  get billingAddressCountry(){  return this.checkoutFormGroup.get('billingAddress.country');}
  get billingAddressZipcode(){  return this.checkoutFormGroup.get('billingAddress.zipCode');}

  get creditCardType(){  return this.checkoutFormGroup.get('creditCard.cardType');}
  get creditCardNameOnCard(){  return this.checkoutFormGroup.get('creditCard.nameOnCard');}
  get creditCardNumber(){  return this.checkoutFormGroup.get('creditCard.cardNumber');}
  get creditCardSecurityCode(){  return this.checkoutFormGroup.get('creditCard.securityCode');}
  get creditCardExpirationYear(){  return this.checkoutFormGroup.get('creditCard.expirationYear');}
  get creditCardExpirationMonth(){  return this.checkoutFormGroup.get('creditCard.expirationMonth');}

  copyShippingToBilling(event) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress.
        setValue(this.checkoutFormGroup.controls.shippingAddress.value);

        this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAddressStates = [];
    }

  }

  handleMonthsAndYears() {
    const creditCardForm = this.checkoutFormGroup.get("creditCard");
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = creditCardForm.value.expirationYear;

    let startMonth: number;
    if (selectedYear === currentYear) {

      startMonth = new Date().getMonth() + 1;

    } else {
      startMonth = 1;
    }

    this.valueHubService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    )


  }

  getCartTotalAndQuantity() {
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    )

    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    )
    this.cartService.computeCartTotals();

    if (this.totalQuantity < 1) {
      this.router.navigate(['/shoppingCart'])
    }
  }

}
