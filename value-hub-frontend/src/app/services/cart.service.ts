import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';
import { createHostListener } from '@angular/compiler/src/core';
import { fakeAsync } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(cartItem: CartItem) {
    //check if item is already in cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if (this.cartItems.length > 0) {

      // find item by id

      // for (let c of this.cartItems) {
      //   if (c.id === cartItem.id) {
      //     existingCartItem = c;
      //     break;
      //   }
      // }

      existingCartItem = this.cartItems.find(c => c.id === cartItem.id);
      //check if we found it
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if (alreadyExistsInCart) {
      if (existingCartItem.quantity < existingCartItem.product.unitsInStock) {
        existingCartItem.quantity++;
      } else {
        alert('Quantity Exceeded!');
        return false;
      }
    } else {
      //just add the item to the array
      this.cartItems.push(cartItem);
    }

    //compute total price and total quantity
    this.computeCartTotals();

  }
  computeCartTotals() {

    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    for (let c of this.cartItems) {

      totalPriceValue += c.unitPrice * c.quantity;
      totalQuantityValue += c.quantity;

    }

    //publish the data ..all subscribers will receive the data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //log cart data
    this.logCartData(totalPriceValue, totalQuantityValue);
  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {

    console.log('======Items in the Cart======')
    console.log(this.cartItems);
    console.log("Total Price : " + totalPriceValue.toFixed(2) + ", Total Quantity : " + totalQuantityValue);
  }

  decrementQuantity(c: CartItem) {

    c.quantity -= 1;
    if (c.quantity == 0) {

      this.removeCartItem(c);

    } else {
      this.computeCartTotals();
    }

  }
  removeCartItem(cartItem: CartItem) {
    const index = this.cartItems.findIndex(c => c.id === cartItem.id);
    if (index > -1) {
      this.cartItems.splice(index, 1);
      this.computeCartTotals();
    }
  }
}
