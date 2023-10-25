const express=require('express')
const router=express.Router()
const{ getCart,
    deleteCart,
    addtoCart,
    editCart}=require('../Api/cart')

router.post('/addtocart',addtoCart,);
router.get('getcar',getCart);
router.delete('/delte',deleteCart)
router.patch('editcart',editCart)
module.exports=router