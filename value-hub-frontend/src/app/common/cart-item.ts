import { Product } from './product';

export class CartItem {

    id: number;
    name: string;
    imageUrl: string;
    unitPrice: number;
    quantity: number;
    product : Product;

    constructor(product: Product) {

        this.id = product.id;
        this.name = product.name;
        this.imageUrl = product.imageUrl;
        this.unitPrice = product.unitPrice;
        this.quantity = 1;
        this.product = product;
    }
}

