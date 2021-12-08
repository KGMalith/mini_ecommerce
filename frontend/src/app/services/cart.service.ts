import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { OrderService } from './order.service';
import { ProductService } from './product.service';
import {CartModelPublic, CartModelServer} from '../models/cart.model';
import { BehaviorSubject } from 'rxjs';
import { ProductModelServer } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private SERVER_URL = environment.SERVER_URL;

  //Data variable to store the cart information on the client's local storage
  private cartDataClient:CartModelPublic = {
    total:0,
    prodData:[{id:0,incart:0}]
  }

  //Data variable to store cart information on angular service
  private cartDataServer:CartModelServer = {
    total:0,
    data:[{numInCart:0,product:undefined}]
  }

  //Observables for the components to subscribe
  cartTotal$ = new BehaviorSubject<number>(0);
  cartData$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);



  constructor(private http:HttpClient,private router:Router,private productService:ProductService,private orderService:OrderService) {
    this.cartTotal$.next(this.cartDataServer.total);
    this.cartData$.next(this.cartDataServer);

    //get information from local storage (if any)
    let info:CartModelPublic = JSON.parse(localStorage.getItem('cart'));

    if(info !== null && info !== undefined && info.prodData[0].incart !== 0){
      this.cartDataClient = info;

      this.cartDataClient.prodData.forEach(p =>{
        this.productService.getSingleProduct(p.id).subscribe((actualProductInfo:ProductModelServer)=>{
          if(this.cartDataServer.data[0].numInCart === 0){
            this.cartDataServer.data[0].numInCart = p.incart;
            this.cartDataServer.data[0].product = actualProductInfo;
            //============== calculate total=========

            //============== calculate total=========
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart',JSON.stringify(this.cartDataClient));

          }else{
            this.cartDataServer.data.push({
              numInCart:p.incart,
              product:actualProductInfo
            });
            //============== calculate total=========

            //============== calculate total=========
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart',JSON.stringify(this.cartDataClient));

          }
          this.cartData$.next({...this.cartDataServer});
        })
      })

    }

  }

  AddProductsToCart(id:number,quantity?:number){
    this.productService.getSingleProduct(id).subscribe(prod =>{
      //If cart is empty
      if(this.cartDataServer.data[0].product === undefined){
        this.cartDataServer.data[0].product = prod;
        this.cartDataServer.data[0].numInCart = quantity !== undefined?quantity:1;
        //calculate total amount
        this.cartDataClient.prodData[0].incart = this.cartDataServer.data[0].numInCart;
        this.cartDataClient.prodData[0].incart = prod.id;
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
        this.cartData$.next({...this.cartDataServer});
        //display toast notification
      }
      //If cart has some items
      else{
        let index = this.cartDataServer.data.findIndex(p =>p.product.id === prod.id); // -1 or index number
        //if that item already in the cart
        if(index !== -1){
          if(quantity !== undefined && quantity <= prod.quantity){
            this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.quantity ? quantity : prod.quantity;
          }else{
            this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.quantity ? this.cartDataServer.data[index].numInCart++ : prod.quantity;
          }
          this.cartDataClient.prodData[index].incart = this.cartDataServer.data[index].numInCart;
          //display toast
        }
        //if that item is not in the cart
        else{
          this.cartDataServer.data.push({
            numInCart:1,
            product:prod
          });
          this.cartDataClient.prodData.push({
            incart:1,
            id:prod.id
          });
          //display toast
          //calculate total amount
          this.cartDataClient.total = this.cartDataServer.total;
          localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
          this.cartData$.next({...this.cartDataServer});
        }
      }
        
    });

  }

  updateCartItems(index:number,increase:boolean){
    let data = this.cartDataServer.data[index];
    if(increase){
      data.numInCart < data.product.quantity ? data.numInCart++ : data.product.quantity;
      this.cartDataClient.prodData[index].incart = data.numInCart;
      //calculate total amount
      this.cartDataClient.total = this.cartDataServer.total;
      localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
      this.cartData$.next({...this.cartDataServer});
    }else{
      data.numInCart --;
      if(data.numInCart < 1){
        //delete product from cart
        this.cartData$.next({...this.cartDataServer});
      }else{
        this.cartData$.next({...this.cartDataServer});
        this.cartDataClient.prodData[index].incart = data.numInCart;
        //calculate total
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
      }
    }
  }

  DeleteProductFromCart(index:number){
    if(window.confirm('Are you sure you want to remove the item?')){
      this.cartDataServer.data.splice(index,1);
      this.cartDataClient.prodData.splice(index,1);
      //calculate total
      this.cartDataClient.total = this.cartDataServer.total;
      if(this.cartDataClient.total === 0){
        this.cartDataClient = {
          total:0,
          prodData:[{id:0,incart:0}]
        }
        localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
      }else{
        localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
      }

      if(this.cartDataServer.total === 0){
        this.cartDataServer = {
          total:0,
          data:[{numInCart:0,product:undefined}]
        }
        this.cartData$.next({...this.cartDataServer});
      }else{
        this.cartData$.next({...this.cartDataServer});
      }

    }else{
      return;
    }
  }

  private CalculateTotal(){
    let Total = 0;
    this.cartDataServer.data.forEach(p =>{
      const {numInCart} = p;
      const {price} = p.product;

      Total += numInCart * price;
    })
    this.cartDataServer.total = Total;
    this.cartTotal$.next(this.cartDataServer.total);
  }

  private CheckoutFromCart(){
    
  }

}
