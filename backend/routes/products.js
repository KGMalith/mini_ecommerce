const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');

/* GET ALL PRODUCTS */
router.get('/', function(req, res) {
  let page = (req.query.page !== undefined && req.query.page !== 0 )? req.query.page : 1; //set current page number
  const limit = (req.query.limit !== undefined && req.query.limit !== 0 )?req.query.limit:10; //set the limit of items per page

  let startValue = 0;
  let endValue = 10;

  if(page > 0){
    startValue = (page * limit) - limit; //0,10,20,30 ...
    endValue = (page * limit);
  }

  database.table('products as p')
      .join([{
        table:'categories as c',
        on: 'c.id = p.cat_id'
      }])
      .withFields(['c.title as category','p.title as name','p.price','p.quantity','p.image','p.id','p.description'])
      .slice(startValue,endValue)
      .sort({id: 1})
      .getAll()
      .then(prods =>{
        if(prods.length > 0){
          res.status(200).json({
            count:prods.length,
            products:prods
          });
        }else{
          res.json({message:'No products found'});
        }
      }).catch(err => console.log(err));
});

/* GET SINGLE PRODUCT */
router.get('/:prodId',(req,res) =>{
  let productId = req.params.prodId;

  database.table('products as p')
      .join([{
        table:'categories as c',
        on: 'c.id = p.cat_id'
      }])
      .withFields(['c.title as category','p.title as name','p.price','p.quantity','p.image','p.images','p.id','p.description'])
      .filter({'p.id':productId})
      .get()
      .then(prod =>{
        if(prod){
          res.status(200).json(prod);
        }else{
          res.json({message:'No product found with product id'});
        }
      }).catch(err => console.log(err));

});

/* GET ALL PRODUCTS FOR SINGLE CATEGORY */

router.get('/category/:catName',(req,res) =>{
  let cat_title = req.params.catName;
  let page = (req.query.page !== undefined && req.query.page !== 0 )? req.query.page : 1; //set current page number
  const limit = (req.query.limit !== undefined && req.query.limit !== 0 )?req.query.limit:10; //set the limit of items per page

  let startValue = 0;
  let endValue = 10;

  if(page > 0){
    startValue = (page * limit) - limit; //0,10,20,30 ...
    endValue = (page * limit);
  }

  database.table('products as p')
      .join([{
        table:'categories as c',
        on: `c.id = p.cat_id WHERE c.title LIKE '%${cat_title}%'`
      }])
      .withFields(['c.title as category','p.title as name','p.price','p.quantity','p.image','p.id'])
      .slice(startValue,endValue)
      .sort({id: 1})
      .getAll()
      .then(prods =>{
        if(prods.length > 0){
          res.status(200).json({
            count:prods.length,
            products:prods
          });
        }else{
          res.json({message:'No products found'});
        }
      }).catch(err => console.log(err));

});

module.exports = router;
