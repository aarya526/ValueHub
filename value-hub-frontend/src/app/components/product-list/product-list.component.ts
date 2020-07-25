import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [
    {
      id: 1,
      name: "Apple Iphone 6s",
      sku: "app1",
      description: "Apple Iphone 6s",
      unitPrice: 849,
      imageUrl: "/assets/images/products/books/book-luv2code-1000.png",
      active: true,
      unitsInStock: 8,
      dateCreated: undefined,
      lastUpdated: undefined
    }, {
      id: 2,
      name: "Apple Iphone 7",
      sku: "app1",
      description: "Apple Iphone 7",
      unitPrice: 1200,
      imageUrl: "/assets/images/products/books/book-luv2code-1000.png",
      active: true,
      unitsInStock: 11,
      dateCreated: undefined,
      lastUpdated: undefined
    }, {
      id: 3,
      name: "Apple Iphone 7 plus",
      sku: "app1",
      description: "Apple Iphone 7 plus",
      unitPrice: 1049,
      imageUrl: "/assets/images/products/books/book-luv2code-1000.png",
      active: true,
      unitsInStock: 8,
      dateCreated: undefined,
      lastUpdated: undefined
    }, {
      id: 4,
      name: "Apple Iphone 8",
      sku: "app1",
      description: "Apple Iphone 8",
      unitPrice: 999,
      imageUrl: "/assets/images/products/books/book-luv2code-1000.png",
      active: true,
      unitsInStock: 12,
      dateCreated: undefined,
      lastUpdated: undefined
    }];
  currentCategoryId: number = 1;
  searchMode: boolean = false;
  previousCategoryId: number = 1;
  previousSearch: string = null;

  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;


  constructor(private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has("keyword");
    if (this.searchMode) {

      this.handleSearchProducts();

    } else {
      this.handleListProducts();
    }

  }
  handleSearchProducts() {

    const theKeyword: string = this.route.snapshot.paramMap.get("keyword");

    if (this.previousSearch != theKeyword) {
      this.thePageNumber = 1;
    }
    this.previousSearch = theKeyword;
    //now search products using keyword
    this.productService.searchProductsPagination(this.thePageNumber - 1, this.thePageSize, theKeyword).subscribe(this.processResult());
  }

  handleListProducts() {
    // check id parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has("id");
    if (hasCategoryId) {
      //get the "id" param string. convert string to number using "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get("id");
    } else {

      //not available then category id = 1
      this.currentCategoryId = 1;
    }

    //check if we have a different category id than previous
    //Note : Angular will reuse a component if it is currently in use
    //

    if (this.previousCategoryId != this.currentCategoryId) {

      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    // console.log(`currentCategoryId : ${this.currentCategoryId}, Page Number : ${this.thePageNumber}`);

    this.productService.getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId).subscribe(this.processResult());

  }

  processResult() {
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  updatePageSize(thePageSize: number) {

    this.thePageSize = thePageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(product: Product) {
    console.log(`productName : ${product.name}, price : ${product.unitPrice}`);
    const cartItem: CartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }
}
