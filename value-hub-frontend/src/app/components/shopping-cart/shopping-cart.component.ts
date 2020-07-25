import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalQuantity: number = 0.00;
  totalPrice: number = 0;

  constructor(private cartService: CartService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getCartItems();
    });
  }

  getCartItems() {

    //retrieve cartItems
    this.cartItems = this.cartService.cartItems;

    // set totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    // set totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    // compute Cart Total from cartService
    this.cartService.computeCartTotals();

  }

  incrementQuantity(cartItem: CartItem) {
    this.cartService.addToCart(cartItem);
  }

  decrementQuantity(cartItem : CartItem){

    this.cartService.decrementQuantity(cartItem);

  }

  remove(cartItem : CartItem){
    this.cartService.removeCartItem(cartItem);
  }


}
