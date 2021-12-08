export interface ProductModelServer{
    id:number;
    name:String;
    category:String;
    price:number;
    quantity:number;
    image:String;
    images:String;
    description:String;
}

export interface ServerResponse{
    count:number;
    products:ProductModelServer[];
}