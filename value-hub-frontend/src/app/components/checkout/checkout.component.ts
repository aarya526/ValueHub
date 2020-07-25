import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CartService } from 'src/app/services/cart.service';
import { ValueHubFormService } from 'src/app/services/value-hub-form.service';
import { Router } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  totalPrice: number = 0.00;
  totalQuantity: number = 0;
  checkoutFormGroup: FormGroup;

  cartItems: CartItem[] = [];

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];


  constructor(private formBuilder: FormBuilder,
    private valueHubService: ValueHubFormService,
    private router: Router,
    private cartService: CartService) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
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

    //populate credit card years

    this.valueHubService.getCreditCardYears().subscribe(
      data => this.creditCardYears = data
    )
  }

  onSubmit() {
    console.log('Handling Submit Button!');
    console.log(this.checkoutFormGroup.get("customer").value);
    console.log(this.checkoutFormGroup.get("shippingAddress").value);
    console.log(this.checkoutFormGroup.get("billingAddress").value);
    console.log(this.checkoutFormGroup.get("creditCard").value);
  }

  copyShippingToBilling(event) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress.
        setValue(this.checkoutFormGroup.controls.shippingAddress.value);
    } else {
      this.checkoutFormGroup.controls.billingAddress.reset();
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

    if(this.totalQuantity < 1){
      this.router.navigate(['/shoppingCart'])
    }
  }
 
}
