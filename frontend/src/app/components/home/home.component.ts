import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {ProductService} from '../../services/product.service';
import {ProductModelServer,ServerResponse} from '../../models/product.model';
import {CartService} from '../../services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  products: ProductModelServer[] = [];

  constructor(private productService:ProductService,private router:Router,private cartService:CartService) { }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((prods:ServerResponse) =>{
      this.products = prods.products;
    })
  }

  selectProduct(id:Number){
    this.router.navigate(['/product',id]).then();
  }

  AddToCart(id:number){
    this.cartService.AddProductsToCart(id);
  }

}
