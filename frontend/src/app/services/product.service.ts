import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ProductModelServer, ServerResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private SERVER_URL = environment.SERVER_URL;

  constructor(private http:HttpClient,private router:Router) { }

  // This is for fetch all products from backend
  getAllProducts(numberOfResults = 10):Observable<ServerResponse>{
    
    return this.http.get<ServerResponse>(this.SERVER_URL+'/products',{
      params:{
        limit:numberOfResults.toString()
      }
    })

  }

  // This is for get single product from backend
  getSingleProduct(id:number):Observable<ProductModelServer>{
    
    return this.http.get<ProductModelServer>(this.SERVER_URL+'/products/'+id);

  }

  // Get products from one category
  getProductsFromCategory(catName:String):Observable<ProductModelServer[]>{
    
    return this.http.get<ProductModelServer[]>(this.SERVER_URL+'/products/category'+catName);

  }

}
