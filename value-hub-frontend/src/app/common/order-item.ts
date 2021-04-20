import { CartItem } from "./cart-item";

export class OrderItem {

    imageUrl: string;
    unitPrice: Number;
    quantity: Number;
    productId: string;

    constructor(cartItem: CartItem){
        this.imageUrl = cartItem.imageUrl;
        this.quantity = cartItem.quantity;
        this.unitPrice = cartItem.unitPrice;
        this.productId = cartItem.id;
    }
}
