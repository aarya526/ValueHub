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
    private orderService: OrderService) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required,Validators.minLength(2), ValueHubValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required,Validators.minLength(2), ValueHubValidators.notOnlyWhitespace]),
        email: new FormControl('', 
                                 [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
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
   }
  }


  get firstName(){  return this.checkoutFormGroup.get('customer.firstName');}
  get lastName(){  return this.checkoutFormGroup.get('customer.lastName');}
  get email(){  return this.checkoutFormGroup.get('customer.email');}

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
